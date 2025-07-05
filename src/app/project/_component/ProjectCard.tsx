"use client";

import { Project } from "@/lib/FileDEX";
import { Colour, colours } from "@/lib/projectColour";
import { cn } from "@/lib/utils";
import { useState } from "react";

type ProjectUpdate = Omit<Project, "created" | "modified" | "rootPath" | "id">;

type ProjectCardProps = {
  project: Project;
  onOpen: () => void;
  onDelete: () => void;
  onUpdate: (updatedProject: ProjectUpdate) => void;
};

export default function ProjectCard({
  project,
  onOpen,
  onDelete,
  onUpdate,
}: ProjectCardProps) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const [newColor, setNewColor] = useState(project.color);

  const formattedDate = new Date(project.created).toLocaleDateString();

  console.log(crypto.randomUUID());

  const handleSave = () => {
    onUpdate({
      ...project,
      name: newName,
      color: newColor,
    });
    setEditing(false);
  };

  return (
    <div
      data-color={Object.keys(colours).find(
        (key) => colours[key as Colour] === project.color
      )}
      className={cn(
        `bg-(--color-background)`,
        ` rounded-xl bg p-4 shadow-md text-black w-full sm:w-72 relative`
      )}
    >
      {editing ? (
        <>
          <input
            type="text"
            className="w-full mb-2 px-2 py-1 rounded-md text-sm border border-gray-400"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <select
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-full mb-2 px-2 py-1 rounded-md text-sm border border-gray-400"
          >
            {Object.entries<string>(colours).map(([key, value]) => (
              <option key={key} value={value}>
                {key.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white text-sm px-3 py-1 rounded-md hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-500 text-sm hover:underline"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-sm text-gray-700 mb-1 font-medium">Project</div>
          <h2 className="text-xl font-bold mb-2 truncate">{project.name}</h2>
          <div className="text-xs text-gray-600 mb-4">
            Created on: {formattedDate}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={onOpen}
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700"
            >
              Open
            </button>
            <button
              onClick={onDelete}
              className="text-red-500 text-sm hover:underline"
            >
              Delete
            </button>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="absolute top-2 right-2 text-xs text-gray-700 hover:underline"
          >
            ✏️ Edit
          </button>
        </>
      )}
    </div>
  );
}
