import EditorePanel from "@/components/EditorPanel";
import { Navbar } from "@/components/public/Navbar";
import { HeroSection } from "@/components/publicPage/HeroSection";

export default async function Home() {
  return (
    <div className="gird h-screen">
      <Navbar />
      <HeroSection />
    </div>
  );
}
