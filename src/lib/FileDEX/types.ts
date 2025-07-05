export type EntryType = "file" | "folder";

export interface FileEntry {
  path: string; // full path, e.g. '/documents/report.md'
  type: EntryType;
  content?: Blob | string; // for files: Blob or text
  created: number;
  modified: number;
  size: number; // content size in bytes
  projectId: string; // associated project
}

export interface Project {
  id: string; // unique project ID
  name: string; // project name
  color: string; // color for UI representation
  rootPath: string; // root folder path in FileEntry store
  created: number;
  modified: number;
}

interface SnapshotEntryFile {
  path: string;
  type: "file";
  hash?: string; // only for files
}

interface SnapshotEntryFolder {
  path: string;
  type: "folder";
  children?: SnapshotEntry[]; // only for folders
}

export type SnapshotEntry = SnapshotEntryFile | SnapshotEntryFolder;

export interface Snapshot {
  id: string;
  projectId: string;
  timestamp: number;
  message: string;
  root: SnapshotEntry;
}
