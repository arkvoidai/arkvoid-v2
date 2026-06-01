"use client"

import { useState, useEffect } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useApp } from '../../../components/providers/app-provider';
import { Eye, EyeOff, Copy, AlertTriangle, Key, X, Check } from 'lucide-react';
import { useToast } from '../../../components/ui/toast';
import { motion, AnimatePresence } from 'framer-motion';

async function hashKey(key: string) {
  const msgBuffer = new TextEncoder().encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface ApiKeyRow {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  last_used_at: string | null;
  active: boolean;
}

export default function ApiKeysPage() {
  const { org } = useApp();
  const supabase = createClient();
  const { success, error, toast } = useToast();

  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showMainKey, setShowMainKey] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['trace', 'read']);
  
  const [savedKeyData, setSavedKeyData] = useState<{name: string, key: string} | null>(null);
  const [keySavedConfirm, setKeySavedConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      if (!org?.id) return;
      const { data } = await supabase
        .from('api_keys')
        .select('*')
        .eq('org_id', org.id)
        .order('created_at', { ascending: false });
      
      if (data) setKeys(data);
      setLoading(false);
    }
    load();
  }, [org?.id, supabase]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ type: 'info', title: 'Copied to clipboard', duration: 2000 });
  };

  const createApiKey = async () => {
    if (!newKeyName || !org?.id) return;
    setCreating(true);
    try {
      const rawSecret = Array.from(crypto.getRandomValues(new Uint8Array(24)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      const fullKey = `av_live_${rawSecret}`;
      
      const keyHash = await hashKey(fullKey);
      const keyPrefix = fullKey.substring(0, 12);

      const { data, error: err } = await supabase
        .from('api_keys')
        .insert({
          org_id: org.id,
          name: newKeyName,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          scopes: newKeyScopes,
          active: true
        })
        .select()
        .single();
        
      if (err) throw err;
      
      if (data) {
        setKeys([data, ...keys]);
        setSavedKeyData({ name: newKeyName, key: fullKey });
        setCreateOpen(false);
        setNewKeyName('');
        setNewKeyScopes(['trace', 'read']);
        setKeySavedConfirm(false);
      }
    } catch(err: any) {
      error('Failed to create API key', err.message);
    }
    setCreating(false);
  };

  const toggleScope = (scope: string) => {
    setNewKeyScopes(prev => 
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  return (
    <div className="pb-12 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-4xl font-light text-white">API Keys</h1>
        <p className="text-sm text-[#6e6c76] mt-2">Manage programmatic access to your Arkvoid workspace.</p>
      </div>

      {/* MAIN API KEY CARD */}
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[16px] text-white">Live API Key</span>
          <span className="bg-[rgba(217,104,70,0.1)] text-[#d96846] border border-[rgba(217,104,70,0.2)] text-[10px] uppercase tracking-wide rounded-[4px] px-2 py-0.5">Keep secret</span>
        </div>
        <p className="text-[13px] text-[#6e6c76] mt-1">Your primary workspace key. Use this initialized in your server-side environment.</p>
        
        <div className="mt-4 flex items-center gap-2 bg-[#000] border border-[#1a1a1a] rounded-xl flex-1 pl-4 pr-1.5 py-1.5">
          <div className="font-mono text-[13px] text-[#cdcbd6] flex-1 overflow-hidden">
            {showMainKey ? org?.api_key || '' : `av_live_${'•'.repeat(28)}`}
          </div>
          <button 
            onClick={() => setShowMainKey(!showMainKey)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-[#3d3b45] hover:text-[#cdcbd6] hover:bg-[#111] transition-colors"
          >
            {showMainKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button 
            onClick={() => org?.api_key && copyToClipboard(org.api_key)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-[#3d3b45] hover:text-[#cdcbd6] hover:bg-[#111] transition-colors"
          >
            <Copy size={14} />
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2 text-[12px] text-[#6e6c76] bg-[#050505] p-3 rounded-lg border border-[#111]">
          <AlertTriangle size={14} className="text-[#d96846] flex-shrink-0 mt-0.5" />
          <span>Never expose your Live keys in client-side code, public repositories, or browser environments.</span>
        </div>
      </div>

      {/* QUICKSTART CODE */}
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-[#1a1a1a] flex gap-6 items-center bg-[#050505]">
          <span className="text-[14px] text-white font-medium">Quickstart</span>
          <div className="flex gap-4 text-[12px]">
            <button className="text-[#d96846] border-b border-[#d96846] pb-1">Node.js</button>
            <button className="text-[#3d3b45] pb-1 cursor-not-allowed">Python</button>
          </div>
        </div>
        <div className="bg-[#000] px-5 py-5 overflow-x-auto text-[12px] leading-relaxed">
          <pre className="font-mono text-[#6e6c76]"><span className="text-[#d96846]">npm</span> install @arkvoid/sdk{'\n\n'}
<span className="text-[#9876aa]">import</span> {"{ arkvoid }"} <span className="text-[#9876aa]">from</span> <span className="text-[#98c379]">{"'@arkvoid/sdk'"}</span>;{'\n\n'}
<span className="text-[#9876aa]">const</span> <span className="text-[#cdcbd6]">av</span> = <span className="text-[#61afef]">arkvoid</span>({'{'} apiKey: process.env.<span className="text-[#98c379]">ARKVOID_KEY</span> {'}'});{'\n\n'}
<span className="text-[#5c6370] italic">{"// Wrap your AI call"}</span>{'\n'}
<span className="text-[#9876aa]">const</span> <span className="text-[#cdcbd6]">result</span> = <span className="text-[#c678dd]">await</span> av.<span className="text-[#61afef]">trace</span>({'{'}{'\n'}
{'  '}model: <span className="text-[#98c379]">{"'gpt-4o'"}</span>,{'\n'}
{'  '}domain: <span className="text-[#98c379]">{"'finance'"}</span>,{'\n'}
{'  '}input_context: {'{'} user_profile, rules {'}'},{'\n'}
{'  '}output_decision: generatedResponse{'\n'}
{'}'});
          </pre>
        </div>
      </div>

      {/* ADDITIONAL KEYS */}
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#1a1a1a] bg-[#050505]">
          <span className="text-[15px] text-white">Additional Keys</span>
          <button 
            onClick={() => setCreateOpen(true)}
            className="text-[12px] text-white border border-[#2e2e2e] hover:border-[#6e6c76] hover:bg-[#111] px-3 py-1.5 rounded-md transition-colors"
          >
            Create key
          </button>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center text-[#3d3b45]">Loading...</div>
        ) : keys.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center border-t border-[#111]">
            <Key size={24} className="text-[#3d3b45] mb-3" />
            <span className="text-[13px] text-[#cdcbd6] mb-1">No additional keys created.</span>
            <span className="text-[12px] text-[#6e6c76]">Create scoped keys for different environments.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <tr>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium">Name</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium">Key Prefix</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium">Scopes</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium">Last Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616] bg-[#050505]">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-[#0a0a0a] transition-colors">
                  <td className="px-5 py-3.5 text-[13px] text-white font-medium">{k.name}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#6e6c76]">{k.key_prefix}...</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 flex-wrap max-w-[150px]">
                      {k.scopes.map(s => (
                        <span key={s} className="bg-[#111] border border-[#222] text-[#cdcbd6] text-[10px] px-1.5 py-0.5 rounded-sm">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-[#6e6c76]">
                    {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !creating && setCreateOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-6 w-full max-w-[400px] relative z-10 shadow-2xl">
              <button onClick={() => setCreateOpen(false)} className="absolute right-4 top-4 text-[#3d3b45] hover:text-white"><X size={16} /></button>
              <h2 className="text-[20px] font-light text-white mb-6">Create new API key</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[12px] text-[#6e6c76] block mb-1.5">Key Name</label>
                  <input type="text" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="e.g. Staging Environment" className="w-full bg-[#000] border border-[#222222] rounded-lg px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-[#d96846]" />
                </div>
                
                <div>
                  <label className="text-[12px] text-[#6e6c76] block mb-2">Assign Scopes</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['trace', 'read', 'governance', 'world_state'].map(scope => {
                      const active = newKeyScopes.includes(scope);
                      return (
                        <div key={scope} onClick={() => toggleScope(scope)} className={`border rounded-lg p-2.5 flex items-center gap-2 cursor-pointer transition-all ${active ? 'border-[#d96846]/40 bg-[rgba(217,104,70,0.06)]' : 'border-[#1a1a1a] hover:border-[#2e2e2e] bg-[#000]'}`}>
                          <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${active ? 'bg-[#d96846] border-[#d96846]' : 'border-[#3d3b45]'}`}>
                            {active && <Check size={10} className="text-white" />}
                          </div>
                          <span className="text-[12px] text-white capitalize">{scope.replace('_', ' ')}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <button 
                onClick={createApiKey} disabled={!newKeyName || creating}
                className="w-full mt-6 bg-white text-black hover:bg-[#e0e0e0] font-medium py-2.5 rounded-lg text-[14px] disabled:opacity-50 transition-colors"
              >
                {creating ? 'Creating...' : 'Create secret key'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURE KEY DISPLAY MODAL */}
      <AnimatePresence>
        {savedKeyData && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f0f0f] border border-[#222222] rounded-2xl p-6 w-full max-w-[480px] relative z-10 shadow-2xl">
              
              <div className="flex items-center gap-3 bg-[rgba(217,104,70,0.08)] border border-[rgba(217,104,70,0.2)] text-[#d96846] p-4 rounded-xl mb-6">
                <AlertTriangle size={20} className="flex-shrink-0" />
                <div className="text-[13px] leading-relaxed">
                  <strong>Save this key securely.</strong> This is the only time it will be shown. You will not be able to view it again after closing this window.
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-[11px] text-[#6e6c76] mb-1.5 uppercase tracking-wide px-1">Generated Key: {savedKeyData.name}</div>
                <div className="bg-[#000] border border-[#333] rounded-lg p-4 flex gap-3">
                  <div className="font-mono text-[14px] text-white flex-1 select-all break-all overflow-hidden">{savedKeyData.key}</div>
                </div>
              </div>

              <button 
                onClick={() => copyToClipboard(savedKeyData.key)}
                className="w-full mb-4 bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#333] font-medium py-3 rounded-lg text-[14px] flex justify-center items-center gap-2 transition-colors"
              >
                <Copy size={16} /> Copy to Clipboard
              </button>

              <label className="flex items-center gap-3 p-3 bg-[#050505] rounded-lg cursor-pointer mb-6 border border-transparent hover:border-[#222] transition-colors">
                <input 
                  type="checkbox" 
                  checked={keySavedConfirm} 
                  onChange={(e) => setKeySavedConfirm(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-[#3d3b45] accent-[#d96846] cursor-pointer"
                />
                <span className="text-[13px] text-[#cdcbd6]">I have copied and saved this key securely.</span>
              </label>

              <button 
                onClick={() => setSavedKeyData(null)}
                disabled={!keySavedConfirm}
                className="w-full bg-[#d96846] text-white hover:bg-[#c25a3a] font-medium py-3 rounded-lg text-[14px] disabled:opacity-30 transition-colors"
              >
                Done
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
