import Link, { LinkProps } from "next/link";
import * as React from "react";

export interface ILogoProps extends Omit<LinkProps, "href"> {
  type?: "full" | "icon";
  href?: string;
}

export function Logo({ type, href, ...props }: ILogoProps) {
  const isFull = type === "full" || type === undefined;

  const linkHref = href || "/";
  return (
    <Link
      href={linkHref}
      {...props}
      className="flex items-center font-doto space-x-2"
    >
      <div className="w-9 h-9 text-2xl font-extrabold bg-dracula-purple text-dracula-background rounded-md flex items-center justify-center">
        <span className="pl-0.5 flex items-center justify-center text-justify">
          M
        </span>
      </div>
      {isFull && (
        <span className="text-xl text-dracula-foreground font-medium">
          MarkMeDown
        </span>
      )}
    </Link>
  );
}
