import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  Folder,
  FolderOpen,
  Plus,
  Search,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";

export interface IFileExplorerProps {}

export default function FileExplorer(props: IFileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["tools"])
  );

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const fileTree = [
    { name: "images", type: "folder", children: [] },
    {
      name: "tools",
      type: "folder",
      children: [
        { name: "mailer.php", type: "file", icon: "🟣" },
        { name: "main.js", type: "file", icon: "🟨" },
        { name: "script.py", type: "file", icon: "🐍", active: true },
        { name: "index.css", type: "file", icon: "🔷" },
      ],
    },
    { name: "third_party", type: "folder", children: [] },
    { name: "sqlite3", type: "folder", children: [] },
    { name: "sqlite3", type: "folder", children: [] },
    { name: "team.css", type: "file", icon: "🔷" },
    { name: "main.html", type: "file", icon: "🟧", hasIndicator: true },
    { name: "ngrok.exe", type: "file", icon: "🟢" },
    { name: "product.json", type: "file", icon: "🟨" },
  ];

  return (
    <>
      {/* Explorer Header */}
      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center justify-between">
        Explorer
        <Button
          variant="ghost"
          size="icon"
          className="w-4 h-4 p-0 hover:bg-[#2a2d2e]"
        >
          <span className="text-gray-400">⋯</span>
        </Button>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="px-2">
          {fileTree.map((item, index) => (
            <div key={index}>
              {item.type === "folder" ? (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-300 hover:bg-[#2a2d2e] h-6 px-1"
                    onClick={() => toggleFolder(item.name)}
                  >
                    {expandedFolders.has(item.name) ? (
                      <ChevronDown className="w-3 h-3 mr-1" />
                    ) : (
                      <ChevronRight className="w-3 h-3 mr-1" />
                    )}
                    {expandedFolders.has(item.name) ? (
                      <FolderOpen className="w-4 h-4 mr-2 text-blue-400" />
                    ) : (
                      <Folder className="w-4 h-4 mr-2 text-blue-400" />
                    )}
                    <span className="text-sm">{item.name}</span>
                  </Button>
                  {expandedFolders.has(item.name) && item.children && (
                    <div className="ml-4">
                      {item.children.map((child, childIndex) => (
                        <Button
                          key={childIndex}
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start h-6 px-1 ${
                            child.active
                              ? "bg-[#37373d] text-white"
                              : "text-gray-300 hover:bg-[#2a2d2e]"
                          }`}
                          //   onClick={() => setActiveFile(child.name)}
                        >
                          <span className="w-4 h-4 mr-2 flex items-center justify-center text-xs">
                            {child.icon}
                          </span>
                          <span className="text-sm">{child.name}</span>
                          {child.active && (
                            <Circle className="w-2 h-2 ml-auto fill-white text-white" />
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-300 hover:bg-[#2a2d2e] h-6 px-1"
                >
                  <span className="w-4 h-4 mr-2 flex items-center justify-center text-xs">
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.name}</span>
                  {item.hasIndicator && (
                    <Circle className="w-2 h-2 ml-auto fill-orange-500 text-orange-500" />
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
