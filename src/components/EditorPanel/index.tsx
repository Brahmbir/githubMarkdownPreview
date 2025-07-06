"use client";
import React, { useState, useRef, useCallback } from "react";
import { SideBar } from "./SidebarContent";
import ActivityBar from "./ActivityBar";
import SideBarElement from "./SideBar";
import CodeEditor from "./CodeEditor";
import { useParams } from "next/navigation";

export default function EditorPageStructure() {
  const { projectID } = useParams();

  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [activeView, setActiveView] = useState<SideBar>(SideBar.FileExplorer);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleViewClick = (view: SideBar) => {
    if (activeView === view && sidebarOpen) {
      setSidebarOpen(false);
      setActiveView(SideBar.None);
    } else {
      setActiveView(view);
      setSidebarOpen(true);
    }
  };

  const startResizing = useCallback(
    (e: React.MouseEvent) => {
      if (!sidebarOpen) return;
      setIsResizing(true);
      const startX = e.clientX;
      const startW = sidebarWidth;

      const doDrag = (moveEvent: MouseEvent) => {
        const newW = startW + moveEvent.clientX - startX;
        if (newW >= 200 && newW <= 600) setSidebarWidth(newW);
      };
      const stopDrag = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
      };
      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
      return () => {
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
      };
    },
    [sidebarOpen, sidebarWidth]
  );

  const codeContent = `// your code here`; // replace with actual content

  return (
    <div
      className="flex h-screen bg-[#1e1e1e] text-gray-300"
      style={{ cursor: isResizing ? "col-resize" : "default" }}
    >
      <ActivityBar
        activeView={activeView}
        sidebarOpen={sidebarOpen}
        onSelect={handleViewClick}
      />
      {sidebarOpen && (
        <SideBarElement
          width={sidebarWidth}
          sidebarRef={sidebarRef}
          isResizing={isResizing}
          onResizeStart={startResizing}
          activeView={activeView}
        />
      )}
      <CodeEditor />
    </div>
  );
}
