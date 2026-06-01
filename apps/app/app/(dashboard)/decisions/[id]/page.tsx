import { createClient } from '../../../../lib/supabase/server';
import Link from 'next/link';
import { 
  Clock, Cpu, GitBranch, Copy, AlertTriangle, 
  AlertOctagon, Info, CheckCircle, ChevronLeft 
} from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return { title: `Decision ${params.id.slice(0,8)}` };
}

export default async function DecisionDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();
  
  const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single();
  if (!profile) return notFound();

  const { data: decision } = await supabase
    .from('decision_events')
    .select('*')
    .eq('id', params.id)
    .eq('org_id', profile.org_id)
    .single();

  if (!decision) return notFound();

  const trustColorInfo = (score: number) => {
    if (score >= 0.9) return { text: '#596235', bg: 'rgba(89,98,53,0.06)', border: '#596235', letter: 'A' };
    if (score >= 0.75) return { text: '#728040', bg: 'rgba(114,128,64,0.06)', border: '#728040', letter: 'B' };
    if (score >= 0.6) return { text: '#d96846', bg: 'rgba(217,104,70,0.06)', border: '#d96846', letter: 'C' };
    if (score >= 0.4) return { text: '#d96846', bg: 'rgba(217,104,70,0.06)', border: '#d96846', letter: 'D' };
    return { text: '#912c2c', bg: 'rgba(145,44,44,0.06)', border: '#912c2c', letter: 'F' };
  };

  const tColor = decision.trust_score !== null ? trustColorInfo(decision.trust_score) : null;
  const dashArrayVal = decision.trust_score !== null ? decision.trust_score * 235 : 0;

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* HEADER */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link href="/decisions" className="inline-flex items-center gap-1 text-sm text-[#6e6c76] hover:text-white transition-colors">
            <ChevronLeft size={16} />
            <span>Decisions</span>
          </Link>
          
          <div className="mt-3 flex items-center gap-3">
            <span className="font-mono text-sm text-[#cdcbd6]">{decision.id}</span>
            <button className="text-[#3d3b45] hover:text-white transition-colors" title="Copy ID">
              <Copy size={14} />
            </button>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-xs text-[#6e6c76]">
              <Clock size={12} className="text-[#3d3b45]" />
              {new Date(decision.created_at).toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6e6c76]">
              <Cpu size={12} className="text-[#3d3b45]" />
              <span className="font-mono text-[#cdcbd6]">{decision.model_name}</span>
            </div>
          </div>
        </div>

        {tColor && (
          <div 
            className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-light text-[24px]"
            style={{ 
              backgroundColor: tColor.bg, 
              borderColor: `rgba(${tColor.border.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(',')}, 0.4)`,
              color: tColor.text 
            }}
          >
            {decision.trust_grade}
          </div>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        
        {/* COLUMN 1 */}
        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden p-5 flex flex-col">
          <div className="text-[10px] uppercase tracking-widest text-[#6e6c76] mb-6">Trust Analysis</div>
          
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 200 110" width="200" height="110" className="overflow-visible">
              <path 
                d="M 25 100 A 75 75 0 0 1 175 100" 
                fill="none" 
                stroke="#1a1a1a" 
                strokeWidth="10" 
                strokeLinecap="round" 
              />
              <path 
                d="M 25 100 A 75 75 0 0 1 175 100" 
                fill="none" 
                stroke={tColor?.border || '#3d3b45'} 
                strokeWidth="10" 
                strokeLinecap="round" 
                strokeDasharray={`${dashArrayVal} 1000`}
                className="transition-all duration-1000 ease-out"
              />
              <text x="100" y="85" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="300">
                {decision.trust_score !== null ? decision.trust_score.toFixed(2) : '—'}
              </text>
              <text x="100" y="105" textAnchor="middle" fill="#6e6c76" fontSize="11">
                TRUST SCORE
              </text>
            </svg>
          </div>

          <div className="mt-4 flex flex-col gap-0 border-t border-[#1a1a1a]">
            <div className="flex justify-between py-3 border-b border-[#1a1a1a]">
              <span className="text-[12px] text-[#6e6c76]">Confidence</span>
              <span className="text-[12px] text-white">
                {decision.confidence_score !== null ? `${(decision.confidence_score * 100).toFixed(0)}%` : '—'}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-[#1a1a1a]">
              <span className="text-[12px] text-[#6e6c76]">Governance</span>
              <span className="text-[12px] capitalize flex items-center gap-1.5" style={{ color: dStatusColor(decision.governance_status) }}>
                {decision.governance_status}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-[#1a1a1a]">
              <span className="text-[12px] text-[#6e6c76]">Provenance</span>
              <span className={`text-[12px] ${decision.provenance_verified ? 'text-[#596235]' : 'text-[#d96846]'}`}>
                {decision.provenance_verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-[12px] text-[#6e6c76]">Latency</span>
              <span className="text-[12px] text-white font-mono">{decision.latency_ms ? `${decision.latency_ms}ms` : '—'}</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-0 overflow-hidden flex flex-col gap-0">
          <div>
            <div className="px-5 pt-5 pb-3 flex justify-between items-center">
              <span className="text-[10px] text-[#6e6c76] uppercase tracking-widest">Input Context</span>
              <button className="text-[#3d3b45] hover:text-[#cdcbd6]"><Copy size={12} /></button>
            </div>
            <div className="bg-[#050505] border-y border-[#1a1a1a] px-5 py-4 max-h-[300px] overflow-y-auto no-scrollbar">
              <pre className="font-mono text-[11px] text-[#cdcbd6] whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(decision.input_context, null, 2)}
              </pre>
            </div>
          </div>
          
          <div>
            <div className="px-5 pt-5 pb-3 flex justify-between items-center">
              <span className="text-[10px] text-[#6e6c76] uppercase tracking-widest">Output Decision</span>
              <button className="text-[#3d3b45] hover:text-[#cdcbd6]"><Copy size={12} /></button>
            </div>
            <div className="bg-[#050505] border-t border-[#1a1a1a] px-5 py-4 max-h-[300px] overflow-y-auto no-scrollbar rounded-b-xl">
              <pre className="font-mono text-[11px] text-[#cdcbd6] whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(decision.output_decision, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* COLUMN 3 */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch size={16} className="text-[#6e6c76]" />
              <span className="text-[13px] text-white font-medium">Causal Attribution</span>
            </div>
            
            {decision.causal_explanation ? (
              <p className="text-[13px] text-[#cdcbd6] leading-relaxed mb-5">
                {decision.causal_explanation}
              </p>
            ) : (
               <p className="text-[13px] text-[#3d3b45] leading-relaxed mb-5 italic">
                No causal explanation generated for this decision.
              </p>
            )}

            {Array.isArray(decision.causal_factors) && decision.causal_factors.length > 0 && (
              <div className="flex flex-col gap-4">
                {decision.causal_factors.map((factor: any, i: number) => {
                  const w = Math.abs(factor.weight || 0) * 100;
                  const isNeg = factor.weight < 0;
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#cdcbd6] font-mono truncate mr-2">{factor.name}</span>
                        <span className="text-[#6e6c76]">{factor.weight > 0 ? '+' : ''}{(factor.weight * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-[3px] bg-[#1a1a1a] rounded-full overflow-hidden w-full">
                        <div 
                          className={`h-full rounded-full ${isNeg ? 'bg-[#d96846]' : 'bg-[#596235]'}`}
                          style={{ width: `${Math.min(w, 100)}%` }}
                        />
                      </div>
                      {factor.is_sensitive && (
                        <div className="text-[10px] text-[#d96846] mt-0.5 uppercase tracking-wide">⚠ Protected Category</div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-5">
            <div className="text-[13px] text-white font-medium mb-4">Governance</div>
            
            {(!decision.governance_violations || decision.governance_violations.length === 0) ? (
              <div className="flex items-center gap-2 text-[#596235] bg-[rgba(89,98,53,0.06)] border border-[rgba(89,98,53,0.2)] p-3 rounded-lg">
                <CheckCircle size={16} />
                <span className="text-sm">All checks passed</span>
              </div>
            ) : (
              <div className="flex flex-col">
                {decision.governance_violations.map((v: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-[#1a1a1a] last:border-0 last:pb-0 pt-0 first:pt-0">
                    <div className="mt-0.5">
                      {v.severity === 'block' ? <AlertOctagon size={14} className="text-[#912c2c]" /> :
                       v.severity === 'flag' ? <AlertTriangle size={14} className="text-[#d96846]" /> :
                       <Info size={14} className="text-[#6e6c76]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-white flex items-center justify-between">
                        <span className="truncate pr-2">{v.rule_name}</span>
                        <span className="text-[10px] uppercase tracking-wide text-[#6e6c76] bg-[#1a1a1a] px-1.5 py-0.5 rounded-sm">{v.severity}</span>
                      </div>
                      <div className="text-[11px] text-[#6e6c76] mt-1 leading-relaxed">
                        {v.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-5">
             <div className="text-[13px] text-white font-medium mb-4">Metadata</div>
             <div className="text-[12px] flex flex-col gap-2.5">
                <div className="flex items-baseline">
                  <span className="w-24 text-[#6e6c76] shrink-0">Tags</span>
                  <span className="text-[#cdcbd6]">
                    {decision.tags?.length > 0 ? decision.tags.join(', ') : '—'}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-24 text-[#6e6c76] shrink-0">Content Hash</span>
                  <span className="text-[#cdcbd6] font-mono truncate">{decision.content_hash || '—'}</span>
                </div>
                <div className="flex items-baseline">
                  <span className="w-24 text-[#6e6c76] shrink-0">SDK</span>
                  <span className="text-[#cdcbd6] font-mono">{decision.sdk_version || '—'}</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function dStatusColor(s: string) {
  if (s === 'passed') return '#596235';
  if (s === 'flagged') return '#d96846';
  if (s === 'blocked') return '#912c2c';
  return '#6e6c76';
}
