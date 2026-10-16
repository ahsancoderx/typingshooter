export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const SITE_NAME = 'TypeBlaster';
export function buildMetadata({ title, description, path = '/', noIndex = false }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, type: 'website', locale: 'en_US' },
    twitter: { card: 'summary', title, description },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
