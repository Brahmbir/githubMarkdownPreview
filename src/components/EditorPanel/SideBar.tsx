import SidebarContent, { SideBar } from "./SidebarContent";

const ResizeHandle: React.FC<{
  isResizing: boolean;
  onMouseDown: React.MouseEventHandler;
}> = ({ isResizing, onMouseDown }) => (
  <div
    className={`w-1 bg-[#3e3e42] hover:bg-[#007acc] cursor-col-resize shrink-0 ${
      isResizing ? "bg-[#007acc]" : ""
    }`}
    onMouseDown={onMouseDown}
  />
);

export default function SideBarElement({
  width,
  sidebarRef,
  isResizing,
  onResizeStart,
  activeView,
}: {
  width: number;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
  activeView: SideBar;
}) {
  return (
    <>
      <div
        ref={sidebarRef}
        className="bg-[#252526] border-r border-[#3e3e42] shrink-0 flex flex-col"
        style={{ width: `${width}px` }}
      >
        <SidebarContent activeView={activeView} />
      </div>
      <ResizeHandle isResizing={isResizing} onMouseDown={onResizeStart} />
    </>
  );
}
