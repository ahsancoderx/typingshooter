const B = 'Beginner',
  I = 'Intermediate',
  A = 'Advanced';
export const LESSONS = [
  {
    slug: 'understanding-the-keyboard',
    title: 'Understanding the keyboard',
    track: B,
    summary: 'Learn the main areas of the keyboard and where common keys live.',
    objectives: [
      'Name the letter, number, and modifier areas',
      'Find Space, Shift, Backspace, and Enter without looking',
    ],
    explanation:
      'A keyboard is grouped into regions: letters in the middle, numbers above them, and modifier keys such as Shift on the edges. Knowing the regions makes it easier to build muscle memory later.',
    steps: [
      'Look at your keyboard and locate the three letter rows.',
      'Find the Space bar, both Shift keys, and Backspace.',
      'Type the practice sentence slowly.',
    ],
    drill: 'The keyboard has letters, numbers, and symbols. I can find each key one step at a time.',
    minAcc: 85,
  },
  {
    slug: 'posture-and-hand-placement',
    title: 'Correct sitting posture and hand placement',
    track: B,
    summary: 'Set up your seat, wrists, and hands to type comfortably.',
    objectives: ['Sit with feet flat and back supported', 'Keep wrists straight and floating above the keys'],
    explanation:
      'Good posture reduces strain and helps accuracy. Your elbows should be near a right angle, your screen at eye level, and your wrists neutral rather than bent or resting heavily on the desk.',
    steps: [
      'Place both feet flat on the floor.',
      'Raise or lower the screen so you look slightly down at it.',
      'Let your hands hover over the keys with curved fingers.',
    ],
    drill: 'I sit tall, keep my wrists straight, and let my fingers rest lightly on the keys.',
    minAcc: 85,
  },
  {
    slug: 'home-row-keys',
    title: 'Home row keys: ASDF and JKL;',
    track: B,
    summary: 'Anchor your fingers on the home row and learn to return to it.',
    objectives: [
      'Rest fingers on A S D F and J K L ;',
      'Use the bumps on F and J to find home without looking',
    ],
    explanation:
      'The home row is your base position. Your left fingers rest on A, S, D, F and your right fingers on J, K, L and semicolon. Most keyboards have small bumps on F and J so your index fingers can find them by touch.',
    steps: [
      'Feel for the bumps on F and J with your index fingers.',
      'Rest the other fingers beside them.',
      'Type the drill and return to home after every key.',
    ],
    drill: 'asdf jkl; asdf jkl; fjfj dkdk slsl a;a; fdsa jkl; sad lad fall ask',
    minAcc: 90,
  },
  {
    slug: 'left-hand-placement',
    title: 'Left-hand finger placement',
    track: B,
    summary: 'Learn which left finger reaches which key.',
    objectives: ['Assign each left finger to its keys', 'Reach and return to home row'],
    explanation:
      'Each finger owns a column. The left pinky covers Q, A, Z, the ring finger W, S, X, the middle finger E, D, C, and the index finger R, F, V and T, G, B.',
    steps: [
      'Type each column with its finger only.',
      'After each reach, return to the home row.',
      'Increase speed only when you make no errors.',
    ],
    drill: 'qaz wsx edc rfv tgb fed sad ward gave dress waves tragedy',
    minAcc: 90,
  },
  {
    slug: 'right-hand-placement',
    title: 'Right-hand finger placement',
    track: B,
    summary: 'Learn which right finger reaches which key.',
    objectives: ['Assign each right finger to its keys', 'Reach and return to home row'],
    explanation:
      'The right index finger covers Y, H, N and U, J, M. The middle finger covers I, K, the ring finger O, L, and the pinky P and semicolon.',
    steps: [
      'Type each column with its finger only.',
      'Keep your right thumb ready on the Space bar.',
      'Slow down whenever errors appear.',
    ],
    drill: 'yhn ujm ik, ol. p;/ hill pool jump milk union nylon opinion',
    minAcc: 90,
  },
  {
    slug: 'practicing-individual-letters',
    title: 'Practicing individual letters',
    track: B,
    summary: 'Build recall for every letter with short mixed drills.',
    objectives: ['Type all 26 letters without looking', 'Keep accuracy above 90 percent'],
    explanation:
      'Letter drills train your fingers to find each key from memory. Focus on rhythm: each key press should take about the same time.',
    steps: [
      'Keep your eyes on the text, not the keys.',
      'Aim for an even rhythm.',
      'If you miss a key, note it and repeat it slowly.',
    ],
    drill: 'quick zephyrs blow vexing daft jim the five boxing wizards jump quickly',
    minAcc: 90,
  },
  {
    slug: 'short-words-and-sentences',
    title: 'Short words and simple sentences',
    track: B,
    summary: 'Move from letters to real words and short sentences.',
    objectives: ['Type common short words smoothly', 'Use Space with the thumb'],
    explanation:
      'Words are the building blocks of real typing. Treat each word as one flowing motion instead of separate letters.',
    steps: [
      'Read a word, then type it in one motion.',
      'Press Space with your thumb.',
      'Keep a steady pace across the whole sentence.',
    ],
    drill: 'The cat sat on the mat. We can run to the park. I like to read a good book.',
    minAcc: 90,
  },
  {
    slug: 'top-and-bottom-row',
    title: 'Top row and bottom row keys',
    track: I,
    summary: 'Reach up and down from the home row with confidence.',
    objectives: ['Type top-row letters from home position', 'Type bottom-row letters from home position'],
    explanation:
      'Top-row keys are one step up from home and bottom-row keys are one step down. The key is to move only the reaching finger and keep the rest anchored.',
    steps: [
      'Practice the top row: QWERTYUIOP.',
      'Practice the bottom row: ZXCVBNM.',
      'Combine both in words.',
    ],
    drill: 'quit write power route type your pencil zoom vixen combine number minimum',
    minAcc: 90,
  },
  {
    slug: 'capital-letters-and-shift',
    title: 'Capital letters and Shift',
    track: I,
    summary: 'Use the opposite-hand Shift key for clean capitals.',
    objectives: ['Press Shift with the hand opposite the letter', 'Release Shift promptly'],
    explanation:
      'To capitalize a letter typed by the left hand, press the right Shift with your right pinky, and the other way around. This keeps both hands efficient.',
    steps: [
      'Hold Shift with the opposite pinky.',
      'Tap the letter and release both.',
      'Type the names in the drill.',
    ],
    drill: 'Anna Brown met David Evans in Paris, London, and Tokyo. Maria Lopez flew to Sydney.',
    minAcc: 90,
  },
  {
    slug: 'numbers-and-punctuation',
    title: 'Numbers and punctuation',
    track: I,
    summary: 'Reach the number row and common punctuation marks.',
    objectives: ['Type digits 0-9 from the home row', 'Use commas, periods, and apostrophes accurately'],
    explanation:
      'Numbers are on the top row, so reach with the nearest finger and return home. Punctuation sits at the right edge of the home and bottom rows.',
    steps: [
      'Practice each digit with its column finger.',
      'Add a comma or period after each group.',
      'Check punctuation before moving on.',
    ],
    drill: "In 2024, we sold 135 books, 48 pens, and 7 maps. It's 9:30, isn't it?",
    minAcc: 90,
  },
  {
    slug: 'common-english-words',
    title: 'Common English words',
    track: I,
    summary: 'Speed up on the words you type most often.',
    objectives: ['Type the most common words as single motions', 'Reach 20 WPM with 90 percent accuracy'],
    explanation:
      'A small set of words makes up a large share of everyday text. Practicing them makes your fingers fast on the patterns you use most.',
    steps: [
      'Type each word as a unit.',
      'Do not pause between words.',
      'Repeat the drill if your accuracy drops.',
    ],
    drill: 'the and that have for not with you this but his from they say her she will one all would there',
    minAcc: 90,
    minWpm: 15,
  },
  {
    slug: 'longer-sentences-and-paragraphs',
    title: 'Longer sentences and paragraphs',
    track: I,
    summary: 'Build stamina with full sentences and short paragraphs.',
    objectives: ['Stay accurate through a paragraph', 'Keep your rhythm after punctuation'],
    explanation:
      'Longer text builds endurance. The main skill is keeping your eyes on the text and your pace even, including at commas and full stops.',
    steps: [
      'Read a few words ahead as you type.',
      'Keep your pace steady at punctuation.',
      'Finish the whole paragraph without stopping.',
    ],
    drill:
      'Learning to type well takes steady practice. Short sessions every day work better than one long session once a week.',
    minAcc: 92,
    minWpm: 15,
  },
  {
    slug: 'accuracy-before-speed',
    title: 'Accuracy before speed',
    track: I,
    summary: 'Build clean habits that make speed easier later.',
    objectives: ['Hold 95 percent accuracy', 'Slow down when errors appear'],
    explanation:
      'Fixing errors costs more time than typing slowly and correctly. Speed grows naturally once accurate keystrokes become automatic.',
    steps: [
      'Type at a pace where you make almost no errors.',
      'If you make two errors in a row, slow down.',
      'Raise your pace only after a clean run.',
    ],
    drill:
      'Accuracy is the foundation of speed. A careful typist who makes few errors finishes faster than a hurried one.',
    minAcc: 95,
  },
  {
    slug: 'long-form-typing',
    title: 'Long-form typing practice',
    track: A,
    summary: 'Practice sustained typing over several sentences.',
    objectives: ['Type for several minutes without losing focus', 'Keep accuracy above 92 percent'],
    explanation:
      'Long-form practice trains concentration and stamina. Take a breath between paragraphs and keep your shoulders relaxed.',
    steps: [
      'Sit comfortably and relax your shoulders.',
      'Type the passage in one go.',
      'Review where your accuracy dipped.',
    ],
    drill:
      'Every morning, Maria walks to the market to buy fresh bread and fruit. She greets her neighbors and carries her bag home before the shops get busy. Later, she writes letters at the kitchen table while the soup simmers.',
    minAcc: 92,
    minWpm: 20,
  },
  {
    slug: 'punctuation-and-capitalization-drills',
    title: 'Punctuation and capitalization drills',
    track: A,
    summary: 'Combine Shift, quotes, commas, and dashes in real sentences.',
    objectives: [
      'Type quotation marks and hyphens smoothly',
      'Switch between capitals and lowercase without pausing',
    ],
    explanation:
      'Punctuation slows many typists. Practice using the correct finger for each mark so your rhythm does not break.',
    steps: [
      'Type slowly and focus on each mark.',
      'Use opposite-hand Shift for capitals.',
      'Repeat until the marks feel automatic.',
    ],
    drill:
      '"Precision matters," the editor said; however, speed matters too. Strong typists balance both - always.',
    minAcc: 92,
  },
  {
    slug: 'typing-consistency',
    title: 'Typing consistency',
    track: A,
    summary: 'Even out your rhythm so your speed is steady.',
    objectives: ['Keep keystroke timing even', 'Avoid bursts followed by pauses'],
    explanation:
      'Consistent rhythm is faster in the long run than sprinting and stopping. Try to hit each key with the same pace, even on difficult words.',
    steps: [
      'Pick a pace you can hold.',
      'Do not rush easy words.',
      'Check the WPM chart in the typing test for spikes.',
    ],
    drill: 'steady hands make steady words and steady words make fast pages without rush or pause',
    minAcc: 92,
    minWpm: 20,
  },
  {
    slug: 'identifying-weak-keys',
    title: 'Identifying weak keys',
    track: A,
    summary: 'Find the keys you miss most and practice them on purpose.',
    objectives: ['Read the weak-key list on the Progress page', 'Drill your three most-missed keys'],
    explanation:
      'Your Progress page lists the keys you miss most across tests and lessons. Targeted practice on those keys improves accuracy faster than general practice.',
    steps: [
      'Open the Progress page and note your most-missed keys.',
      'Type the drill below, then make your own drill with those letters.',
      'Retest after a few days.',
    ],
    drill: 'jazz quartz whiz buzz fizz zigzag quiz pixel jaw box yak vex',
    minAcc: 90,
  },
  {
    slug: 'programming-text-practice',
    title: 'Programming text practice',
    track: A,
    summary: 'Practice brackets, quotes, and symbols used in code.',
    objectives: ['Type brackets and braces accurately', 'Handle symbols such as = ; ( ) { }'],
    explanation:
      'Code uses symbols that sit on the edges of the keyboard. Practice them in short, realistic lines so they become automatic.',
    steps: [
      'Type each line slowly.',
      'Watch your pinky on brackets and semicolons.',
      'Repeat any line with errors.',
    ],
    drill: 'function add(a, b) { return a + b; } const items = [1, 2, 3].map((n) => n * 2);',
    minAcc: 92,
  },
  {
    slug: 'timed-typing-challenges',
    title: 'Timed typing challenges',
    track: A,
    summary: 'Apply your skills under time pressure.',
    objectives: ['Type under a clock without panicking', 'Keep accuracy above 92 percent while speeding up'],
    explanation:
      'Timed practice shows how your skills hold up under pressure. Try the Typing Test page with a 60-second timer after this lesson.',
    steps: [
      'Take a breath before starting.',
      'Type the drill at a brisk, controlled pace.',
      'Then try a 60-second test.',
    ],
    drill:
      'The team reorganized its priorities, delegated carefully, and delivered the project two days ahead of the deadline.',
    minAcc: 92,
    minWpm: 25,
  },
  {
    slug: 'final-skill-assessment',
    title: 'Final skill assessment',
    track: A,
    summary: 'Prove your skills with a longer assessment passage.',
    objectives: ['Reach 25 WPM or more', 'Keep accuracy at 94 percent or higher'],
    explanation:
      'This assessment combines capitals, punctuation, and longer sentences. Pass it to complete the course, then keep practicing with the game and the typing test.',
    steps: [
      'Warm up with a few home row keys.',
      'Type the passage at a pace you control.',
      'Review your results.',
    ],
    drill:
      'Although the schedule seemed impossible, the team reorganized its priorities, delegated carefully, and delivered the project ahead of the deadline. "Precision matters," the editor said; speed matters too.',
    minAcc: 94,
    minWpm: 25,
  },
];
export const getLesson = (slug) => LESSONS.find((l) => l.slug === slug);
