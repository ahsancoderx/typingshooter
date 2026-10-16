export const PASSAGES = {
  paragraphs: {
    easy: [
      'The sun is up. We go to the park and play with the red ball. The dog runs fast and we run too.',
      'I like to read books at home. My cat sits by the window and watches the birds in the tree.',
    ],
    medium: [
      'Every morning, Maria walks to the market to buy fresh bread and fruit. She greets her neighbors and carries her bag home before the shops get busy.',
      'Learning to type well takes steady practice. Short sessions every day work better than one long session once a week.',
    ],
    hard: [
      'Although the schedule seemed impossible, the team reorganized its priorities, delegated carefully, and delivered the project - complete with documentation - two days ahead of the deadline.',
      '"Precision matters," the editor said; however, speed matters too. Strong typists balance both, correcting mistakes quickly without losing their rhythm.',
    ],
  },
  quotes: {
    easy: ['A small step each day adds up.', 'Slow is smooth and smooth is fast.'],
    medium: [
      'Practice does not make perfect; careful practice makes progress.',
      'What you repeat with attention becomes a habit you no longer notice.',
    ],
    hard: [
      'Accuracy first: speed is simply accuracy that has had time to relax.',
      'The expert has failed more times than the beginner has even tried.',
    ],
  },
  code: {
    easy: ["const name = 'Ada';", 'let total = 0;', "console.log('hello');"],
    medium: [
      'function add(a, b) { return a + b; }',
      'const items = [1, 2, 3].map((n) => n * 2);',
      'if (score > 10) { level += 1; }',
    ],
    hard: [
      'export async function load(id) { const res = await fetch(`/api/${id}`); return res.json(); }',
      'const total = items.reduce((sum, { price }) => sum + price, 0);',
      'for (const [key, value] of Object.entries(data)) { map.set(key, value); }',
    ],
  },
};
