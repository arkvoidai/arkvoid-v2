"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Mail, ArrowLeft } from 'lucide-react'
import { createClient } from '../../lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'form' | 'sent'>('form')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://auth.arkvoid.com/reset-password'
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setStep('sent')
      setLoading(false)
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
              <a href="/login" className="inline-flex items-center gap-1.5 text-xs text-[#6e6c76] hover:text-[#cdcbd6] mb-6 transition-colors">
                <ArrowLeft size={12} /> Back to sign in
              </a>

              <h1 className="text-2xl font-light text-white mb-2">Reset your password</h1>
              <p className="text-sm text-[#6e6c76] mb-8">Enter your email and we&apos;ll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="mb-5">
                  <label className="text-xs text-[#6e6c76] mb-1.5 block">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#000] border border-[#1a1a1a] rounded-md px-3.5 py-2.5 text-white text-[14px] placeholder:text-[#2e2e2e] focus:outline-none focus:border-[#d96846]/50 focus:ring-1 focus:ring-[rgba(217,104,70,0.15)] disabled:opacity-40 transition-all [style:color-scheme:dark]"
                    placeholder="you@company.com"
                    disabled={loading}
                  />
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
                    'Send reset link'
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Mail size={36} className="text-[#d96846] mx-auto mb-6" />
              <h2 className="text-2xl font-light text-white mb-3">Reset link sent</h2>
              <p className="text-sm text-[#6e6c76] leading-relaxed mb-8">
                We&apos;ve sent an email to <span className="text-white font-medium">{email}</span> with instructions to reset your password. Be sure to check your spam folder.
              </p>
              
              <a href="/login" className="inline-flex justify-center w-full bg-white text-[#000] text-[14px] font-medium py-2.5 rounded-md hover:bg-[#e8e6f0] transition-colors">
                Return to sign in
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
