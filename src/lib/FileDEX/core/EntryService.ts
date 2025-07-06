"use client";

import { FileEntry } from "../types";
import { DBService } from "./DBService";

export class EntryService {
  constructor(private db: DBService, private store = "entries") {}

  async create(entry: FileEntry) {
    await this.db.withStore(this.store, "readwrite", (store) =>
      store.add(entry)
    );
  }

  async put(entry: FileEntry) {
    await this.db.withStore(this.store, "readwrite", (store) =>
      store.put(entry)
    );
  }

  async get(path: string): Promise<FileEntry | undefined> {
    return this.db.get<FileEntry>(this.store, path);
  }

  async delete(path: string) {
    await this.db.withStore(this.store, "readwrite", (store) =>
      store.delete(path)
    );
  }

  async listByProject(projectId: string): Promise<FileEntry[]> {
    const db = await (this.db as any).dbPromise;
    return new Promise((res, rej) => {
      const tx = db.transaction(this.store, "readonly");
      const index = tx.objectStore(this.store).index("projectId");
      const req = index.getAll(projectId);
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
  }
}
