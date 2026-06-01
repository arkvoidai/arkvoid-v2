"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'form' | 'success'>('form')

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace('/forgot-password?error=expired')
      }
    }
    checkSession()
  }, [router])

  const calculateStrength = (pass: string) => {
    let s = 0
    if (pass.length >= 8) s++
    if (/[A-Z]/.test(pass)) s++
    if (/[0-9]/.test(pass)) s++
    if (/[!@#$%^&*]/.test(pass)) s++
    return s as 0 | 1 | 2 | 3 | 4
  }

  const strength = calculateStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (strength < 2) {
      setError('Please choose a stronger password')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setStep('success')
      setTimeout(() => {
        router.push('https://app.arkvoid.com')
      }, 2500)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#000] px-6 py-12">
      <div className="w-full max-w-[380px] mx-auto">
        <div className="flex justify-center mb-10">
          <div className="w-[28px] h-[28px] relative">
            <div className="absolute w-[16px] h-[16px] rounded-sm bg-white top-1 left-1 rotate-12" />
            <div className="absolute w-[16px] h-[16px] rounded-sm bg-[#d96846] top-2.5 left-2.5 -rotate-6 opacity-85" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h1 className="text-2xl font-light text-white mb-2">Set new password</h1>
              <p className="text-sm text-[#6e6c76] mb-8">Please enter your new password below.</p>

              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="mb-4">
                  <label className="text-xs text-[#6e6c76] mb-1.5 block">New Password</label>
                  <div className="relative border border-[#1a1a1a] rounded-md transition-all focus-within:border-[#d96846]/50 focus-within:ring-1 focus-within:ring-[rgba(217,104,70,0.15)]">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#000] rounded-md px-3.5 py-2.5 pr-10 text-white text-[14px] placeholder:text-[#2e2e2e] focus:outline-none disabled:opacity-40 [style:color-scheme:dark]"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d3b45] hover:text-[#6e6c76] transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  {password.length > 0 && (
                    <div className="mt-2 text-xs">
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
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="text-xs text-[#6e6c76] mb-1.5 block">Confirm Password</label>
                  <div className="relative border border-[#1a1a1a] rounded-md transition-all focus-within:border-[#d96846]/50 focus-within:ring-1 focus-within:ring-[rgba(217,104,70,0.15)]">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#000] rounded-md px-3.5 py-2.5 pr-10 text-white text-[14px] placeholder:text-[#2e2e2e] focus:outline-none disabled:opacity-40 [style:color-scheme:dark]"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d3b45] hover:text-[#6e6c76] transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-4"
                    >
                      <div className="flex items-start gap-2.5 bg-[rgba(145,44,44,0.08)] border border-[rgba(145,44,44,0.2)] rounded-md p-3">
                        <AlertCircle size={14} className="text-[#912c2c] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-[#912c2c]">{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-[#000] text-[14px] font-medium py-2.5 rounded-md h-11 hover:bg-[#e8e6f0] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#000]/20 border-t-[#000] rounded-full animate-spin" />
                  ) : (
                    'Update password'
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <CheckCircle2 size={36} className="text-[#596235] mx-auto mb-6" />
              <h2 className="text-2xl font-light text-white mb-3">Password updated</h2>
              <p className="text-sm text-[#6e6c76] leading-relaxed mb-6">
                Your password has been successfully reset. Redirecting to your dashboard...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
