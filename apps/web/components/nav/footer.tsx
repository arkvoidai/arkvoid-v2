export function Footer() {
  return (
    <footer className="bg-black border-t border-[#1E1E1E]">
      <div className="py-16 px-5 content-width">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-[28px] h-[28px] relative">
                <div className="absolute w-[16px] h-[16px] rounded-sm bg-white top-1 left-1 rotate-12" />
                <div className="absolute w-[16px] h-[16px] rounded-sm bg-[#CCFF00] top-2.5 left-2.5 -rotate-6 opacity-85" />
              </div>
              <span className="font-sans font-medium text-[16px] text-white">
                Arkvoid
              </span>
            </div>
            <p className="text-[13px] text-[#3A3A3A] mt-3 max-w-[200px] leading-relaxed">
              The trust infrastructure for the AI economy.
            </p>
            <div className="flex gap-2 flex-wrap mt-4">
              <div className="surface-1 rounded-xs px-2.5 py-1 text-[11px] text-[#555555]">SOC2</div>
              <div className="surface-1 rounded-xs px-2.5 py-1 text-[11px] text-[#555555]">GDPR</div>
              <div className="surface-1 rounded-xs px-2.5 py-1 text-[11px] text-[#555555]">EU AI Act</div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.12em] text-[#2C2C2C] mb-4">Product</h3>
            <ul className="flex flex-col">
              <li><a href="/#features" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Decision Ledger</a></li>
              <li><a href="/#features" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Causal Attribution</a></li>
              <li><a href="/#features" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Governance Runtime</a></li>
              <li><a href="/#features" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">World State</a></li>
              <li><a href="/changelog" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.12em] text-[#2C2C2C] mb-4">Developers</h3>
            <ul className="flex flex-col">
              <li><a href="https://docs.arkvoid.com" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Documentation</a></li>
              <li><a href="https://api.arkvoid.com" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">API Reference</a></li>
              <li><a href="#" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">SDK</a></li>
              <li><a href="#" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Status</a></li>
              <li><a href="#" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.12em] text-[#2C2C2C] mb-4">Company</h3>
            <ul className="flex flex-col">
              <li><a href="#" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">About</a></li>
              <li><a href="/blog" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Blog</a></li>
              <li><a href="/#pricing" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Pricing</a></li>
              <li><a href="#" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Careers</a></li>
              <li><a href="mailto:heyarkvoid@gmail.com" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.12em] text-[#2C2C2C] mb-4">Trust</h3>
            <ul className="flex flex-col">
              <li><a href="https://trust.arkvoid.com" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Security</a></li>
              <li><a href="/privacy" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Privacy Policy</a></li>
              <li><a href="/terms" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">Terms of Service</a></li>
              <li><a href="/compliance" className="block text-[13px] text-[#3A3A3A] hover:text-[#A0A0A0] transition-colors py-1">EU AI Act</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#0F0F0F] py-6 px-5">
        <div className="content-width flex flex-wrap justify-between gap-4">
          <div className="text-[12px] text-[#2C2C2C]">
            © 2026 Arkvoid, Inc.
          </div>
          <div className="text-[12px] text-[#2C2C2C]">
            Made in Bangalore, India 🇮🇳
          </div>
        </div>
      </div>
    </footer>
  );
}
