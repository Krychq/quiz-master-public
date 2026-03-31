import { HeroSection } from "@/components/home/hero-section";
import { DiscoverSection } from "@/components/home/discover-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <DiscoverSection />
      </main>
    </div>
  );
}
