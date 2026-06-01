"use client"

import { useState, useEffect } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useApp } from '../../../components/providers/app-provider';
import { Plus, Info, ShieldOff, MoreHorizontal, X } from 'lucide-react';
import { useToast } from '../../../components/ui/toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Rule {
  id: string;
  name: string;
  description: string;
  rule_logic: any;
  severity: 'block' | 'flag' | 'warn' | 'log';
  active: boolean;
  triggered_count: number;
  last_triggered_at: string | null;
}

export default function GovernancePage() {
  const { org } = useApp();
  const supabase = createClient();
  const { success, error } = useToast();
  
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSev, setFormSev] = useState<'block'|'flag'|'warn'|'log'>('warn');
  const [formField, setFormField] = useState('trust_score');
  const [formOp, setFormOp] = useState('lt');
  const [formVal, setFormVal] = useState('');

  useEffect(() => {
    async function load() {
      if (!org?.id) return;
      const { data } = await supabase
        .from('governance_rules')
        .select('*')
        .eq('org_id', org.id)
        .order('created_at', { ascending: false });
      
      if (data) setRules(data);
      setLoading(false);
    }
    load();
  }, [org?.id, supabase]);

  const toggleRule = async (ruleId: string, currentStatus: boolean) => {
    const updated = !currentStatus;
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, active: updated } : r));
    
    const { error: err } = await supabase
      .from('governance_rules')
      .update({ active: updated })
      .eq('id', ruleId);
      
    if (err) {
      setRules(prev => prev.map(r => r.id === ruleId ? { ...r, active: currentStatus } : r));
      error('Failed to update rule');
    }
  };

  const deleteRule = async () => {
    if (!deletingId) return;
    const previous = [...rules];
    setRules(prev => prev.filter(r => r.id !== deletingId));
    setDeletingId(null);
    
    const { error: err } = await supabase
      .from('governance_rules')
      .delete()
      .eq('id', deletingId);
      
    if (err) {
      setRules(previous);
      error('Failed to delete rule');
    } else {
      success('Rule deleted');
    }
  };

  const saveRule = async () => {
    if (!formName) return;
    setSaving(true);
    
    let processedVal: any = formVal;
    if (['trust_score', 'confidence_score'].includes(formField)) {
        processedVal = parseFloat(formVal);
    } else if (formVal === 'true') processedVal = true;
    else if (formVal === 'false') processedVal = false;
    
    const logic = {
      field: formField,
      operator: formOp,
      value: processedVal
    };

    const { data, error: err } = await supabase
      .from('governance_rules')
      .insert({
        org_id: org.id,
        name: formName,
        description: formDesc,
        severity: formSev,
        rule_logic: logic,
        active: true
      })
      .select()
      .single();

    if (err) {
      error('Failed to create rule', err.message);
    } else if (data) {
      setRules([data, ...rules]);
      success('Rule created successfully');
      setCreateOpen(false);
      // reset form
      setFormName('');
      setFormDesc('');
      setFormSev('warn');
      setFormField('trust_score');
      setFormOp('lt');
      setFormVal('');
    }
    setSaving(false);
  };

  const formatLogic = (logic: any) => {
    if (!logic || !logic.field) return "Custom rule logic";
    return `When ${logic.field} ${logic.operator} ${logic.value}`;
  };

  const getSeverityStyle = (s: string) => {
    if (s === 'block') return { borderL: 'border-l-[#912c2c]', badge: 'bg-[rgba(145,44,44,0.1)] text-[#912c2c] border-[rgba(145,44,44,0.2)]' };
    if (s === 'flag') return { borderL: 'border-l-[#d96846]', badge: 'bg-[rgba(217,104,70,0.08)] text-[#d96846] border-[rgba(217,104,70,0.2)]' };
    if (s === 'warn') return { borderL: 'border-l-[rgba(217,104,70,0.4)]', badge: 'bg-[#0f0f0f] text-[#6e6c76] border-[#222222]' };
    return { borderL: 'border-l-[#1a1a1a]', badge: 'bg-[#0a0a0a] text-[#3d3b45] border-[#1a1a1a]' };
  };

  return (
    <div className="pb-12 max-w-5xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-light text-white">Governance</h1>
          <p className="text-sm text-[#6e6c76] mt-1">Define rules that every AI decision must satisfy.</p>
        </div>
        <button 
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-[#d96846] hover:bg-[#c25a3a] text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          <Plus size={16} />
          Create Rule
        </button>
      </div>

      {!loading && rules.length < 3 && (
        <div className="bg-[rgba(217,104,70,0.06)] border border-[rgba(217,104,70,0.2)] rounded-xl p-4 mb-6 flex gap-3">
          <Info size={16} className="text-[#d96846]/80 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-[#d96846]/90">Add governance rules to automatically check and flag AI decisions before they impact your users.</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-28 bg-[#0f0f0f] rounded-xl border border-[#1a1a1a]" />)}
          </div>
        ) : rules.length === 0 ? (
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <ShieldOff size={32} className="text-[#3d3b45] mb-4" />
            <h3 className="text-white text-[15px] mb-1">No rules defined</h3>
            <p className="text-sm text-[#6e6c76] max-w-[300px]">Create your first governance rule to start monitoring AI decisions.</p>
          </div>
        ) : (
          rules.map(rule => {
            const style = getSeverityStyle(rule.severity);
            return (
              <div key={rule.id} className={`bg-[#0f0f0f] border-y border-r border-[#1a1a1a] rounded-xl p-5 flex items-start gap-4 border-l-2 ${style.borderL}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[16px] text-white font-normal">{rule.name}</span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[4px] border ${style.badge}`}>
                      {rule.severity}
                    </span>
                    {!rule.active && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[4px] border border-[#222222] text-[#6e6c76] bg-[#111]">
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  {rule.description && (
                    <div className="text-sm text-[#6e6c76] mt-2 leading-relaxed">
                      {rule.description}
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <span className="font-mono text-[11px] bg-[#000] border border-[#1a1a1a] rounded-md px-2.5 py-1.5 inline-block text-[#6e6c76]">
                      {formatLogic(rule.rule_logic)}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex gap-4 text-[11px] text-[#3d3b45]">
                    <span>Triggered {rule.triggered_count} times</span>
                    {rule.last_triggered_at && (
                      <span>Last: {new Date(rule.last_triggered_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <button 
                    onClick={() => toggleRule(rule.id, rule.active)}
                    className="relative w-10 h-5 rounded-full transition-colors"
                    style={{ backgroundColor: rule.active ? '#d96846' : '#1a1a1a' }}
                  >
                    <div 
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                      style={{ transform: rule.active ? 'translateX(22px)' : 'translateX(2px)' }}
                    />
                  </button>
                  <div className="relative group">
                    <button className="text-[#3d3b45] hover:text-white p-1">
                      <MoreHorizontal size={16} />
                    </button>
                    <div className="absolute right-0 top-full mt-1 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg shadow-xl py-1 w-32 hidden group-hover:block z-10">
                      <button onClick={() => setDeletingId(rule.id)} className="w-full text-left px-3 py-2 text-sm text-[#912c2c] hover:bg-[#161616]">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !saving && setCreateOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-6 w-full max-w-[500px] relative z-10 shadow-[0_24px_48px_rgba(0,0,0,0.6)]"
            >
              <button 
                onClick={() => setCreateOpen(false)}
                className="absolute right-5 top-5 text-[#3d3b45] hover:text-white"
              ><X size={18} /></button>
              
              <h2 className="text-2xl font-light text-white mb-6">Create Governance Rule</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#6e6c76] block mb-1.5">Rule Name</label>
                  <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Low confidence block" className="w-full bg-[#000] border border-[#222222] rounded-lg px-3 py-2 text-[14px] text-white focus:outline-none focus:border-[#d96846] transition-colors" />
                </div>
                
                <div>
                  <label className="text-xs text-[#6e6c76] block mb-1.5">Description (optional)</label>
                  <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="What does this rule do?" rows={2} className="w-full bg-[#000] border border-[#222222] rounded-lg px-3 py-2 text-[14px] text-white focus:outline-none focus:border-[#d96846] transition-colors resize-none" />
                </div>

                <div>
                  <label className="text-xs text-[#6e6c76] block mb-2">Severity Action</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'block', label: 'Block', desc: 'Interrupts & stops' },
                      { id: 'flag', label: 'Flag', desc: 'Marks for review' },
                      { id: 'warn', label: 'Warn', desc: 'Logs a warning' },
                      { id: 'log', label: 'Log', desc: 'Silent data tracking' }
                    ].map(s => (
                      <div 
                        key={s.id} 
                        onClick={() => setFormSev(s.id as any)}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${formSev === s.id ? 'border-[#d96846]/40 bg-[rgba(217,104,70,0.06)]' : 'border-[#1a1a1a] hover:border-[#2e2e2e] bg-[#050505]'}`}
                      >
                        <div className="text-[13px] text-white font-medium">{s.label}</div>
                        <div className="text-[10px] text-[#6e6c76] mt-0.5">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1a1a1a]">
                  <label className="text-xs text-[#6e6c76] block mb-2">Condition Logic</label>
                  <div className="flex gap-2">
                    <select value={formField} onChange={e => setFormField(e.target.value)} className="flex-1 bg-[#000] border border-[#222222] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#d96846]">
                      <option value="trust_score">Trust Score</option>
                      <option value="confidence_score">Confidence</option>
                      <option value="governance_status">Status</option>
                      <option value="domain">Domain</option>
                    </select>
                    <select value={formOp} onChange={e => setFormOp(e.target.value)} className="w-[100px] bg-[#000] border border-[#222222] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#d96846]">
                      <option value="lt">is less than</option>
                      <option value="gt">is greater than</option>
                      <option value="eq">equals</option>
                    </select>
                    <input type="text" value={formVal} onChange={e => setFormVal(e.target.value)} placeholder="Value..." className="w-[100px] flex-shrink-0 bg-[#000] border border-[#222222] rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#d96846]" />
                  </div>
                  
                  <div className="mt-3 bg-[#000] border border-[#1a1a1a] rounded-md p-3 text-[12px] text-[#6e6c76] font-mono">
                    When {formField.replace('_', ' ')} {formOp} {formVal || '[value]'}, action is {formSev.toUpperCase()}.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <button 
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-[#6e6c76] hover:text-white transition-colors"
                >Cancel</button>
                <button 
                  onClick={saveRule}
                  disabled={!formName || saving}
                  className="px-4 py-2 rounded-lg text-sm bg-[#d96846] text-white hover:bg-[#c25a3a] disabled:opacity-50 disabled:hover:bg-[#d96846] transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Rule'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0f0f0f] border border-[#222222] rounded-xl p-6 w-full max-w-[360px] relative z-10 shadow-2xl text-center">
              <h3 className="text-[16px] text-white mb-2">Delete this rule?</h3>
              <p className="text-[13px] text-[#6e6c76] mb-6">This action cannot be undone. AI decisions will no longer be evaluated against this rule.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeletingId(null)} className="flex-1 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] text-white text-sm rounded-lg transition-colors">Cancel</button>
                <button onClick={deleteRule} className="flex-1 px-4 py-2 bg-[#912c2c] hover:bg-[#a63434] text-white text-sm rounded-lg transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
