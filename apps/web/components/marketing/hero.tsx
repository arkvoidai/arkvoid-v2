"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Shield } from 'lucide-react';
import { authHref, siteConfig } from '../../lib/site-config';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 20 }).map((_, i) => {
      const size = Math.floor(Math.random() * 3) + 1;
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const colors = ['#CCFF00', '#cdcbd6', '#4ADE80'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const opacity = (Math.random() * 0.25) + 0.1;
      const duration = (Math.random() * 25) + 15;
      const delay = Math.random() * 15;

      return { id: i, size, top, left, color, opacity, duration, delay };
    }));
  }, []);

  const parentVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden" 
      style={{ padding: 'clamp(120px,16vw,180px) 20px clamp(80px,10vw,120px)', textAlign: 'center' }}>
      
      {/* Background Layers */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(ellipse 900px 700px at 50% -100px, rgba(204,255,0,0.07) 0%, transparent 65%)'
        }}
      />
      
      <div 
        className="absolute inset-0 z-[1] pointer-events-none dot-grid opacity-50"
        style={{
          mask: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMask: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)'
        }}
      />

      {mounted && (
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                top: p.top,
                left: p.left,
                backgroundColor: p.color,
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0, p.opacity, p.opacity, 0]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "linear",
                delay: p.delay
              }}
            />
          ))}
        </div>
      )}

      <div 
        className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #000000, transparent)' }}
      />

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 max-w-[780px] mx-auto w-full"
        variants={parentVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="flex justify-center"
        >
          <a href="/changelog" className="inline-flex items-center gap-2.5 border border-[rgba(204,255,0,0.25)] bg-[rgba(204,255,0,0.06)] rounded-pill px-4 py-2 mb-8 cursor-pointer hover:bg-[rgba(204,255,0,0.1)] transition-all duration-200">
            <span className="bg-[#CCFF00] text-black text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-xs">New</span>
            <span className="text-sm text-[#CCFF00] tracking-[-0.01em]">Introducing Arkvoid v1.0 — AI Trust Infrastructure</span>
            <ArrowRight size={12} className="text-[#CCFF00]/60" />
          </a>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif leading-[1.0] tracking-[-0.04em] text-[clamp(52px,9vw,96px)]"
        >
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="block text-white"
          >
            Your AI decides.
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="block text-white"
          >
            Who verifies
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            className="block text-gradient-charge drop-shadow-[0_0_60px_rgba(204,255,0,0.25)]"
          >
            it should?
          </motion.span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-[520px] mx-auto mt-6 text-[17px] font-light text-[#6e6c76] leading-relaxed"
        >
          Arkvoid is the infrastructure layer that logs, explains, governs, and verifies every AI decision your company makes — automatically, in real time.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center items-center flex-wrap gap-4 mt-10 relative"
        >
          <div className="flex flex-col items-center">
            <a 
              href={authHref('/signup')} 
              className="inline-flex items-center gap-2 bg-[#CCFF00] text-black font-medium text-[15px] px-7 py-3.5 rounded-md hover:bg-[#B8E600] active:scale-[0.97] transition-all duration-150 shadow-[0_0_40px_rgba(204,255,0,0.15),_0_0_80px_rgba(204,255,0,0.06)] relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.12)_50%,transparent_60%)] -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-[ease]" />
              Start for free
              <ArrowRight size={16} />
            </a>
            <span className="text-xs text-[#3d3b45] mt-2 block text-center">
              No credit card · 10,000 decisions free
            </span>
          </div>

          <div className="flex flex-col items-center self-start">
            <a 
              href={siteConfig.docsUrl} 
              className="inline-flex items-center gap-2 text-sm text-[#6e6c76] hover:text-[#cdcbd6] transition-colors py-3"
            >
              <BookOpen size={15} />
              Read the docs
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center flex-wrap gap-5 mt-10"
        >
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-[#4ADE80]" />
            <span className="text-xs text-[#3d3b45]">SOC2 Type II</span>
          </div>
          <div className="w-px h-3 bg-[#1a1a1a]" />
          <div className="flex items-center gap-2">
             <Shield size={12} className="text-[#4ADE80]" />
            <span className="text-xs text-[#3d3b45]">GDPR Compliant</span>
          </div>
          <div className="w-px h-3 bg-[#1a1a1a]" />
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-[#4ADE80]" />
            <span className="text-xs text-[#3d3b45]">EU AI Act Ready</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-[480px] w-full mx-auto mt-14 relative z-10 text-left"
        >
          <div className="absolute inset-[-30px] z-[-1] pointer-events-none filter blur-[20px]" 
            style={{ background: 'radial-gradient(ellipse at center, rgba(204,255,0,0.07), transparent 65%)' }}
          />

          <div className="surface-1 rounded-xl shadow-overlay overflow-hidden border border-[#222222] hover:-translate-y-[3px] transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-card-hover group">
            <div className="bg-[#000] border-b border-[#1a1a1a] px-4 py-3 flex items-center relative gap-4">
              <div className="flex gap-1.5 items-center">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 text-xs text-[#3d3b45] font-mono">
                arkvoid-quickstart.ts
              </div>
              <div className="text-[10px] text-[#3d3b45] font-mono border border-[#1a1a1a] rounded-xs px-1.5 py-0.5 ml-auto">
                v1.0.0
              </div>
            </div>

            <div className="px-5 py-5 font-mono text-[12.5px] leading-7 text-left">
              <div><span style={{color:'#3d3b45'}}>{"// Add trust to any AI call"}</span></div>
              <div><br/></div>
              <div>
                <span style={{color:'#4ADE80'}}>{"import"}</span>
                <span style={{color:'#cdcbd6'}}> &#123; arkvoid &#125; </span>
                <span style={{color:'#4ADE80'}}>from</span>
                <span style={{color:'#4ADE80'}}>{" '@arkvoid/sdk'"}</span>
              </div>
              <div><br/></div>
              <div>
                <span style={{color:'#CCFF00'}}>const</span>
                <span style={{color:'#ffffff'}}> av </span>
                <span style={{color:'#6e6c76'}}>=</span>
                <span style={{color:'#cdcbd6'}}> arkvoid(&#123;</span>
              </div>
              <div>
                <span style={{color:'#6e6c76'}}>  apiKey: </span>
                <span style={{color:'#4ADE80'}}>process.env</span>
                <span style={{color:'#ffffff'}}>.ARKVOID_KEY</span>
              </div>
              <div>
                <span style={{color:'#6e6c76'}}>&#125;)</span>
              </div>
              <div><br/></div>
              <div>
                <span style={{color:'#CCFF00'}}>const</span>
                <span style={{color:'#ffffff'}}> result </span>
                <span style={{color:'#6e6c76'}}>=</span>
                <span style={{color:'#CCFF00'}}> await</span>
                <span style={{color:'#cdcbd6'}}> av.</span>
                <span style={{color:'#CCFF00'}}>trace</span>
                <span style={{color:'#6e6c76'}}>(&#123;</span>
              </div>
              <div>
                <span style={{color:'#6e6c76'}}>  model: </span>
                <span style={{color:'#4ADE80'}}>{"'gpt-4o'"}</span>
                <span style={{color:'#6e6c76'}}>, input,</span>
              </div>
              <div>
                <span style={{color:'#6e6c76'}}>  decision: </span>
                <span style={{color:'#CCFF00'}}>await</span>
                <span style={{color:'#cdcbd6'}}> myAI</span>
                <span style={{color:'#6e6c76'}}>(input)</span>
              </div>
              <div>
                <span style={{color:'#6e6c76'}}>&#125;)</span>
              </div>
              <div><br/></div>
              <div>
                <span style={{color:'#3d3b45'}}>{"// result.trustScore   "}</span>
                <span style={{color:'#3d3b45'}}>→ </span>
                <span style={{color:'#4ADE80'}}>0.94</span>
              </div>
              <div>
                <span style={{color:'#3d3b45'}}>{"// result.governance   "}</span>
                <span style={{color:'#3d3b45'}}>→ </span>
                <span style={{color:'#4ADE80'}}>{"\"passed\" ✓"}</span>
              </div>
              <div>
                <span style={{color:'#CCFF00'}} className="animate-blink">|</span>
              </div>
            </div>

            <div className="bg-[#000] border-t border-[#1a1a1a] px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse-soft" />
                <span className="text-xs text-[#4ADE80]">Connected</span>
              </div>
              <span className="text-xs text-[#3d3b45] font-mono">SDK v1.0.0</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {!scrolled && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
          >
            <div className="w-6 h-10 rounded-[12px] border-[1.5px] border-[#2e2e2e] relative flex justify-center pt-2">
              <motion.div 
                animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-[#3d3b45]"
              />
            </div>
            <span className="text-[9px] text-[#3d3b45] uppercase tracking-[0.25em]">scroll</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
