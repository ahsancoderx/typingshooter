import { Geist, Geist_Mono, Space_Grotesk, JetBrains_Mono, Space_Mono } from 'next/font/google';
import ThemeRegistry from '@/components/layout/ThemeRegistry';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import './globals.css';
import './typeblaster.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const ui = Space_Grotesk({ subsets: ['latin'], variable: '--font-ui', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const label = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-label',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - Free Typing Games and Typing Practice`, template: `%s | ${SITE_NAME}` },
  description:
    'Free typing speed test, beginner typing lessons, and a 3D typing shooter game with saved progress.',
  applicationName: SITE_NAME,
};

export const viewport = { themeColor: '#3F6B64' };

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ui.variable} ${mono.variable} ${label.variable}`}
    >
      <body>
        <ThemeRegistry>
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
