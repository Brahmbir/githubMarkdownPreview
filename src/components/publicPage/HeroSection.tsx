import * as React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { ChevronRight, Play, Shield, WifiOff, Zap } from "lucide-react";
import Link from "next/link";

export interface IHeroSectionProps {}

export function HeroSection(props: IHeroSectionProps) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dracula-purple/10 via-transparent to-dracula-cyan/10" />
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              {/* <Badge className="bg-dracula-purple/20 text-dracula-purple border-dracula-purple/30">
                Local-first • Version controlled • Offline-ready
              </Badge> */}
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-dracula-purple">Markdown.</span>
                <br />
                <span className="text-dracula-cyan">Versioned.</span>
                <br />
                <span className="text-dracula-pink">Local-first.</span>
              </h1>
              <p className="text-xl text-dracula-comment leading-relaxed">
                Write and manage Markdown files like code. Snapshots, folders,
                and recovery—all in your browser.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={"/project"}>
                <Button
                  size="lg"
                  className="bg-dracula-green hover:bg-dracula-green/80 text-dracula-background font-semibold group"
                >
                  <Play className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Open Editor
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-dracula-comment text-dracula-foreground hover:bg-dracula-current bg-transparent"
              >
                Learn More
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-dracula-comment">
              <div className="flex items-center space-x-2">
                <WifiOff className="w-4 h-4" />
                <span>Works offline</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Local storage</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Instant startup</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-dracula-current rounded-lg border border-dracula-comment overflow-hidden shadow-2xl">
              <div className="bg-dracula-comment px-4 py-2 flex items-center space-x-2">
                <div className="w-3 h-3 bg-dracula-red rounded-full" />
                <div className="w-3 h-3 bg-dracula-yellow rounded-full" />
                <div className="w-3 h-3 bg-dracula-green rounded-full" />
                <span className="text-xs text-dracula-foreground ml-4">
                  README.md
                </span>
              </div>
              <Image
                src="/editor-mockup.png"
                alt="Inkbase Editor Interface"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-dracula-purple/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-dracula-cyan/20 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
