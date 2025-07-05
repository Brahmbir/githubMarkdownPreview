import React from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const navItems = [
  { label: "Portfolio", icon: "📊", href: "#" },
  { label: "Investments", icon: "📈", href: "#" },
  { label: "Footprint", icon: "🌿", href: "#" },
  { label: "Transfers", icon: "🔁", href: "#" },
  { label: "Profile", icon: "👤", href: "#" },
];

const suggestionItems = [
  { label: "Help and support", icon: "💬", href: "#" },
  { label: "FAQ", icon: "❓", href: "#" },
];

export default function Sidebar() {
  return (
    <div className="md:flex border rounded-lg">
      {/* Mobile menu button */}
      <div className="md:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-3/4 sm:w-64">
            <SheetHeader>
              <SheetTitle className="text-left">GOODFOLIO</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen bg-white shadow p-4">
        <div className="text-xl font-bold mb-6">GOODFOLIO</div>
        <SidebarContent />
      </aside>
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm text-gray-400 mb-2">General</h3>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm text-gray-400 mb-2">Suggestions</h3>
        <ul className="space-y-2">
          {suggestionItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
