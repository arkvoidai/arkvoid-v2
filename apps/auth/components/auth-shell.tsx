"use client"

import { siteConfig } from '../lib/site-config'

import { motion } from 'framer-motion'

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-[#000000]">
      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-[#080808] border-r border-[#1a1a1a] flex-col justify-between p-10 overflow-hidden relative">
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 z-0"
          style={{
            background: 'radial-gradient(circle at 10% 10%, rgba(89,98,53,0.04) 0%, transparent 60%)',
          }}
        />
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10">
          <a href={siteConfig.marketingUrl} className="flex items-center gap-2.5 group">
            <div className="w-[28px] h-[28px] relative group-hover:opacity-0 transition-opacity absolute">
              <div className="absolute w-[16px] h-[16px] rounded-sm bg-white top-1 left-1 rotate-12" />
              <div className="absolute w-[16px] h-[16px] rounded-sm bg-[#d96846] top-2.5 left-2.5 -rotate-6 opacity-85" />
            </div>
            <div className="w-[28px] h-[28px] opacity-0 group-hover:opacity-100 transition-opacity absolute flex items-center justify-center text-[#6e6c76]">
              &larr;
            </div>
            <div className="ml-9 group-hover:hidden text-[16px] font-medium text-white">Arkvoid</div>
            <div className="ml-9 hidden group-hover:block text-sm text-[#6e6c76]">arkvoid.com</div>
          </a>
        </div>

        <div className="flex-1 flex flex-col justify-center relative z-10 max-w-[300px]">
          <q className="font-serif text-3xl text-white leading-[1.25] tracking-[-0.02em] block">
            The infrastructure that makes AI decisions trustworthy.
          </q>

          <div className="mt-10 surface-1 rounded-xl p-5 max-w-[280px] bg-[#000]/40 backdrop-blur-sm border border-[#1a1a1a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#596235] rounded-full animate-pulse-soft" />
                <span className="text-xs text-[#cdcbd6]">Decision processed</span>
              </div>
              <span className="text-xs text-[#3d3b45]">just now</span>
            </div>
            
            <div className="border-t border-[#1a1a1a] my-3" />
            
            <div className="flex justify-between py-1.5 items-center">
              <span className="text-xs text-[#3d3b45]">Trust Score</span>
              <span className="text-[14px] text-white">0.94</span>
            </div>
            <div className="flex justify-between py-1.5 items-center">
              <span className="text-xs text-[#3d3b45]">Governance</span>
              <span className="text-xs text-[#596235]">Passed &check;</span>
            </div>
            <div className="flex justify-between py-1.5 items-center">
              <span className="text-xs text-[#3d3b45]">Causal factors</span>
              <span className="text-xs text-[#6e6c76]">4 identified</span>
            </div>
            <div className="flex justify-between py-1.5 items-center">
              <span className="text-xs text-[#3d3b45]">Decision ID</span>
              <span className="font-mono text-xs text-[#3d3b45]">dv_4k2m...</span>
            </div>
            
            <div className="mt-3 pt-3 border-t border-[#1a1a1a] flex items-center justify-center gap-1.5">
              <div className="w-3 h-3 relative">
                <div className="absolute w-[6px] h-[6px] rounded-[1px] bg-white top-[1px] left-[1px] rotate-12" />
                <div className="absolute w-[6px] h-[6px] rounded-[1px] bg-[#d96846] top-[3px] left-[3px] -rotate-6 opacity-85" />
              </div>
              <span className="text-[10px] text-[#3d3b45] uppercase tracking-widest">Powered by Arkvoid</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#2e2e2e] uppercase tracking-[0.1em]">
          Trusted by AI teams worldwide.
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <motion.div 
          className="w-full max-w-[380px] mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="md:hidden flex items-center gap-2.5 mb-8">
            <div className="w-[28px] h-[28px] relative">
              <div className="absolute w-[16px] h-[16px] rounded-sm bg-white top-1 left-1 rotate-12" />
              <div className="absolute w-[16px] h-[16px] rounded-sm bg-[#d96846] top-2.5 left-2.5 -rotate-6 opacity-85" />
            </div>
            <span className="font-sans font-medium text-[17px] text-white tracking-[-0.02em]">
              Arkvoid
            </span>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  )
}
