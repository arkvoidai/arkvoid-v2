// TEMP FIX: All "Start free" buttons use href="#" until auth deploys.
// Change back to https://auth.arkvoid.com/signup once deployed.

import HeroSection from '../components/marketing/hero';
import { StatsBand } from '../components/marketing/stats-band';
import { FeaturesSection } from '../components/marketing/features';
import { PricingSection } from '../components/marketing/pricing';
import { Footer } from '../components/nav/footer';
import { AlertTriangle, ShieldOff, AlertCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBand />
      <ProblemSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </>
  );
}

function ProblemSection() {
  return (
    <section className="section-pad px-5 bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 content-width">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-2 mb-5 border border-[#1E1E1E] bg-[#0C0C0C] rounded-full px-4 py-2 text-[12px] text-[#555555] uppercase tracking-widest font-medium">
            <div className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full" />
            <span>The Problem</span>
          </div>
          <h2 className="font-serif text-[clamp(34px,5vw,52px)] text-white leading-tight tracking-tight">
            AI is deciding.<br />
            <span className="text-gradient-white">Nobody&apos;s watching.</span>
          </h2>
          <p className="mt-5 text-[16px] text-[#A0A0A0] font-light leading-relaxed max-w-[400px]">
            Every day, your AI systems approve loans, triage 
            patients, and screen candidates. When a regulator 
            asks why, when a customer disputes a decision — 
            most companies have nothing to show.
          </p>

          <div className="flex gap-10 mt-10">
            <div>
              <div className="font-serif text-[48px] text-white leading-none">$4.7M</div>
              <div className="text-[13px] text-[#555555] mt-2 max-w-[140px] leading-relaxed">
                average cost of an unexplained AI decision
              </div>
            </div>
            <div>
              <div className="font-serif text-[48px] text-white leading-none">73%</div>
              <div className="text-[13px] text-[#555555] mt-2 max-w-[130px] leading-relaxed">
                of AI teams have zero formal governance
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3">
          <div className="surface-1 rounded-xl p-5 flex gap-4 border-l-2 border-l-[#F87171]">
            <AlertTriangle size={16} className="text-[#F87171] mt-1 shrink-0" />
            <div>
              <h3 className="font-serif text-xl text-white">No audit trail</h3>
              <p className="text-[13px] text-[#555555] mt-1">
                You can&apos;t explain why your AI made any specific 
                decision. That&apos;s a legal liability.
              </p>
            </div>
          </div>

          <div className="surface-1 rounded-xl p-5 flex gap-4 border-l-2 border-l-[#F59E0B]">
            <ShieldOff size={16} className="text-[#F59E0B] mt-1 shrink-0" />
            <div>
              <h3 className="font-serif text-xl text-white">Zero governance</h3>
              <p className="text-[13px] text-[#555555] mt-1">
                AI makes unlimited decisions with no constraint 
                checking. One biased output at scale becomes a lawsuit.
              </p>
            </div>
          </div>

          <div className="surface-1 rounded-xl p-5 flex gap-4 border-l-2 border-l-[rgba(204,255,0,0.3)]">
            <AlertCircle size={16} className="text-[#CCFF00]/50 mt-1 shrink-0" />
            <div>
              <h3 className="font-serif text-xl text-white">Incoherent world models</h3>
              <p className="text-[13px] text-[#555555] mt-1">
                Different AI systems hold contradictory beliefs 
                about the same customer. Errors compound silently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="section-pad px-5 bg-black text-center relative overflow-hidden">
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(204,255,0,0.03) 0%, rgba(0,0,0,0) 70%)' }}
      />
      
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 mb-5 border border-[#1E1E1E] bg-[#0C0C0C] rounded-full px-4 py-2 text-[12px] text-[#555555] uppercase tracking-widest font-medium">
          <div className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full" />
          <span>Get started</span>
        </div>
        
        <h2 className="font-serif text-[clamp(38px,5vw,64px)] text-white leading-tight tracking-tight">
          Make your AI<br />
          <span className="text-gradient-charge">trustworthy.</span>
        </h2>
        
        <p className="mt-5 text-[16px] text-[#555555] max-w-[420px] mx-auto leading-relaxed">
          Join the AI teams who know exactly what their 
          AI decided, why it decided it, and whether it 
          was the right call.
        </p>
        
        <div className="mt-10 flex justify-center flex-wrap gap-4 items-center">
          <a
            href="#"
            className="charge-btn text-[15px] px-7 py-3.5"
          >
            Start for free &rarr;
          </a>
          <a
            href="https://docs.arkvoid.com"
            className="text-[14px] text-[#555555] hover:text-[#A0A0A0] transition-colors py-3.5"
          >
            View documentation
          </a>
        </div>
      </div>
    </section>
  );
}
