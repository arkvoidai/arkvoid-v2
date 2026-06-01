"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { AuthShell } from '../../components/auth-shell'
import { createClient } from '../../lib/supabase/client'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [resendCountdown, setResendCountdown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === 'verify' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [step, resendCountdown])

  const calculateStrength = (pass: string) => {
    let s = 0
    if (pass.length >= 8) s++
    if (/[A-Z]/.test(pass)) s++
    if (/[0-9]/.test(pass)) s++
    if (/[!@#$%^&*]/.test(pass)) s++
    return s as 0 | 1 | 2 | 3 | 4
  }

  const strength = calculateStrength(password)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setError(null)

    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = 'Name is required'
    if (!email) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email'
    if (!password) errors.password = 'Password is required'
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters'
    
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setStep('verify')
      setResendCountdown(30)
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="w-full"
          >
            <div>
              <h1 className="text-3xl font-light text-white">Create account</h1>
              <p className="text-sm text-[#6e6c76] mt-1.5">Start governing your AI decisions today.</p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col mt-7">
              <div className="mb-4">
                <label className="text-xs text-[#6e6c76] mb-1.5 block">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-[#000] border ${fieldErrors.name ? 'border-[#912c2c]/50 focus:border-[#912c2c]' : 'border-[#1a1a1a] focus:border-[#d96846]/50'} rounded-md px-3.5 py-2.5 text-white text-[14px] placeholder:text-[#2e2e2e] focus:outline-none focus:ring-1 focus:ring-[rgba(217,104,70,0.15)] transition-all [style:color-scheme:dark]`}
                  placeholder="Jane Doe"
                  disabled={loading}
                />
                {fieldErrors.name && (
                  <div className="text-xs text-[#912c2c] mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.name}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="text-xs text-[#6e6c76] mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-[#000] border ${fieldErrors.email ? 'border-[#912c2c]/50 focus:border-[#912c2c]' : 'border-[#1a1a1a] focus:border-[#d96846]/50'} rounded-md px-3.5 py-2.5 text-white text-[14px] placeholder:text-[#2e2e2e] focus:outline-none focus:ring-1 focus:ring-[rgba(217,104,70,0.15)] transition-all [style:color-scheme:dark]`}
                  placeholder="you@company.com"
                  disabled={loading}
                />
                {fieldErrors.email && (
                  <div className="text-xs text-[#912c2c] mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.email}
                  </div>
                )}
              </div>

              <div className="mb-4 relative">
                <label className="text-xs text-[#6e6c76] mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-[#000] border ${fieldErrors.password ? 'border-[#912c2c]/50 focus:border-[#912c2c]' : 'border-[#1a1a1a] focus:border-[#d96846]/50'} rounded-md px-3.5 py-2.5 pr-10 text-white text-[14px] placeholder:text-[#2e2e2e] focus:outline-none focus:ring-1 focus:ring-[rgba(217,104,70,0.15)] transition-all [style:color-scheme:dark]`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d3b45] hover:text-[#6e6c76] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <div className="text-xs text-[#912c2c] mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.password}
                  </div>
                )}
                
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-[3px]">
                      {[1, 2, 3, 4].map((s) => (
                        <div
                          key={s}
                          className={`flex-1 rounded-full transition-all ${
                            strength >= s
                              ? strength === 1 ? 'bg-[#912c2c]'
                                : strength === 2 ? 'bg-[#d96846]'
                                : strength === 3 ? 'bg-[#ffd600]'
                                : 'bg-[#596235]'
                              : 'bg-[#1a1a1a]'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs mt-1.5 text-right w-full">
                      {strength === 1 && <span className="text-[#912c2c]">Weak</span>}
                      {strength === 2 && <span className="text-[#d96846]">Fair</span>}
                      {strength === 3 && <span className="text-[#ffd600]">Good</span>}
                      {strength === 4 && <span className="text-[#596235]">Strong</span>}
                    </div>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {password.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <label className="text-xs text-[#6e6c76] mb-1.5 block">Confirm password</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full bg-[#000] border ${fieldErrors.confirmPassword ? 'border-[#912c2c]/50 focus:border-[#912c2c]' : 'border-[#1a1a1a] focus:border-[#d96846]/50'} rounded-md px-3.5 py-2.5 pr-10 text-white text-[14px] placeholder:text-[#2e2e2e] focus:outline-none focus:ring-1 focus:ring-[rgba(217,104,70,0.15)] transition-all [style:color-scheme:dark]`}
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d3b45] hover:text-[#6e6c76]"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <div className="text-xs text-[#912c2c] mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} /> {fieldErrors.confirmPassword}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2.5 bg-[rgba(145,44,44,0.08)] border border-[rgba(145,44,44,0.2)] rounded-md p-3 mb-4"
                  >
                    <AlertCircle size={14} className="text-[#912c2c] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#912c2c]">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d96846] text-white text-[14px] font-medium py-2.5 rounded-md h-11 hover:bg-[#b8522e] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_20px_rgba(217,104,70,0.2)]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="text-xs text-[#3d3b45] text-center mt-4 px-4 leading-relaxed">
                By creating an account you agree to our{' '}
                <a href="/terms" className="underline hover:text-[#6e6c76]">Terms</a> and{' '}
                <a href="/privacy" className="underline hover:text-[#6e6c76]">Privacy Policy</a>
              </div>
            </form>

            <div className="mt-8 text-center text-sm text-[#6e6c76]">
              Already have an account?{' '}
              <a href="/login" className="text-white hover:underline transition-colors">
                Sign in
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="w-full text-center py-8"
          >
            <CheckCircle2 size={36} className="text-[#596235] mx-auto mb-6" />
            <h2 className="text-2xl font-light text-white mb-3">Check your inbox</h2>
            <p className="text-sm text-[#6e6c76] leading-relaxed mb-8">
              We sent a verification link to<br />
              <span className="text-white font-medium">{email}</span>
            </p>
            
            <div className="border border-[#1a1a1a] rounded-xl p-5 bg-[#080808]">
              <p className="text-xs text-[#6e6c76] mb-4">Didn&apos;t receive the email?</p>
              {resendCountdown > 0 ? (
                <div className="text-xs text-[#3d3b45]">
                  Resend in {resendCountdown}s
                </div>
              ) : (
                <button 
                  type="button" 
                  className="text-sm text-[#d96846] hover:text-[#b8522e] font-medium"
                  onClick={() => {
                    const supabase = createClient()
                    supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback` }})
                    setResendCountdown(30)
                  }}
                >
                  Resend email
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  )
}
