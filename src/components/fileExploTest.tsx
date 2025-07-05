// // components/FileExplorer.tsx
// "use client";
// import React, { useEffect, useState } from "react";
// import { FileManager } from "@/lib/FileDEX";

// type FileNode = {
//   name: string;
//   path: string;
//   isFolder: boolean;
//   children?: FileNode[];
//   expanded?: boolean;
// };

// const buildTree = async (base: string): Promise<FileNode[]> => {
//   const entries = await FileManager.listFolder(base);
//   const result: FileNode[] = [];

//   for (const entry of entries) {
//     result.push({
//       name: entry.path.split("/").filter(Boolean).pop() || "",
//       path: entry.path,
//       isFolder: entry.isFolder,
//       expanded: false,
//     });
//   }

//   return result;
// };

// export default function FileExplorer() {
//   const [tree, setTree] = useState<FileNode[]>([]);
//   const [selected, setSelected] = useState<string | null>(null);

//   const refresh = async () => {
//     const root = await buildTree("");
//     setTree(root);
//   };

//   useEffect(() => {
//     refresh();
//   }, []);

//   const toggle = async (node: FileNode) => {
//     if (!node.isFolder) return;

//     node.expanded = !node.expanded;

//     if (node.expanded && !node.children) {
//       const children = await buildTree(node.path);
//       node.children = children;
//     }

//     setTree([...tree]);
//   };

//   const createEntry = async (parentPath: string, isFolder: boolean) => {
//     const name = prompt(`Enter ${isFolder ? "folder" : "file"} name:`)?.trim();
//     if (!name) return;

//     const fullPath = parentPath + name + (isFolder ? "/" : "");
//     if (isFolder) await VFS.createFolder(fullPath);
//     else await VFS.writeFile(fullPath, "New file");

//     await refresh();
//   };

//   const deleteEntry = async (path: string) => {
//     if (window.confirm("Delete this entry?")) {
//       await VFS.deleteEntry(path);
//       await refresh();
//     }
//   };

//   const renderNode = (node: FileNode, depth = 0) => (
//     <div key={node.path} style={{ paddingLeft: depth * 16 }}>
//       <div
//         className={`flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded ${
//           selected === node.path ? "bg-blue-100" : ""
//         }`}
//         onClick={() => {
//           if (node.isFolder) toggle(node);
//           else setSelected(node.path);
//         }}
//         onContextMenu={(e) => {
//           e.preventDefault();
//           const isFolder = confirm("Add folder? (Cancel = file)");
//           createEntry(node.path, isFolder);
//         }}
//       >
//         <span>{node.isFolder ? (node.expanded ? "📂" : "📁") : "📄"}</span>
//         <span>{node.name}</span>
//         <button
//           className="ml-auto text-red-500"
//           onClick={() => deleteEntry(node.path)}
//         >
//           ✖
//         </button>
//       </div>
//       {node.expanded &&
//         node.children?.map((child) => renderNode(child, depth + 1))}
//     </div>
//   );

//   return (
//     <div className="w-full p-2 bg-white border rounded shadow text-sm font-mono">
//       <div className="flex justify-between items-center mb-2">
//         <span className="font-bold">📁 Explorer</span>
//         <button onClick={() => createEntry("", true)}>+ Folder</button>
//       </div>
//       <div>{tree.map((node) => renderNode(node))}</div>
//     </div>
//   );
// }
