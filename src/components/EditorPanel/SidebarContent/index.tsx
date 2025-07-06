import FileExplorer from "./FileExplorer";

export enum SideBar {
  None,
  FileExplorer,
  Snapshots,
}
export default function SidebarContent({
  activeView,
}: {
  activeView: SideBar;
}) {
  // fileTree, folder toggles etc can be moved here or imported
  switch (activeView) {
    case SideBar.FileExplorer:
      return <FileExplorer />;
    // case SideBar.Snapshots:
    //   return <FileExplorer />;

    // add other views (explorer, search) here
    default:
      return null;
  }
}
