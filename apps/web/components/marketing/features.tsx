"use client";

import { motion } from 'framer-motion';
import { Database, GitBranch, ShieldCheck, Globe, Link as LinkIcon, Fingerprint } from 'lucide-react';

const featuresData = [
  {
    number: '01',
    icon: Database,
    title: 'Decision Ledger',
    description: 'Every AI decision permanently recorded with full context, cryptographic integrity proof, and millisecond query access.',
  },
  {
    number: '02',
    icon: GitBranch,
    title: 'Causal Attribution',
    description: 'Not feature weights — real counterfactual causal chains. Know exactly what would change the AI outcome.',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Governance Runtime',
    description: 'Rules in plain language. Every decision checked in real time. Violations blocked before users see them.',
  },
  {
    number: '04',
    icon: Globe,
    title: 'World State Layer',
    description: 'A persistent semantic model of what your AI systems collectively know. Shared ground truth. No contradictions. No stale context. Live-updated from every decision.',
  },
  {
    number: '05',
    icon: LinkIcon,
    title: 'Commitment Tracking',
    description: 'AI agents make promises. Arkvoid tracks, bounds, and enforces every one made on your behalf.',
  },
  {
    number: '06',
    icon: Fingerprint,
    title: 'Provenance Verification',
    description: 'Cryptographic chain of custody for every input. Prove authenticity to any regulator or court.',
  }
];

export function FeaturesSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 24 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const Card = ({ feature }: { feature: typeof featuresData[0] }) => (
    <motion.div
      variants={cardVariants}
      className="bg-black p-8 md:p-10 hover:bg-[#0C0C0C] transition-colors duration-200 group flex flex-col h-full justify-between"
    >
      <div>
        <div className="text-[11px] font-mono text-[#2E2E2E] uppercase tracking-widest mb-5">
          {feature.number}
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#0C0C0C] border border-[#1E1E1E] flex items-center justify-center mb-5 flex-shrink-0 group-hover:border-[rgba(204,255,0,0.2)] group-hover:bg-[rgba(204,255,0,0.05)] transition-all duration-200">
          <feature.icon size={18} className="text-[#CCFF00]" />
        </div>
        <h3 className="font-serif text-[26px] text-white leading-tight tracking-[-0.02em]">
          {feature.title}
        </h3>
        <p className="text-[14px] text-[#555555] font-light leading-relaxed mt-3 max-w-[280px]">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );

  return (
    <section id="features" className="section-pad bg-black px-5">
      <div className="max-w-[560px] mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 mb-5 border border-[#1E1E1E] bg-[#0C0C0C] rounded-full px-4 py-2 text-[12px] text-[#555555] uppercase tracking-widest font-medium">
          <div className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full" />
          <span>The Platform</span>
        </div>
        <h2 className="font-serif text-[clamp(36px,5vw,56px)] text-white leading-tight tracking-tight mt-1">
          Complete AI trust.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 block md:inline">Nothing missing.</span>
        </h2>
        <p className="mt-5 text-[16px] text-[#555555] font-light leading-relaxed max-w-[480px] mx-auto">
          Arkvoid provides everything you need to log, explain, govern, and verify every AI decision — built precisely for production environments.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-[1160px] mx-auto"
      >
        <div className="border border-[#1E1E1E] rounded-2xl overflow-hidden bg-[#1E1E1E] flex flex-col gap-px">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
            <Card feature={featuresData[0]} />
            <Card feature={featuresData[1]} />
            <Card feature={featuresData[2]} />
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-px">
            <div className="col-span-1 md:col-span-3">
              <Card feature={featuresData[3]} />
            </div>
            <div className="col-span-1 md:col-span-2 flex flex-col gap-px">
              <div className="flex-1">
                <Card feature={featuresData[4]} />
              </div>
              <div className="flex-1 border-t border-[#1E1E1E] md:border-t-0 md:mt-0">
                <Card feature={featuresData[5]} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
