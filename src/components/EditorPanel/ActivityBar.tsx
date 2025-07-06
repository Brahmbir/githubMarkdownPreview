import { JSX } from "react";
import { Button } from "../ui/button";
import { SideBar } from "./SidebarContent";
import { Files, Search, User, Settings } from "lucide-react";
import { ComponentType, SVGProps } from "react";

interface SideBarItem {
  id: SideBar;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
}

const activityBarItems: SideBarItem[] = [
  { id: SideBar.FileExplorer, icon: Files, label: "Explorer" },
  { id: SideBar.Snapshots, icon: Search, label: "Search" },
  // { id: "snapshot", icon: Search, label: "Snapshot" },
];

export default function ActivityBar({
  activeView,
  sidebarOpen,
  onSelect,
}: {
  activeView: SideBar;
  sidebarOpen: boolean;
  onSelect: (view: SideBar) => void;
}) {
  return (
    <div className="w-12 bg-[#333333] border-r border-[#3e3e42] flex flex-col">
      <div className="flex-1">
        {activityBarItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className={`w-12 h-12 rounded-none border-l-2 border-transparent hover:bg-[#2a2d2e] ${
              activeView === item.id && sidebarOpen
                ? "bg-[#37373d] border-l-[#007acc] text-white"
                : "text-gray-400"
            }`}
            onClick={() => onSelect(item.id)}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
          </Button>
        ))}
      </div>
      <div className="border-t border-[#3e3e42]">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-none text-gray-400 hover:bg-[#2a2d2e]"
          title="Accounts"
        >
          <User className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-none text-gray-400 hover:bg-[#2a2d2e]"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
