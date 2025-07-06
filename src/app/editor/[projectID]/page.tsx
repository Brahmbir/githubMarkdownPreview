import EditorPageStructure from "@/components/EditorPanel";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  maximumScale: 1.0,
  initialScale: 1.0,
  width: "device-width",
  userScalable: false,
};

// export const metadata: Metadata = {};

export default function EditorPage() {
  return (
    <div className="grid h-screen">
      <EditorPageStructure />
    </div>
  );
}
