import * as React from "react";

export interface ILogoProps {
  type?: "full" | "icon";
}

export function Logo(props: ILogoProps) {
  const isFull = props.type === "full" || props.type === undefined;
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-dracula-purple rounded-md flex items-center justify-center">
        {/* <FileText className="w-5 h-5 text-dracula-background" /> */}
      </div>
      {isFull && <span className="text-xl font-bold">Inkbase</span>}
    </div>
  );
}
