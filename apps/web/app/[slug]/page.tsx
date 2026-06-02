import Link from 'next/link'
import { Footer } from '../../components/nav/footer'
import { authHref, siteConfig } from '../../lib/site-config'

const pages: Record<string, { title: string; eyebrow: string; body: string; cta?: string }> = {
  blog: {
    eyebrow: 'Company',
    title: 'Arkvoid Blog',
    body: 'Product notes, governance guides, and engineering updates are being consolidated here. Check back soon for the permanent publishing hub.',
    cta: 'Read the documentation',
  },
  changelog: {
    eyebrow: 'Product',
    title: 'Changelog',
    body: 'A public release log for decision tracing, causal attribution, and governance runtime updates is coming soon.',
    cta: 'Start free',
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    body: 'Arkvoid is designed to minimize retained personal data while preserving the audit context teams need for trustworthy AI operations.',
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    body: 'These terms will describe acceptable use, account obligations, and service limitations for Arkvoid workspaces.',
  },
  compliance: {
    eyebrow: 'Trust',
    title: 'EU AI Act Readiness',
    body: 'Arkvoid helps teams maintain AI decision logs, governance checks, and explainability records needed for compliance reviews.',
    cta: 'View trust center',
  },
}

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export default function StaticMarketingPage({ params }: { params: { slug: string } }) {
  const page = pages[params.slug] || {
    eyebrow: 'Arkvoid',
    title: 'Page coming soon',
    body: 'This destination is reserved for a future Arkvoid resource. Use the links below to continue.',
  }

  const ctaHref = page.cta === 'View trust center'
    ? siteConfig.trustUrl
    : page.cta === 'Read the documentation'
      ? siteConfig.docsUrl
      : authHref('/signup')

  return (
    <>
      <main className="min-h-[70dvh] bg-black px-5 pt-32 pb-20">
        <section className="content-width">
          <div className="max-w-3xl rounded-2xl border border-[#1E1E1E] bg-[#0C0C0C] p-8 sm:p-12">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#CCFF00]">{page.eyebrow}</p>
            <h1 className="font-serif text-[clamp(38px,7vw,72px)] leading-none tracking-tight text-white">{page.title}</h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-7 text-[#A0A0A0]">{page.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {page.cta && (
                <a href={ctaHref} className="charge-btn">
                  {page.cta}
                </a>
              )}
              <Link href="/" className="inline-flex items-center rounded-md border border-[#2C2C2C] px-5 py-2.5 text-sm text-[#A0A0A0] transition-colors hover:bg-[#141414] hover:text-white">
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
