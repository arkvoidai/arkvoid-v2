"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    const duration = opts.duration ?? 4500
    
    setToasts((prev) => {
      const newToasts = [...prev, { ...opts, id, duration }]
      if (newToasts.length > 5) {
        return newToasts.slice(newToasts.length - 5)
      }
      return newToasts
    })

    setTimeout(() => {
      dismiss(id)
    }, duration)
  }, [dismiss])

  const success = React.useCallback((title: string, message?: string) => toast({ type: 'success', title, message }), [toast])
  const error = React.useCallback((title: string, message?: string) => toast({ type: 'error', title, message }), [toast])
  const warning = React.useCallback((title: string, message?: string) => toast({ type: 'warning', title, message }), [toast])
  const info = React.useCallback((title: string, message?: string) => toast({ type: 'info', title, message }), [toast])

  const contextValue = React.useMemo(() => ({
    toast,
    success,
    error,
    warning,
    info,
    dismiss
  }), [toast, success, error, warning, info, dismiss])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-0 right-0 left-0 p-3 md:bottom-4 md:right-4 md:left-auto md:p-0 z-[500] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} dismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, dismiss }: { toast: Toast, dismiss: (id: string) => void }) {
  const isType = toast.type
  const borderColor = 
    isType === 'success' ? 'border-l-[#596235]' :
    isType === 'error' ? 'border-l-[#912c2c]' :
    isType === 'warning' ? 'border-l-[#d96846]' :
    'border-l-[#cdcbd6]/40'

  const Icon = 
    isType === 'success' ? CheckCircle2 :
    isType === 'error' ? XCircle :
    isType === 'warning' ? AlertTriangle :
    Info

  const iconColor =
    isType === 'success' ? 'text-[#596235]' :
    isType === 'error' ? 'text-[#912c2c]' :
    isType === 'warning' ? 'text-[#d96846]' :
    'text-[#cdcbd6]'

  const progressColor =
    isType === 'success' ? 'bg-[#596235]' :
    isType === 'error' ? 'bg-[#912c2c]' :
    isType === 'warning' ? 'bg-[#d96846]' :
    'bg-[#cdcbd6]'

  const duration = toast.duration ?? 4500

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`min-w-[280px] max-w-[380px] w-full md:w-auto bg-[#0f0f0f] border border-[#222222] border-l-[2px] ${borderColor} rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden`}
    >
      <div className="p-4 flex items-start gap-3">
        <Icon size={16} className={`${iconColor} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1 min-w-0">
          <div className="text-[14px] text-white font-normal truncate">{toast.title}</div>
          {toast.message && (
            <div className="text-xs text-[#6e6c76] mt-0.5">{toast.message}</div>
          )}
        </div>

        <button 
          onClick={() => dismiss(toast.id)}
          className="text-[#3d3b45] hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      
      <div className="h-[2px] bg-[#1a1a1a] relative w-full">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className={`absolute left-0 top-0 bottom-0 ${progressColor}`}
        />
      </div>
    </motion.div>
  )
}
