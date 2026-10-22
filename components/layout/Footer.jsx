import Link from 'next/link';

const LINKS = [
  ['Typing Test', '/typing-test'],
  ['Game', '/game'],
  ['Learn', '/learn'],
  ['Progress', '/progress'],
  ['About', '/about'],
  ['Contact', '/contact'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-row">
        <Link href="/" className="footer-brand">
          TypeBlaster
        </Link>
        <nav aria-label="Footer">
          <ul>
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <p>Progress is saved in this browser only.</p>
      </div>
    </footer>
  );
}
