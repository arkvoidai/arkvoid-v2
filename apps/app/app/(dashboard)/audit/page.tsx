import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Audit Log',
}

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#3d3b45]">Arkvoid Workspace</p>
        <h1 className="text-3xl font-light tracking-tight text-white">Audit Log</h1>
        <p className="max-w-2xl text-sm leading-6 text-[#6e6c76]">Review security, configuration, and workspace activity across Arkvoid.</p>
      </div>

      <section className="rounded-xl border border-[#1a1a1a] bg-[#080808] p-8">
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-[#222] bg-black/40 p-8 text-center">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#2e2e2e] bg-[#111]">
            <ArrowRight size={16} className="text-[#596235]" />
          </div>
          <h2 className="text-lg font-normal text-white">No audit events yet</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#6e6c76]">
            This route is live and ready for production data once the corresponding Supabase records are present.
          </p>
        </div>
      </section>
    </div>
  )
}
