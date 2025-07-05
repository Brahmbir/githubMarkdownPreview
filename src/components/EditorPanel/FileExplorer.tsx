"use client";
import { Folder, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

type FileNode = {
  name: string;
  type: "file" | "folder";
  extension?: string;
  children?: FileNode[];
};

const mockFiles: FileNode[] = [
  {
    name: "images",
    type: "folder",
    children: [
      {
        name: "tools",
        type: "folder",
        children: [
          { name: "mailer.php", type: "file", extension: "php" },
          { name: "main.js", type: "file", extension: "js" },
          { name: "script.py", type: "file", extension: "py" },
        ],
      },
    ],
  },
  { name: "index.css", type: "file", extension: "css" },
  { name: "third_party", type: "folder", children: [] },
  { name: "sqlite3", type: "file", extension: "" },
  { name: "team.css", type: "file", extension: "css" },
  { name: "main.html", type: "file", extension: "html" },
  { name: "ngrok.exe", type: "file", extension: "exe" },
  { name: "product.json", type: "file", extension: "json" },
];

const FileItem = ({ node }: { node: FileNode }) => {
  const [open, setOpen] = useState(false);
  const isFolder = node.type === "folder";

  return (
    <div className="ml-2 text-sm">
      <div
        className="flex items-center gap-1 cursor-pointer px-2 py-1 hover:bg-[#2c2c2c] rounded"
        onClick={() => isFolder && setOpen(!open)}
      >
        {isFolder ? (
          open ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )
        ) : (
          <div className="w-[14px]" />
        )}
        {isFolder ? <Folder size={14} /> : <FileText size={14} />}
        <span>{node.name}</span>
      </div>
      {isFolder && open && node.children && (
        <div className="ml-4 border-l border-gray-700 pl-2">
          {node.children.map((child, idx) => (
            <FileItem key={idx} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FileExplorer() {
  return (
    <aside className="w-64 h-full bg-[#1e1e1e] text-white border-r border-[#2a2a2a] overflow-auto">
      <div className="px-2 py-3 border-b border-[#2a2a2a] text-xs font-bold text-gray-300">
        EXPLORER
      </div>
      <div className="p-2">
        {mockFiles.map((file, idx) => (
          <FileItem key={idx} node={file} />
        ))}
      </div>
    </aside>
  );
}
