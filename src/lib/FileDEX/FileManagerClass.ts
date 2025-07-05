import { getRandomColour } from "../projectColour";
import { FileEntry, Project, Snapshot, SnapshotEntry } from "./types";
import { hashBlob } from "./utils";

export class FileManager {
  private dbName = "web-editor-fs";
  private entryStore = "entries";
  private projectStore = "projects";
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.openDB();
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 3); // bump version from 2 to 3

      req.onupgradeneeded = (event) => {
        const db = req.result;
        const oldVersion = (event as IDBVersionChangeEvent).oldVersion;

        if (oldVersion < 1) {
          const store = db.createObjectStore(this.entryStore, {
            keyPath: "path",
          });
          store.createIndex("projectId", "projectId", {});
          store.createIndex("type", "type", {});
        }

        if (oldVersion < 2) {
          db.createObjectStore(this.projectStore, { keyPath: "id" });
        }

        // New stores for snapshot support
        if (oldVersion < 3) {
          db.createObjectStore("blobs", { keyPath: "hash" });
          db.createObjectStore("snapshots", { keyPath: "id" });
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private async withStore<T>(
    storeName: string,
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => IDBRequest | Promise<any>
  ): Promise<T> {
    const db = await this.dbPromise;
    return new Promise<T>((res, rej) => {
      const tx = db.transaction([storeName], mode);
      const store = tx.objectStore(storeName);
      Promise.resolve(callback(store))
        .then(() => {
          tx.oncomplete = () => res(null as any);
          tx.onerror = () => rej(tx.error);
        })
        .catch(rej);
    });
  }

  private async storeBlob(content: Blob): Promise<string> {
    const hash = await hashBlob(content);
    await this.withStore<void>("blobs", "readwrite", (store) =>
      store.put({ hash, content })
    );
    return hash;
  }

  private async getBlob(hash: string): Promise<Blob | undefined> {
    const db = await this.dbPromise;
    return new Promise((res, rej) => {
      const tx = db.transaction("blobs", "readonly");
      const req = tx.objectStore("blobs").get(hash);
      req.onsuccess = () => res(req.result?.content);
      req.onerror = () => rej(req.error);
    });
  }

  // ----- Project Management -----

  async createProject(
    id: string,
    name: string,
    rootPath: string
  ): Promise<void> {
    const now = Date.now();
    const project: Project = {
      id,
      name,
      color: getRandomColour(),
      rootPath,
      created: now,
      modified: now,
    };
    await this.withStore<void>(this.projectStore, "readwrite", (store) =>
      store.add(project)
    );
    // ensure root folder exists
    await this.mkdir(rootPath, id);
  }

  async listProjects(): Promise<Project[]> {
    const db = await this.dbPromise;
    return new Promise((res, rej) => {
      const tx = db.transaction(this.projectStore, "readonly");
      const store = tx.objectStore(this.projectStore);
      const req = store.getAll();
      req.onsuccess = () => res(req.result as Project[]);
      req.onerror = () => rej(req.error);
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    const db = await this.dbPromise;
    return new Promise((res, rej) => {
      const tx = db.transaction(this.projectStore, "readonly");
      const req = tx.objectStore(this.projectStore).get(id);
      req.onsuccess = () => res(req.result as Project);
      req.onerror = () => rej(req.error);
    });
  }

  async updateProject(
    project: Partial<Project> & { id: string }
  ): Promise<void> {
    const existing = await this.getProject(project.id);
    if (!existing) throw new Error("Project not found");
    const updated: Project = { ...existing, ...project, modified: Date.now() };
    await this.withStore<void>(this.projectStore, "readwrite", (store) =>
      store.put(updated)
    );
  }

  async deleteProject(id: string): Promise<void> {
    const project = await this.getProject(id);
    if (!project) return;
    // delete all entries under project
    const entries = await this.listEntriesByProject(id);
    for (const e of entries) {
      await this.deleteEntry(e.path);
    }
    // delete project
    await this.withStore<void>(this.projectStore, "readwrite", (store) =>
      store.delete(id)
    );
  }

  // ----- Snapshot Management -----
  async createSnapshot(projectId: string, message: string): Promise<string> {
    const entries = await this.listEntriesByProject(projectId);
    const root = await this.buildSnapshotTree(entries, "", projectId);

    const id = crypto.randomUUID();
    const snapshot: Snapshot = {
      id,
      projectId,
      timestamp: Date.now(),
      message,
      root,
    };

    await this.withStore<void>("snapshots", "readwrite", (store) =>
      store.add(snapshot)
    );

    return id;
  }

  private async buildSnapshotTree(
    entries: FileEntry[],
    prefix: string,
    projectId: string
  ): Promise<SnapshotEntry> {
    const node: SnapshotEntry = { path: prefix, type: "folder", children: [] };
    const children = entries.filter(
      (e) => e.path.startsWith(prefix) && e.path !== prefix
    );

    const childPaths = new Set(
      children.map(
        (e) => e.path.slice(prefix.length).split("/").filter(Boolean)[0]
      )
    );

    for (const childName of childPaths) {
      const childPath = `${prefix}${
        prefix.endsWith("/") ? "" : "/"
      }${childName}`;
      const entry = entries.find((e) => e.path === childPath);
      if (!entry) continue;

      if (entry.type === "folder") {
        node.children!.push(
          await this.buildSnapshotTree(entries, childPath, projectId)
        );
      } else {
        const content = entry.content as Blob;
        const hash = await this.storeBlob(content);
        node.children!.push({ path: childPath, type: "file", hash });
      }
    }

    return node;
  }
  async restoreSnapshot(snapshotId: string): Promise<void> {
    const db = await this.dbPromise;
    const snapshot = await new Promise<Snapshot>((res, rej) => {
      const tx = db.transaction("snapshots", "readonly");
      const req = tx.objectStore("snapshots").get(snapshotId);
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });

    // Delete current entries in project
    const entries = await this.listEntriesByProject(snapshot.projectId);
    for (const e of entries) await this.deleteEntry(e.path);

    // Restore recursively
    await this.restoreSnapshotEntry(snapshot.root, snapshot.projectId);
  }

  private async restoreSnapshotEntry(
    entry: SnapshotEntry,
    projectId: string
  ): Promise<void> {
    if (entry.type === "folder") {
      await this.mkdir(entry.path, projectId);
      for (const child of entry.children ?? []) {
        await this.restoreSnapshotEntry(child, projectId);
      }
    } else {
      const blob = await this.getBlob(entry.hash!);
      if (blob) {
        await this.writeFile(entry.path, blob, projectId);
      }
    }
  }

  // ----- File/Folder Operations -----

  async mkdir(path: string, projectId: string): Promise<void> {
    const now = Date.now();
    const entry: FileEntry = {
      path,
      type: "folder",
      created: now,
      modified: now,
      size: 0,
      projectId,
    };
    await this.withStore<void>(this.entryStore, "readwrite", (store) =>
      store.add(entry)
    );
  }

  async writeFile(
    path: string,
    content: Blob | string,
    projectId: string
  ): Promise<void> {
    const now = Date.now();
    const size =
      typeof content === "string"
        ? new TextEncoder().encode(content).length
        : content.size;
    const entry: FileEntry = {
      path,
      type: "file",
      content,
      created: now,
      modified: now,
      size,
      projectId,
    };
    await this.withStore<void>(this.entryStore, "readwrite", (store) =>
      store.put(entry)
    );
  }

  async readFile(path: string): Promise<Blob | string | undefined> {
    const db = await this.dbPromise;
    return new Promise((res, rej) => {
      const tx = db.transaction(this.entryStore, "readonly");
      const req = tx.objectStore(this.entryStore).get(path);
      req.onsuccess = () => res(req.result?.content);
      req.onerror = () => rej(req.error);
    });
  }

  async deleteEntry(path: string): Promise<void> {
    await this.withStore<void>(this.entryStore, "readwrite", (store) =>
      store.delete(path)
    );
  }

  async listDirectory(prefix: string, projectId: string): Promise<FileEntry[]> {
    const results: FileEntry[] = [];
    const db = await this.dbPromise;
    return new Promise((res, rej) => {
      const tx = db.transaction(this.entryStore, "readonly");
      const store = tx.objectStore(this.entryStore);
      const index = store.index("projectId");
      const range = IDBKeyRange.only(projectId);
      const cursorReq = index.openCursor(range);
      cursorReq.onsuccess = () => {
        const cursor = cursorReq.result;
        if (cursor) {
          const entry: FileEntry = cursor.value;
          if (entry.path.startsWith(prefix) && entry.path !== prefix) {
            const relative = entry.path
              .slice(prefix.length)
              .split("/")
              .filter(Boolean)[0];
            if (relative) {
              if (!results.find((r) => r.path === `${prefix}/${relative}`)) {
                store.get(`${prefix}/${relative}`).onsuccess = (ev) => {
                  const child = (ev.target as IDBRequest).result;
                  if (child) results.push(child);
                };
              }
            }
          }
          cursor.continue();
        } else {
          tx.oncomplete = () => res(results);
        }
      };
      cursorReq.onerror = () => rej(cursorReq.error);
    });
  }

  async listEntriesByProject(projectId: string): Promise<FileEntry[]> {
    const db = await this.dbPromise;
    return new Promise((res, rej) => {
      const tx = db.transaction(this.entryStore, "readonly");
      const index = tx.objectStore(this.entryStore).index("projectId");
      const req = index.getAll(projectId);
      req.onsuccess = () => res(req.result as FileEntry[]);
      req.onerror = () => rej(req.error);
    });
  }

  /**
   * Returns storage quota and usage (in bytes) if supported.
   */
  async getUsageStats(): Promise<{ usage: number; quota: number } | null> {
    if (navigator.storage && navigator.storage.estimate) {
      const { usage, quota } = await navigator.storage.estimate();
      return { usage: usage || 0, quota: quota || 0 };
    }
    return null;
  }
}
