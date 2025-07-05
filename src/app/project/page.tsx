"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileManager, Project } from "@/lib/FileDEX";
import ProjectCard from "./_component/ProjectCard";

export default function EditorHome() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState("");
  const router = useRouter();

  FileManager.getUsageStats().then((stats) => {
    console.log("Usage Stats:", stats);
  });

  const refresh = async () => {
    const list = await FileManager.listProjects();
    setProjects(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleUpdate = async (updatedProject: Project) => {
    await FileManager.updateProject(updatedProject);
    refresh();
  };
  const handleCreate = async () => {
    const id = crypto.randomUUID();
    await FileManager.createProject(id, newName, `/projects/${id}`);
    setNewName("");
    refresh();
  };

  const handleDelete = async (id: string) => {
    await FileManager.deleteProject(id);
    refresh();
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Projects</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New project name"
          className="border px-2 py-1 flex-1"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Create
        </button>
      </div>
      <ul className="space-y-2">
        {projects.map((p) => (
          <ProjectCard
            project={p}
            onUpdate={(modifyProject) =>
              handleUpdate({ ...p, ...modifyProject })
            }
            key={p.id}
            onDelete={() => handleDelete(p.id)}
            onOpen={() => router.push(`/editor/${p.id}`)}
          />
        ))}
      </ul>
    </div>
  );
}
