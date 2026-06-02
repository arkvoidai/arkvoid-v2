const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

const publicUrl = (key: string, fallback: string) => trimTrailingSlash(process.env[key] || fallback)

export const siteConfig = {
  marketingUrl: publicUrl('NEXT_PUBLIC_SITE_URL', 'https://arkvoid.com'),
  authUrl: publicUrl('NEXT_PUBLIC_AUTH_URL', 'https://auth.arkvoid.com'),
  appUrl: publicUrl('NEXT_PUBLIC_APP_URL', 'https://app.arkvoid.com'),
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'heyarkvoid@gmail.com',
}

export const authHref = (path = '') => `${siteConfig.authUrl}${path}`
export const appHref = (path = '') => `${siteConfig.appUrl}${path}`
