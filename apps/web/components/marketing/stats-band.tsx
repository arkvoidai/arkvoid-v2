"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';

function AnimatedCounter({ 
  target, 
  duration = 1800,
  decimals = 0,
  prefix = '',
  suffix = ''
}: { 
  target: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  
  useEffect(() => {
    if (!inView) return;
    
    // Check reduced motion
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    
    if (prefersReduced) {
      if (ref.current) {
        ref.current.textContent = prefix + target.toFixed(decimals) + suffix;
      }
      return;
    }
    
    const controls = animate(count, target, {
      duration: duration / 1000,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (value) => {
        if (ref.current) {
          ref.current.textContent = prefix + value.toFixed(decimals) + suffix;
        }
      }
    });
    
    return () => controls.stop();
  }, [inView, target, duration, decimals, prefix, suffix, count]);
  
  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

export function StatsBand() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  type Stat = {
    type: 'number' | 'text';
    target?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    display?: string;
    sub?: string;
    label: string;
  };

  const stats: Stat[] = [
    { type: 'number', target: 2.4, decimals: 1, suffix: 'B+', label: 'AI DECISIONS TRACED' },
    { type: 'number', target: 99.97, decimals: 2, suffix: '%', label: 'UPTIME SLA' },
    { type: 'number', target: 2.8, decimals: 1, prefix: '<', suffix: 'ms', label: 'AVG LATENCY' },
    { type: 'text', display: 'SOC2', sub: 'TYPE II CERTIFIED', label: 'CERTIFIED' },
  ];

  // Container variants to handle staggering children on view
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const cellVariants = {
    hidden: { 
      opacity: 0, 
      y: 16 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1]
      }
    }
  };

  return (
    <section className="bg-[#0C0C0C] border-y border-[#1E1E1E] py-12 px-5">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="content-width grid grid-cols-2 md:grid-cols-4"
      >
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            variants={cellVariants}
            className={`text-center px-6 py-2 border-[#1E1E1E]
              ${i % 2 === 0 ? 'border-r' : 'border-r-0'}
              md:border-r md:last:border-r-0
              ${i < 2 ? 'border-b pb-4 md:border-b-0 md:pb-2' : ''}`}
          >
            <div className="leading-none">
              {stat.type === 'number' ? (
                <div className="font-serif text-[52px] md:text-[60px] font-light text-white leading-none">
                  {mounted ? (
                    <AnimatedCounter 
                      target={stat.target ?? 0}
                      decimals={stat.decimals}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  ) : (
                    <span>{stat.prefix}0{stat.suffix}</span>
                  )}
                </div>
              ) : (
                <div className="font-serif text-[52px] md:text-[60px] font-light text-white leading-none">
                  <span>{stat.display}</span>
                </div>
              )}
            </div>
            <span className="text-[11px] uppercase tracking-[0.1em] text-[#555555] mt-3 block font-sans">
              {stat.type === 'text' ? stat.sub : stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
