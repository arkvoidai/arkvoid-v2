export type Plan = 'free' | 'team' | 'enterprise'
export type Role = 'owner' | 'admin' | 'member' | 'viewer'
export type GovernanceStatus = 'passed' | 'flagged' | 'blocked' | 'pending' | 'reviewing'
export type Severity = 'block' | 'flag' | 'warn' | 'log'
export type TrustGrade = 'A' | 'B' | 'C' | 'D' | 'F'
export type Domain = 'credit' | 'healthcare' | 'hiring' | 'legal' | 'marketing' | 'logistics' | 'security' | 'custom'

export interface Organization {
  id: string
  name: string
  slug: string
  plan: Plan
  api_key: string
  decisions_this_month: number
  decisions_limit: number
  onboarding_complete: boolean
  onboarding_step: number
  primary_domain: Domain | null
  webhook_url: string | null
  slack_webhook_url: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  org_id: string
  full_name: string | null
  email: string | null
  role: Role
  avatar_url: string | null
  timezone: string
  onboarding_done: boolean
  created_at: string
}

export interface DecisionEvent {
  id: string
  org_id: string
  model_name: string
  model_version: string | null
  model_provider: string | null
  input_context: Record<string, unknown>
  output_decision: Record<string, unknown>
  confidence_score: number | null
  trust_score: number | null
  trust_grade: TrustGrade | null
  causal_factors: CausalFactor[]
  causal_explanation: string | null
  counterfactual_summary: string | null
  governance_status: GovernanceStatus
  governance_violations: GovernanceViolation[]
  data_sources: DataSource[]
  provenance_verified: boolean
  domain: Domain | null
  tags: string[]
  content_hash: string | null
  sdk_version: string | null
  latency_ms: number | null
  created_at: string
}

export interface CausalFactor {
  factor: string
  causal_weight: number
  direction: 'positive' | 'negative' | 'neutral'
  counterfactual: string
  is_sensitive: boolean
}

export interface GovernanceViolation {
  rule_id: string
  rule_name: string
  severity: Severity
  message: string
}

export interface DataSource {
  name: string
  type: string
  verified: boolean
  hash: string | null
}

export interface GovernanceRule {
  id: string
  org_id: string
  name: string
  description: string | null
  rule_logic: RuleLogic
  severity: Severity
  active: boolean
  triggered_count: number
  last_triggered_at: string | null
  created_at: string
  updated_at: string
}

export interface RuleLogic {
  field: string
  operator: string
  value: unknown
}

export interface ApiKey {
  id: string
  org_id: string
  name: string
  key_prefix: string
  scopes: string[]
  last_used_at: string | null
  expires_at: string | null
  active: boolean
  created_at: string
}

export interface DashboardStats {
  decisions_today: number
  decisions_yesterday: number
  decisions_this_month: number
  avg_trust_score_7d: number | null
  avg_trust_score_prev_7d: number | null
  violations_this_week: number
  active_rules: number
}

export interface ChartPoint {
  date: string
  value: number
  count?: number
}

export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}
