"use client";

import { motion } from 'framer-motion';
import { AlertTriangle, ShieldOff, AlertCircle } from 'lucide-react';

export function ProblemSection() {
  const cards = [
    {
      borderColor: '#912c2c',
      icon: <AlertTriangle size={16} className="text-[#912c2c]" />,
      title: 'No audit trail',
      text: "You can't tell a regulator why your AI made any specific decision. That's not a risk. That's a crisis waiting to happen."
    },
    {
      borderColor: '#CCFF00',
      icon: <ShieldOff size={16} className="text-[#CCFF00]" />,
      title: 'Zero governance',
      text: "AI makes unlimited decisions with no real-time constraint checking. One biased output at scale becomes a class-action lawsuit."
    },
    {
      borderColor: 'rgba(205,203,214,0.3)',
      icon: <AlertCircle size={16} className="text-[#cdcbd6]/50" />,
      title: 'Incoherent world models',
      text: "Different AI systems in your org hold contradictory beliefs about the same customer, the same risk, the same reality. Errors compound."
    }
  ];

  return (
    <section className="section-pad bg-[#000] px-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 content-width">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-2 mb-5 border border-[#1E1E1E] bg-[#0C0C0C] rounded-full px-4 py-2 text-[12px] text-[#555555] uppercase tracking-widest font-medium">
            <div className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full" />
            <span>The Problem</span>
          </div>
          <h2 className="font-serif text-[clamp(36px,5vw,56px)] text-white leading-tight tracking-tight">
            AI is deciding.<br />
            <span className="text-gradient-white">Nobody&apos;s watching.</span>
          </h2>
          <p className="text-[17px] text-[#6e6c76] font-light leading-relaxed max-w-md mt-6">
            Every day, your AI systems approve loans, triage patients, screen candidates, and route orders. When a regulator asks why — when a customer disputes a decision — when an audit begins — most companies have nothing to show.
          </p>

          <div className="flex gap-12 mt-10 flex-wrap">
            <div>
              <div className="font-serif text-[52px] text-white leading-none">$4.7M</div>
              <div className="text-sm text-[#6e6c76] mt-2 max-w-[150px] leading-relaxed">
                average cost of an unexplained AI decision
              </div>
            </div>
            <div>
              <div className="font-serif text-[52px] text-white leading-none">73%</div>
              <div className="text-sm text-[#6e6c76] mt-2 max-w-[140px] leading-relaxed">
                of AI teams have zero formal governance
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 100, damping: 20 }}
              className="surface-1 rounded-xl p-5 flex gap-4"
              style={{ borderLeft: `2px solid ${card.borderColor}` }}
            >
              <div className="mt-1 flex-shrink-0">{card.icon}</div>
              <div>
                <h3 className="text-xl text-white font-serif">{card.title}</h3>
                <p className="text-sm text-[#6e6c76] leading-relaxed mt-2">{card.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
