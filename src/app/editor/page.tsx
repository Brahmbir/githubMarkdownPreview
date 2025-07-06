"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileManager } from "@/lib/FileDEX";
import { cn } from "@/lib/utils";
import { getRandomColourText } from "@/lib/projectColour";

export default function EditorEntryPage() {
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [textColor, setTextColor] = useState("cyan");

  useEffect(() => {
    setTextColor(getRandomColourText());
  }, []);

  useEffect(() => {
    if (hasRedirected) return;
    setHasRedirected(true);

    async function handleRedirect() {
      const recentProject = await FileManager.projects
        .getRecentlyOpened(1)
        .then((projects) => projects[0]);
      let projectId: string;
      if (recentProject) {
        projectId = recentProject.id;
      } else {
        const id = crypto.randomUUID();
        const newProject = await FileManager.projects.create(
          id,
          "New Project",
          `/projects/${id}`
        );
        projectId = newProject.id;
      }
      router.replace(`/editor/${projectId}`);
    }

    handleRedirect();
  }, [hasRedirected, router]);

  return (
    <div
      className={cn(
        "flex items-center justify-center h-screen bg-dracula-background",
        `text-[var(--${textColor})]`
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <div
          style={{
            borderColor: `color-mix(in oklab, var(--${textColor}) /* #fff = #ffffff */ 20%, transparent)`,
          }}
          className={cn(
            "w-12 h-12 border-4 border-dashed rounded-full animate-spin",
            "border-white/20"
          )}
        />
        <p
          style={{ color: `var(--${textColor})` }}
          className="text-sm tracking-wide transition-colors"
        >
          Loading your Project...
        </p>
      </div>
    </div>
  );
}
