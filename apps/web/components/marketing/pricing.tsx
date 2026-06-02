"use client";

import { useState } from 'react';
import { CheckCircle2, X as XIcon } from 'lucide-react';
import { authHref } from '../../lib/site-config';

const plans = [
  {
    key: 'free',
    name: 'Developer',
    description: 'For individuals exploring AI governance',
    monthlyPrice: 0,
    annualPrice: 0,
    priceLabel: 'Free forever',
    cta: 'Start for free',
    ctaHref: authHref('/signup'),
    featured: false,
    features: [
      '10,000 decisions per month',
      '7-day decision history',
      'Basic causal attribution',
      '5 governance rules',
      'JavaScript + Python SDK',
      'Community support',
    ],
    missing: [
      'World State Layer',
      'Commitment Tracking',
      'Provenance Verification',
      'Slack + webhook alerts',
    ]
  },
  {
    key: 'team',
    name: 'Team',
    description: 'For AI teams that need complete governance',
    monthlyPrice: 49,
    annualPrice: 39,
    priceLabel: 'per seat / month',
    cta: 'Start 14-day trial',
    ctaHref: authHref('/signup?plan=team'),
    featured: true,
    badge: 'Most popular',
    features: [
      'Unlimited decisions',
      '90-day decision history',
      'Full causal attribution',
      'Unlimited governance rules',
      'World State Layer',
      'Commitment Tracking',
      'Slack + webhook alerts',
      'Weekly audit reports',
      'Priority support',
    ],
    missing: []
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    description: 'For regulated industries requiring maximum compliance',
    monthlyPrice: null,
    annualPrice: null,
    priceLabel: 'Custom pricing',
    cta: 'Contact us',
    ctaHref: 'mailto:heyarkvoid@gmail.com',
    featured: false,
    features: [
      'Everything in Team',
      'Unlimited retention',
      'Provenance Verification',
      'SOC2 compliance exports',
      'EU AI Act documentation',
      '99.99% uptime SLA',
      'Dedicated support manager',
      'On-premise deployment option',
      'Custom integrations',
    ],
    missing: []
  }
];

export function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="pricing" className="section-pad bg-black px-5">
      <div className="text-center max-w-[560px] mx-auto mb-16">
        <div className="inline-flex items-center gap-2 mb-5 border border-[#1E1E1E] bg-[#0C0C0C] rounded-full px-4 py-2 text-[12px] text-[#555555] uppercase tracking-widest font-medium">
          <div className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full" />
          <span>Pricing</span>
        </div>
        <h2 className="font-serif text-[clamp(36px,5vw,56px)] text-white leading-tight tracking-tight mt-1">
          Start free.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 block md:inline">Scale as you trust.</span>
        </h2>
      </div>

      <div className="flex justify-center mb-14">
        <div className="inline-flex bg-[#0C0C0C] rounded-full p-1.5 gap-1 border border-[#1E1E1E]">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer select-none ${
              billing === 'monthly'
                ? 'bg-[#1C1C1C] text-white border border-[#2C2C2C]'
                : 'text-[#555555] hover:text-[#A0A0A0]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-200 cursor-pointer select-none flex items-center ${
              billing === 'annual'
                ? 'bg-[#1C1C1C] text-white border border-[#2C2C2C]'
                : 'text-[#555555] hover:text-[#A0A0A0]'
            }`}
          >
            Annual
            <span className="bg-[rgba(204,255,0,0.08)] text-[#CCFF00] text-[10px] rounded-xs px-1.5 py-0.5 ml-1.5 font-semibold">
              −20%
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`bg-[#0C0C0C] border rounded-2xl p-8 flex flex-col relative transition-all duration-300 ${
              plan.featured 
                ? 'border-[rgba(204,255,0,0.25)] shadow-[0_0_40px_rgba(204,255,0,0.06)]' 
                : 'border-[#1E1E1E]'
            }`}
          >
            {plan.featured && plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#CCFF00] text-black text-[11px] font-semibold px-5 py-1.5 rounded-full whitespace-nowrap shadow-md">
                {plan.badge}
              </div>
            )}

            <div className="text-[11px] uppercase tracking-widest text-[#555555] font-medium mb-1">
              {plan.name}
            </div>
            <div className="text-[13px] text-[#555555] mt-1 mb-5 leading-normal">
              {plan.description}
            </div>

            <div className="mb-6">
              {plan.monthlyPrice === 0 ? (
                <div className="flex flex-col">
                  <span className="font-serif text-[52px] text-white leading-none font-light">Free</span>
                </div>
              ) : plan.monthlyPrice !== null && plan.annualPrice !== null ? (
                <div className="flex flex-col">
                  <div className="flex items-baseline leading-none font-serif font-light">
                    <span className="text-lg text-[#555555] mr-1">$</span>
                    <span className="text-[52px] text-white font-light">
                      {billing === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                    </span>
                    <span className="text-sm text-[#555555] ml-1.5">/mo</span>
                  </div>
                  {billing === 'annual' && (
                    <span className="text-[11px] text-[#555555] mt-1.5 ml-1 block font-sans font-normal">billed annually</span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col h-[52px] justify-center">
                  <span className="font-serif text-4xl text-white font-light">Custom</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#1E1E1E] my-5" />

            <div className="flex-1 flex flex-col gap-3">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-[#4ADE80] flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-[#A0A0A0] font-light">{feature}</span>
                </div>
              ))}
              {plan.missing.map((feature, i) => (
                <div key={`m-${i}`} className="flex items-start gap-2.5">
                  <XIcon size={14} className="text-[#2C2C2C] flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-[#2C2C2C] font-light">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-5 font-sans">
              {plan.key === 'team' ? (
                <a
                  href={plan.ctaHref}
                  className="block w-full text-center text-[13px] font-semibold py-3 rounded-md bg-[#CCFF00] text-black hover:bg-[#b5e000] hover:scale-[1.01] transition-all duration-200"
                >
                  {plan.cta}
                </a>
              ) : (
                <a
                  href={plan.ctaHref}
                  className="block w-full text-center text-[13px] font-semibold py-3 rounded-md border border-[#2C2C2C] text-[#555555] hover:bg-[#0C0C0C] hover:text-white transition-all duration-200"
                >
                  {plan.cta}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center flex justify-center flex-wrap gap-6 items-center">
        {[
          "30-day guarantee",
          "SOC2",
          "GDPR",
          "Cancel anytime",
          "No credit card"
        ].map((text, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] flex-shrink-0" />
            <span className="text-[12px] text-[#555555] font-medium">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
