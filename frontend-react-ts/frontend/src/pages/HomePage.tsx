import { HeroBanner } from '../components/home/HeroBanner';
import { TrustBar } from '../components/home/TrustBar';
import { BrandsMarquee } from '../components/home/BrandsMarquee';
import { TopCollections } from '../components/home/TopCollections';
import { ShopForSection } from '../components/home/ShopForSection';
import { CTABanner } from '../components/home/CTABanner';
import { IndustriesSection } from '../components/home/IndustriesSection';
import { TechnologySection } from '../components/home/TechnologySection';
import { CaseStudiesSection } from '../components/home/CaseStudiesSection';
import { InsightsSection } from '../components/home/InsightsSection';

export function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustBar />
      <BrandsMarquee />
      <TopCollections />
      <ShopForSection />
      <IndustriesSection />
      <TechnologySection />
      <CaseStudiesSection />
      <InsightsSection />
      <CTABanner />
    </>
  );
}
