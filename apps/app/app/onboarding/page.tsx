"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '../../lib/supabase/client';
import { CreditCard, Heart, Users, Zap, ShieldCheck, Eye, EyeOff, Copy } from 'lucide-react';
import { useToast } from '../../components/ui/toast';
import { authHref } from '../../lib/site-config';

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [workspaceName, setWorkspaceName] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [org, setOrg] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState(false);
  
  const router = useRouter();
  const { toast, success, error } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
      if (!user) {
        router.push(authHref('/login'));
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*, organizations(*)')
        .eq('id', user.id)
        .single();
        
      if (profile) {
        if (profile.onboarding_done) {
          router.push('/');
          return;
        }
        
        const orgs = profile.organizations;
        const currentOrg = Array.isArray(orgs) ? orgs[0] : orgs;
        if (currentOrg) {
          setOrg(currentOrg);
          setWorkspaceName(currentOrg.name);
          setApiKey(currentOrg.api_key || '');
        }
      }
    }
    loadData();
  }, [supabase, router]);

  const handleComplete = async () => {
    if (!org) return;
    setSaving(true);
    try {
      // update org
      await supabase
        .from('organizations')
        .update({ name: workspaceName, primary_domain: selectedDomain })
        .eq('id', org.id);
        
      // update profile done
      const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
      if (user) {
        await supabase
          .from('profiles')
          .update({ onboarding_done: true })
          .eq('id', user.id);
      }
      
      success('Workspace ready', 'Your Arkvoid workspace is set up.');
      router.push('/');
    } catch (err: any) {
      error('Failed to complete onboarding', err.message);
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast({ type: 'success', title: 'API Key copied to clipboard', duration: 2000 });
  };

  return (
    <div className="min-h-dvh bg-[#000] flex flex-col font-sans text-white">
      {/* TOP BAR */}
      <div className="py-5 px-8 flex justify-between items-center bg-[#000]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#d96846] rounded-sm transform rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#000] rounded-sm" />
          </div>
          <span className="font-medium tracking-tight text-white text-[15px]">Arkvoid</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#6e6c76]">Step {step} of 3</span>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-8 h-1 rounded-full transition-colors duration-300 ${
                  s < step ? 'bg-[#d96846]' : s === step ? 'bg-[#d96846]/50' : 'bg-[#1a1a1a]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-[480px] w-full mx-auto relative h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <h1 className="text-[40px] font-light text-white tracking-tight leading-tight">Welcome to Arkvoid.</h1>
                <p className="text-[17px] text-[#6e6c76] mt-2 mb-8">Let&apos;s set up your workspace.</p>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] text-[#cdcbd6]">Workspace name</label>
                  <input 
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Acme AI Workspace"
                    className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-4 py-3 text-[15px] text-white placeholder-[#3d3b45] focus:outline-none focus:border-[#d96846] focus:ring-1 focus:ring-[#d96846] transition-all"
                  />
                </div>
                
                <button 
                  onClick={() => setStep(2)}
                  disabled={workspaceName.trim().length < 2}
                  className="w-full bg-[#d96846] hover:bg-[#c25a3a] text-white disabled:opacity-50 disabled:hover:bg-[#d96846] text-[15px] font-medium py-3 rounded-lg mt-6 transition-colors"
                >
                  Continue &rarr;
                </button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <h1 className="text-[32px] font-light text-white tracking-tight leading-tight">What will you govern first?</h1>
                <p className="text-[15px] text-[#6e6c76] mt-2 mb-8">We&apos;ll configure the right rules and examples.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'finance', icon: CreditCard, title: 'Credit & Lending', desc: 'Loan approvals, credit decisions' },
                    { id: 'health', icon: Heart, title: 'Healthcare AI', desc: 'Clinical recommendations' },
                    { id: 'hr', icon: Users, title: 'HR & Hiring', desc: 'Candidate screening, hiring' },
                    { id: 'custom', icon: Zap, title: 'Custom / Other', desc: 'Configure your own rules' },
                  ].map((option) => (
                    <div 
                      key={option.id}
                      onClick={() => setSelectedDomain(option.id)}
                      className={`cursor-pointer bg-[#0f0f0f] border rounded-xl p-5 transition-all
                        ${selectedDomain === option.id 
                          ? 'border-[rgba(217,104,70,0.4)] bg-[rgba(217,104,70,0.04)] ring-1 ring-[rgba(217,104,70,0.4)]' 
                          : 'border-[#1a1a1a] hover:border-[#2e2e2e]'
                        }`}
                    >
                      <option.icon size={20} className="text-[#d96846]" />
                      <div className="text-[15px] text-white mt-4 font-normal">{option.title}</div>
                      <div className="text-xs text-[#6e6c76] mt-1 leading-relaxed">{option.desc}</div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setStep(3)}
                  disabled={!selectedDomain}
                  className="w-full bg-[#d96846] hover:bg-[#c25a3a] text-white disabled:opacity-50 disabled:hover:bg-[#d96846] text-[15px] font-medium py-3 rounded-lg mt-8 transition-colors"
                >
                  Continue &rarr;
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="w-full block text-center text-sm text-[#6e6c76] hover:text-[#cdcbd6] mt-4 transition-colors"
                >
                  &larr; Back
                </button>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <h1 className="text-[36px] font-light text-white tracking-tight leading-tight">You&apos;re ready.</h1>
                <p className="text-[15px] text-[#6e6c76] mt-2 mb-8">Connect Arkvoid to your first AI system.</p>
                
                <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-5 mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={16} className="text-[#596235]" />
                    <span className="text-sm text-[#cdcbd6] font-medium">Your Live API Key</span>
                    <span className="text-xs text-[#3d3b45] ml-auto bg-[#1a1a1a] px-2 py-0.5 rounded-full">Keep secret</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-[#000] border border-[#222222] rounded-md px-4 py-3 group">
                    <div className="flex-1 font-mono text-[13px] text-[#cdcbd6] tracking-wide">
                      {showKey ? apiKey : `av_live_${'•'.repeat(24)}`}
                    </div>
                    <button 
                      onClick={() => setShowKey(!showKey)}
                      className="text-[#3d3b45] hover:text-[#cdcbd6] p-1.5 transition-colors"
                    >
                      {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button 
                      onClick={copyToClipboard}
                      className="text-[#3d3b45] hover:text-[#cdcbd6] p-1.5 transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  
                  <div className="bg-[#050505] border border-[#1a1a1a] rounded-md p-4 mt-5">
                    <pre className="font-mono text-[11px] leading-relaxed text-[#6e6c76] overflow-x-auto no-scrollbar">
                      <span className="text-[#d96846]">npm</span> install @arkvoid/sdk{'\n\n'}
                      <span className="text-[#9876aa]">const</span> <span className="text-[#cdcbd6]">av</span> = <span className="text-[#61afef]">arkvoid</span>({'{'} apiKey: process.env.<span className="text-[#98c379]">ARKVOID_KEY</span> {'}'}){'\n'}
                      <span className="text-[#9876aa]">const</span> <span className="text-[#cdcbd6]">result</span> = <span className="text-[#c678dd]">await</span> av.<span className="text-[#61afef]">trace</span>({'{'} model, input, decision {'}'})
                    </pre>
                  </div>
                </div>
                
                <button 
                  onClick={handleComplete}
                  disabled={saving}
                  className="w-full bg-[#d96846] hover:bg-[#c25a3a] text-white disabled:opacity-50 disabled:hover:bg-[#d96846] text-[15px] font-medium py-3 rounded-lg transition-colors shadow-[0_4px_16px_rgba(217,104,70,0.2)]"
                >
                  {saving ? 'Saving...' : 'Go to dashboard →'}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
