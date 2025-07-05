import FileExplorer from "./FileExplorer";

export type SidebarView = "explorer" | "snippet" | null;

export default function SidebarContent({
  activeView,
}: {
  activeView: SidebarView;
}) {
  // fileTree, folder toggles etc can be moved here or imported
  switch (activeView) {
    case "explorer":
      return <FileExplorer />;
    case "snippet":
      return <FileExplorer />;

    // add other views (explorer, search) here
    default:
      return null;
  }
}
