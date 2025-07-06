"use client";

import { getRandomColour } from "@/lib/projectColour";
import { Project } from "../types";
import { DBService } from "./DBService";

export class ProjectService {
  constructor(private db: DBService, private store = "projects") {}

  async create(id: string, name: string, rootPath: string): Promise<Project> {
    const now = Date.now();
    const project: Project = {
      id,
      name,
      color: getRandomColour(),
      rootPath,
      created: now,
      modified: now,
    };
    await this.db.withStore(this.store, "readwrite", (store) =>
      store.add(project)
    );
    return project;
  }

  async update(update: Partial<Project> & { id: string }) {
    const existing = await this.get(update.id);
    if (!existing) throw new Error("Project not found");
    const updated = { ...existing, ...update, modified: Date.now() };
    await this.db.withStore(this.store, "readwrite", (store) =>
      store.put(updated)
    );
  }

  get(id: string) {
    return this.db.get<Project>(this.store, id);
  }

  list() {
    return this.db.getAll<Project>(this.store);
  }

  delete(id: string) {
    return this.db.withStore(this.store, "readwrite", (store) =>
      store.delete(id)
    );
  }
  async getRecentlyOpened(limit = 1): Promise<Project[]> {
    const all = await this.list();
    return all
      .filter((p) => p.lastOpened)
      .sort((a, b) => (b.lastOpened ?? 0) - (a.lastOpened ?? 0))
      .slice(0, limit);
  }

  async markAsOpened(id: string): Promise<void> {
    const project = await this.get(id);
    if (!project) throw new Error("Project not found");
    await this.update({ id, lastOpened: Date.now() });
  }
}
