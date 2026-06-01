/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarketingNav } from '../apps/web/components/nav/marketing-nav';
import HeroSection from '../apps/web/components/marketing/hero';
import { StatsBand } from '../apps/web/components/marketing/stats-band';
import { FeaturesSection } from '../apps/web/components/marketing/features';
import { PricingSection } from '../apps/web/components/marketing/pricing';
import { ProblemSection } from '../apps/web/components/marketing/problem';
import { CtaSection } from '../apps/web/components/marketing/cta';
import { Footer } from '../apps/web/components/nav/footer';

export default function App() {
  return (
    <div className="bg-[#000000] min-h-screen text-white antialiased font-sans overflow-x-hidden">
      <MarketingNav />
      <HeroSection />
      <StatsBand />
      <ProblemSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
