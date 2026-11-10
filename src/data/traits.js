export const BLOOD_TYPES = ['0-', '0+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const TRAITS = {
  stoic: {
    id: 'stoic',
    glyph: '◆',
  },
  night_owl: {
    id: 'night_owl',
    glyph: '☽',
  },
  fast_metabolism: {
    id: 'fast_metabolism',
    glyph: '⚕',
  },
  hoarder: {
    id: 'hoarder',
    glyph: '▤',
  },
  iron_stomach: {
    id: 'iron_stomach',
    glyph: '🛡',
  },
};

export const RANDOM_NAMES = [
  'Deniz',
  'Kerem',
  'Elena',
  'Viktor',
  'Mara',
  'Marcus',
  'Leyla',
  'Nora',
  'Barış',
  'Zehra',
  'Roland',
  'Sarp',
  'Maya',
  'Kaan',
  'Selin',
  'Jax',
  'Silas',
  'Tariq',
  'Cem',
  'Bora',
  'Derya',
  'Aylin',
  'Vera',
  'Iskandar',
];

export function getRandomName(exclude = '') {
  const pool = RANDOM_NAMES.filter((name) => name !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] || 'Survivor';
}

export function getAgeBracket(age) {
  if (age <= 25) return 'young';
  if (age <= 40) return 'prime';
  return 'veteran';
}

