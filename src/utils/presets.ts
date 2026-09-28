import { Preset, PixelColor } from '../types';

const PAL: Record<string, string> = {
  Y: '#facc15',
  R: '#f43f5e',
  P: '#fda4af',
  G: '#10b981',
  O: '#f59e0b',
  W: '#f8fafc',
  B: '#92400e',
  S: '#94a3b8',
  D: '#64748b',
  M: '#d946ef',
  C: '#06b6d4',
};

export const RAW_PRESETS: Preset[] = [
  {
    id: 'pacman',
    name: 'Pacman',
    rows: [
      '',
      '.....YYYYYY',
      '...YYYYYYYYYY',
      '..YYYYYYYYYYYY',
      '..YYYYY.YYYYY',
      '.YYYYYYYYYYY',
      '.YYYYYYYYY',
      '.YYYYYYY',
      '.YYYYYYY',
      '.YYYYYYYYY',
      '.YYYYYYYYYYY',
      '..YYYYYYYYYYY',
      '..YYYYYYYYYYYY',
      '...YYYYYYYYYY',
      '.....YYYYYY',
      ''
    ]
  },
  {
    id: 'heart',
    name: 'Heart',
    rows: [
      '',
      '',
      '..RRRR....RRRR',
      '.RRPPRR..RRRRRR.',
      'RRPPRRRRRRRRRRRR',
      'RRPRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRRR',
      '.RRRRRRRRRRRRRR',
      '..RRRRRRRRRRRR',
      '...RRRRRRRRRR',
      '....RRRRRRRR',
      '.....RRRRRR',
      '......RRRR',
      '.......RR',
      ''
    ]
  },
  {
    id: 'alien',
    name: 'Invader',
    rows: [
      '',
      '',
      '',
      '',
      '...G.....G',
      '....G...G',
      '...GGGGGGG',
      '..GG.GGG.GG',
      '.GGGGGGGGGGG',
      '.G.GGGGGGG.G',
      '.G.G.....G.G',
      '....GG.GG',
      '',
      '',
      '',
      ''
    ]
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    rows: [
      '.....OOOOOO',
      '...OOOOOOOOOO',
      '..OOOOOOOOOOOO',
      '.OOOOOWOWOOOOOO',
      '.OOOOWWWWWWOOOO',
      'OOOOOWWOOOWWOOOO',
      'OOOOOWWOOOWWOOOO',
      'OOOOOWWWWWWOOOOO',
      'OOOOOWWOOOWWOOOO',
      'OOOOOWWOOOWWOOOO',
      '.OOOOWWWWWWOOOO',
      '.OOOOOWOWOOOOOO',
      '..OOOOOOOOOOOO',
      '...OOOOOOOOOO',
      '.....OOOOOO',
      ''
    ]
  },
  {
    id: 'coffee',
    name: 'Coffee',
    rows: [
      '',
      '....S..S..S',
      '.....S..S..S',
      '....S..S..S',
      '',
      '..WWWWWWWWWW',
      '..WBBBBBBBBW',
      '..WWWWWWWWWWWW',
      '..WWWWWWWWWW.W',
      '..WWWWWWWWWW.W',
      '..WWWWWWWWWWWW',
      '..WWWWWWWWWW',
      '...WWWWWWWW',
      '.DDDDDDDDDDDD',
      '',
      ''
    ]
  },
  {
    id: 'skull',
    name: 'Skull',
    rows: [
      '',
      '....WWWWWWWW',
      '...WWWWWWWWWW',
      '..WWWWWWWWWWWW',
      '..WWWWWWWWWWWW',
      '..WWMMMWWMMMWW',
      '..WWMMMWWMMMWW',
      '..WWWWWWWWWWWW',
      '...WWWW..WWWW',
      '....WWWWWWWW',
      '....WW.WW.WW',
      '....WWWWWWWW',
      '.....W.W.W.W',
      '',
      '',
      ''
    ]
  },
  {
    id: 'check',
    name: 'Check',
    rows: [
      '',
      '',
      '',
      '.............GG',
      '............GGG',
      '...........GGG',
      '..........GGG',
      '.GG......GGG',
      '.GGG....GGG',
      '..GGG..GGG',
      '...GGGGGG',
      '....GGGG',
      '.....GG',
      '',
      '',
      ''
    ]
  },
  {
    id: 'flame',
    name: 'Flame',
    rows: [
      '.......R',
      '......RR',
      '......RRR',
      '.....RRRR...R',
      '....RRORRR.RR',
      '....RROORRRRR',
      '...RRROOORRRR',
      '..RRROOOOORRRR',
      '..RROOOYOOORRR',
      '..RROOYYYOOORR',
      '..RROOYYYYOORR',
      '..RROYYYYYOORR',
      '...RROYYYYORR',
      '....RROOOORR',
      '.....RRRRRR',
      ''
    ]
  },
  {
    id: 'smiley',
    name: 'Smiley',
    rows: [
      '.....YYYYYY',
      '...YYYYYYYYYY',
      '..YYYYYYYYYYYY',
      '.YYYYYYYYYYYYYY',
      '.YYY..YYYY..YYY',
      'YYYY..YYYY..YYYY',
      'YYYYYYYYYYYYYYYY',
      'YYYYYYYYYYYYYYYY',
      'YYYYYYYYYYYYYYYY',
      'YYY.YYYYYYYY.YYY',
      '.YYY.YYYYYY.YYY',
      '.YYYY......YYYY',
      '..YYYYYYYYYYYY',
      '...YYYYYYYYYY',
      '.....YYYYYY',
      ''
    ]
  }
];

export function parsePresetRows(rows: string[]): PixelColor[] {
  const result: PixelColor[] = [];
  for (let r = 0; r < 16; r++) {
    const row = (rows[r] || '').padEnd(16, '.');
    for (let c = 0; c < 16; c++) {
      result.push(PAL[row[c]] || null);
    }
  }
  return result;
}

export const PRESETS: Preset[] = RAW_PRESETS.map(p => ({
  ...p,
  px: parsePresetRows(p.rows),
}));

export const PRESET_MAP = Object.fromEntries(PRESETS.map(p => [p.id, p]));

export const SWATCHES = [
  '#f8fafc', '#94a3b8', '#475569', '#f43f5e',
  '#fb7185', '#f97316', '#f59e0b', '#facc15',
  '#a3e635', '#10b981', '#2dd4bf', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#d946ef', '#ec4899',
];

export const TEXT_COLORS = [
  { name: 'Neon Green', c: '#10b981' },
  { name: 'Amber Gold', c: '#f59e0b' },
  { name: 'Cyber Blue', c: '#06b6d4' },
  { name: 'Pure White', c: '#f8fafc' },
  { name: 'Hot Pink', c: '#f43f5e' },
];
