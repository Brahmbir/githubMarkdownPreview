import { Button } from "../ui/button";
import { SidebarView } from "./SidebarContent";
import { Files, Search, User, Settings } from "lucide-react";

const activityBarItems = [
  { id: "explorer", icon: Files, label: "Explorer" },
  { id: "search", icon: Search, label: "Search" },
  { id: "snapshot", icon: Search, label: "Snapshot" },
];

export default function ActivityBar({
  activeView,
  sidebarOpen,
  onSelect,
}: {
  activeView: SidebarView;
  sidebarOpen: boolean;
  onSelect: (view: SidebarView) => void;
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
            onClick={() => onSelect(item.id as SidebarView)}
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
