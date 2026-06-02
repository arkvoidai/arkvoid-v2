"use client";

import { ArrowRight, Shield } from 'lucide-react';
import { authHref, siteConfig } from '../../lib/site-config';

export function CtaSection() {
  const trustItems = [
    "30-day guarantee",
    "SOC2 compliant",
    "GDPR ready",
    "Cancel anytime",
    "No credit card to start"
  ];

  return (
    <section className="section-pad bg-[#000] px-5 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 pointer-events-none filter blur-[40px]" 
        style={{
          background: 'radial-gradient(ellipse 600px 400px at center, rgba(204,255,0,0.06) 0%, transparent 70%)'
        }}
      />
      
      <div className="max-w-[700px] mx-auto text-center relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 surface-charge rounded-pill px-4 py-2 mb-6">
          <div className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full animate-pulse-soft" />
          <span className="text-sm text-[#CCFF00]/80">Get Started</span>
        </div>
        
        <h2 className="font-serif text-[clamp(40px,6vw,68px)] text-white leading-tight tracking-tight">
          Make your AI<br />
          <span className="text-gradient-charge">trustworthy.</span>
        </h2>
        
        <p className="mt-6 text-[17px] text-[#6e6c76] max-w-[440px] mx-auto leading-relaxed">
          Join AI teams who know exactly what their AI decided, why it decided it, and whether it was the right call.
        </p>

        <div className="flex justify-center items-center flex-wrap gap-4 mt-10">
          <a 
            href={authHref('/signup')} 
            className="inline-flex items-center gap-2 bg-[#CCFF00] text-black font-medium text-[15px] px-7 py-3.5 rounded-md hover:bg-[#B8E600] active:scale-[0.97] transition-all duration-150 shadow-[0_0_40px_rgba(204,255,0,0.15),_0_0_80px_rgba(204,255,0,0.06)] relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.12)_50%,transparent_60%)] -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-[ease]" />
            Start for free
            <ArrowRight size={16} />
          </a>
          <a 
            href={siteConfig.docsUrl} 
            className="inline-flex items-center gap-2 text-sm text-[#6e6c76] hover:text-[#cdcbd6] transition-colors py-3 px-4"
          >
            View documentation
          </a>
        </div>

        <div className="flex justify-center items-center flex-wrap gap-x-5 gap-y-3 mt-10">
          {trustItems.map((text, i) => (
            <div key={i} className="flex items-center gap-2">
              <Shield size={11} className="text-[#4ADE80]" />
              <span className="text-xs text-[#3d3b45]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
