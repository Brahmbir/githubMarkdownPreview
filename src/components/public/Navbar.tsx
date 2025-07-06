import Link from "next/link";
import * as React from "react";
import { Button } from "../ui/button";
import { Logo } from "./Logo";

export interface INavbarProps {}

export function Navbar(props: INavbarProps) {
  return (
    <header className="border-b border-dracula-comment bg-dracula-background backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#how-it-works"
            className="text-dracula-comment hover:text-dracula-cyan transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#features"
            className="text-dracula-comment hover:text-dracula-cyan transition-colors"
          >
            Features
          </Link>
          <Link
            href="#docs"
            className="text-dracula-comment hover:text-dracula-cyan transition-colors"
          >
            Docs
          </Link>
          <Link
            href="#github"
            className="text-dracula-comment hover:text-dracula-cyan transition-colors"
          >
            GitHub
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            // onClick={() => setIsDark(!isDark)}
            className="text-dracula-comment hover:text-dracula-cyan hover:bg-dracula-current"
          >
            {/* {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )} */}
          </Button>
          <Link href={"/project"}>
            <Button className="bg-dracula-purple hover:bg-dracula-purple/80 text-dracula-background font-semibold">
              Open Editor
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
