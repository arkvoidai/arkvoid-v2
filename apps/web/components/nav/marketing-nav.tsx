"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ArrowRight, ChevronRight } from 'lucide-react';
import { authHref, siteConfig } from '../../lib/site-config';

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const navLinks = [
    { name: 'Product', href: '/#features' },
    { name: 'Developers', href: siteConfig.docsUrl },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Trust', href: siteConfig.trustUrl },
    { name: 'Blog', href: '/blog' },
  ];

  const mobileNavLinks = [
    { name: 'Home', href: '/' },
    ...navLinks
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[60px] transition-all duration-350 ease-in-out ${
          scrolled
            ? 'bg-black/90 backdrop-blur-xl border-b border-[#1E1E1E]'
            : 'bg-transparent'
        }`}
      >
        <div className="content-width h-full flex items-center justify-between">
          {/* LEFT — Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-[26px] h-[26px] relative">
              <div className="absolute w-[14px] h-[14px] bg-white rounded-[3px] top-0 left-0 rotate-[15deg] transition-transform duration-300 group-hover:rotate-[25deg]" />
              <div className="absolute w-[14px] h-[14px] bg-[#CCFF00] rounded-[3px] bottom-0 right-0 rotate-[-8deg] transition-transform duration-300 group-hover:rotate-[-15deg]" />
            </div>
            <span className="font-medium text-[16px] text-white tracking-[-0.02em]">Arkvoid</span>
          </Link>

          {/* CENTER */}
          <div className="hidden lg:flex items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 text-[13px] text-[#555555] hover:text-[#A0A0A0] rounded-md transition-colors duration-150"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <Link
              href={authHref('/login')}
              className="text-[13px] text-[#555555] hover:text-white px-3 py-1.5 transition-colors duration-150 hidden lg:block"
            >
              Sign in
            </Link>
            <a
              href={authHref('/signup')}
              className="charge-btn !text-[13px] !px-4 !py-2"
            >
              Start free
              <ArrowRight size={13} />
            </a>

            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md text-[#555555] hover:text-white hover:bg-[#141414] transition-all duration-150"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#0C0C0C] border-l border-[#1E1E1E] z-50 flex flex-col overflow-y-auto lg:hidden"
            >
              <div className="px-5 py-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
                  <div className="w-[26px] h-[26px] relative">
                    <div className="absolute w-[14px] h-[14px] bg-white rounded-[3px] top-0 left-0 rotate-[15deg] transition-transform duration-300 group-hover:rotate-[25deg]" />
                    <div className="absolute w-[14px] h-[14px] bg-[#CCFF00] rounded-[3px] bottom-0 right-0 rotate-[-8deg] transition-transform duration-300 group-hover:rotate-[-15deg]" />
                  </div>
                  <span className="font-medium text-[16px] text-white tracking-[-0.02em]">Arkvoid</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-[#555555] hover:text-white hover:bg-[#141414] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-4 py-3 flex-1 flex flex-col">
                {mobileNavLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 px-3 text-[16px] text-[#A0A0A0] hover:text-white hover:bg-[#141414] border-b border-[#0F0F0F] last:border-0 rounded-md transition-colors duration-150"
                    >
                      {link.name}
                    </a>
                  </motion.div>
                ))}
              </div>

              <div className="px-5 py-5 border-t border-[#1E1E1E]">
                <a
                  href={authHref('/login')}
                  className="block w-full border border-[#2C2C2C] text-[#A0A0A0] text-sm py-3 mb-3 rounded-md hover:bg-[#141414] hover:text-white transition-all text-center"
                >
                  Sign in
                </a>
                <a
                  href={authHref('/signup')}
                  className="charge-btn !w-full justify-center"
                >
                  Start free
                </a>
                <p className="text-xs text-[#2E2E2E] text-center mt-4">{siteConfig.contactEmail}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
