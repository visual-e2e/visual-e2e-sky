import { SiteHeader } from "../components/SiteHeader";
import { HeroSection } from "../components/HeroSection";
import { FeatureGrid } from "../components/FeatureGrid";
import { HowItWorks } from "../components/HowItWorks";
import { DownloadSection } from "../components/DownloadSection";
import { Requirements } from "../components/Requirements";
import { SiteFooter } from "../components/SiteFooter";

export function HomePage() {
  return (
    <div className="page">
      <SiteHeader />
      <main>
        <HeroSection />
        <FeatureGrid />
        <HowItWorks />
        <DownloadSection />
        <Requirements />
      </main>
      <SiteFooter />
    </div>
  );
}
