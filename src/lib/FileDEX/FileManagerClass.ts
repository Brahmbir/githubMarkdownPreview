"use client";

import { BlobService } from "./core/BlodService";
import { DBService } from "./core/DBService";
import { EntryService } from "./core/EntryService";
import { ProjectService } from "./core/ProjectService";
import { SnapshotService } from "./core/SnapshotService";

export class FileManagerFacade {
  readonly db: DBService;
  readonly projects: ProjectService;
  readonly entries: EntryService;
  readonly blobs: BlobService;
  readonly snapshots: SnapshotService;

  constructor() {
    const db = new DBService("web-editor-fs", 3, (db, oldVersion) => {
      if (oldVersion < 1) {
        const store = db.createObjectStore("entries", { keyPath: "path" });
        store.createIndex("projectId", "projectId", {});
        store.createIndex("type", "type", {});
      }
      if (oldVersion < 2) {
        db.createObjectStore("projects", { keyPath: "id" });
      }
      if (oldVersion < 3) {
        db.createObjectStore("blobs", { keyPath: "hash" });
        db.createObjectStore("snapshots", { keyPath: "id" });
      }
    });

    const projectService = new ProjectService(db);
    const entryService = new EntryService(db);
    const blobService = new BlobService(db);
    const snapshotService = new SnapshotService(db, entryService, blobService);

    this.db = db;
    this.projects = projectService;
    this.entries = entryService;
    this.blobs = blobService;
    this.snapshots = snapshotService;
  }
}
