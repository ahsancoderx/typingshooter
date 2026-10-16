import Link from 'next/link';
const COLUMNS = [
  {
    title: 'Practice',
    links: [
      ['Typing Test', '/typing-test'],
      ['Game', '/game'],
      ['Progress', '/progress'],
      ['Settings', '/settings'],
    ],
  },
  {
    title: 'Learn',
    links: [
      ['All lessons', '/learn'],
      ['Home row keys', '/learn/home-row-keys'],
      ['Accuracy before speed', '/learn/accuracy-before-speed'],
    ],
  },
  {
    title: 'TypeBlaster',
    links: [
      ['About', '/about'],
      ['Contact', '/contact'],
      ['Privacy Policy', '/privacy'],
      ['Terms of Use', '/terms'],
    ],
  },
];
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">TypeBlaster</p>
          <p className="muted">
            Free typing practice, lessons, and a 3D typing game. Progress is saved in your browser.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="footer-title">{col.title}</h2>
            <ul>
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container footer-bottom muted">© TypeBlaster</div>
    </footer>
  );
}
