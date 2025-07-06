"use client";

import { FileEntry, Snapshot, SnapshotEntry } from "../types";
import { BlobService } from "./BlodService";
import { DBService } from "./DBService";
import { EntryService } from "./EntryService";

export class SnapshotService {
  constructor(
    private db: DBService,
    private entryService: EntryService,
    private blobService: BlobService,
    private store = "snapshots"
  ) {}

  async create(projectId: string, message: string): Promise<string> {
    const entries = await this.entryService.listByProject(projectId);
    const root = await this.buildTree(entries, "", projectId);
    const snapshot: Snapshot = {
      id: crypto.randomUUID(),
      projectId,
      timestamp: Date.now(),
      message,
      root,
    };
    await this.db.withStore(this.store, "readwrite", (store) =>
      store.add(snapshot)
    );
    return snapshot.id;
  }

  async listByProject(projectId: string): Promise<Snapshot[]> {
    const all = await this.db.getAll<Snapshot>(this.store);
    return all.filter((s) => s.projectId === projectId);
  }

  async buildTree(
    entries: FileEntry[],
    prefix: string,
    projectId: string
  ): Promise<SnapshotEntry> {
    const node: SnapshotEntry = { path: prefix, type: "folder", children: [] };
    const children = entries.filter(
      (e) => e.path.startsWith(prefix) && e.path !== prefix
    );
    const childNames = new Set(
      children.map(
        (e) => e.path.slice(prefix.length).split("/").filter(Boolean)[0]
      )
    );

    for (const name of childNames) {
      const childPath = `${prefix}${prefix.endsWith("/") ? "" : "/"}${name}`;
      const entry = entries.find((e) => e.path === childPath);
      if (!entry) continue;
      if (entry.type === "folder") {
        node.children!.push(
          await this.buildTree(entries, childPath, projectId)
        );
      } else {
        const hash = await this.blobService.store(entry.content as Blob);
        node.children!.push({ path: childPath, type: "file", hash });
      }
    }

    return node;
  }

  async restore(snapshotId: string): Promise<void> {
    const snapshot = await this.db.get<Snapshot>(this.store, snapshotId);
    if (!snapshot) return;
    const entries = await this.entryService.listByProject(snapshot.projectId);
    for (const e of entries) await this.entryService.delete(e.path);
    await this.restoreEntry(snapshot.root, snapshot.projectId);
  }

  private async restoreEntry(
    entry: SnapshotEntry,
    projectId: string
  ): Promise<void> {
    if (entry.type === "folder") {
      await this.entryService.create({
        path: entry.path,
        type: "folder",
        created: Date.now(),
        modified: Date.now(),
        size: 0,
        projectId,
      });
      for (const child of entry.children || []) {
        await this.restoreEntry(child, projectId);
      }
    } else {
      const blob = await this.blobService.retrieve(entry.hash!);
      if (blob) {
        await this.entryService.put({
          path: entry.path,
          type: "file",
          content: blob,
          created: Date.now(),
          modified: Date.now(),
          size: blob.size,
          projectId,
        });
      }
    }
  }
}
