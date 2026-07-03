export const projects = [
  {
    title: 'Volatility Forecasting & Trader Dashboard',
    role: 'Data Science / ML — Team Project',
    year: '2026',
    desc: 'An end-to-end ML pipeline forecasting realised volatility from high-frequency market data, paired with an interactive dashboard so a non-technical trader could actually explore and trust the model.',
    metric: { label: 'Forecasting error reduced', num: '8.3%', extra: '· 112 stocks · 426k+ buckets' },
    stack: ['Python', 'LightGBM', 'Hidden Markov Models', 'Dash', 'SHAP'],
    links: [{ label: 'GitHub', href: 'https://github.com/wasil-m' }],
  },
  {
    title: "Alzheimer's Disease Classifier",
    role: 'Machine Learning — Team Project',
    year: '2024',
    desc: 'A supervised classification system staging Alzheimer’s diagnosis from messy, multi-source clinical data — the real work was integrating three separate datasets into one clean modelling pipeline.',
    metric: { label: 'Held-out accuracy', num: '100%', extra: '· small clinical test set · 361 features' },
    stack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    links: [{ label: 'GitHub', href: 'https://github.com/wasil-m' }],
  },
  {
    title: 'National Student Platform',
    role: 'Full-Stack — Cross-functional Team',
    year: '2025',
    desc: 'A national-scale React platform supporting thousands of users across Australia. I built interactive 3D features and reusable components inside a production codebase with strict review standards.',
    metric: { label: 'Scale', num: '1000s', extra: 'of users nationwide' },
    stack: ['React', 'TypeScript', 'Three.js', 'Vite', 'Tailwind'],
    links: [{ label: 'GitHub', href: 'https://github.com/wasil-m' }],
  },
  {
    title: 'Wizard Tower Defence',
    role: 'Game Development',
    year: '2023',
    desc: 'A full 2D tower defence game built from scratch — sprite rendering, animation, collision detection, enemy pathfinding, and a real-time game loop. Hours of debugging, genuinely worth it.',
    metric: { label: 'Built with', num: 'OOP + JUnit', extra: 'tested game logic' },
    stack: ['Java', 'Gradle', 'JUnit', 'Git'],
    links: [
      { label: 'GitHub', href: 'https://github.com/wasil-m/TowerDefenceGame' },
      { label: 'Demo', href: 'https://youtu.be/lGn5sjUwyZk' },
    ],
  },
  {
    title: 'ByeTide — P2P File Transfer',
    role: 'Systems Programming',
    year: '2024',
    desc: 'A peer-to-peer file transfer system in C, with custom linked-list data structures and manual memory management. A deep dive into low-level debugging — segfaults, concurrency, the works.',
    metric: { label: 'Written in', num: 'C', extra: '· manual memory management' },
    stack: ['C', 'SSH', 'Git'],
    links: [{ label: 'GitHub', href: 'https://github.com/wasil-m' }],
  },
  {
    title: 'AI-Assisted Roblox Game',
    role: 'Personal Project — In Progress',
    year: '2026',
    desc: 'Building a game in Roblox Studio in my own time, using AI tooling to move faster on scripting and mechanics. Purely for the fun of turning an idea into something playable.',
    metric: { label: 'Status', num: 'Ongoing', extra: '· self-directed' },
    stack: ['Roblox Studio', 'Lua', 'AI tooling'],
    links: [],
  },
];

export const skillGroups = [
  { title: 'Languages', items: ['Python', 'Java', 'C', 'SQL', 'JavaScript', 'TypeScript'] },
  { title: 'Machine Learning', items: ['Scikit-learn', 'LightGBM', 'Feature Engineering', 'Model Evaluation', 'Neural Networks', 'RAG / Prompt Eng.'] },
  { title: 'Data & Backend', items: ['Pandas', 'NumPy', 'Flask', 'REST APIs', 'MySQL', 'MongoDB'] },
  { title: 'Frontend', items: ['React', 'TypeScript', 'Three.js', 'Vite', 'Tailwind CSS'] },
  { title: 'Tools & Infra', items: ['Git', 'Docker', 'AWS', 'Pytest', 'JUnit', 'CI/CD'] },
];

export const experience = [
  {
    date: 'May 2023 — Present',
    role: 'Programming & HSC Tutor',
    org: 'Alchemy Tuition',
    desc: 'Two+ years explaining complex technical concepts clearly to students of all backgrounds, running my own scheduling, lesson design, and progress tracking. Where I learned to translate technical ideas for any audience.',
  },
  {
    date: 'Jun 2024 — Mar 2025',
    role: 'Sales Assistant',
    org: 'Optus',
    desc: 'Customer-facing sales and service in store, sharpening negotiation and communication by addressing diverse customer needs and resolving service inquiries on the spot.',
  },
  {
    date: 'Jun 2022 — Mar 2023',
    role: 'Restaurant Team Member',
    org: 'Grill Republic',
    desc: 'Fast-paced, high-pressure environment working closely with a team to keep service running and customers happy.',
  },
];

export const meta = {
  name: 'Wasil Mahbub',
  email: 'wasil0305@gmail.com',
  phone: '0402 388 731',
  location: 'Sydney, NSW',
  github: 'https://github.com/wasil-m',
  linkedin: 'https://linkedin.com/in/wasilmahbub',
};
