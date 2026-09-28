const FONT_SRC: Record<string, string> = {
  A: '0E,11,11,1F,11,11,11', B: '1E,11,11,1E,11,11,1E', C: '0E,11,10,10,10,11,0E', D: '1E,11,11,11,11,11,1E',
  E: '1F,10,10,1E,10,10,1F', F: '1F,10,10,1E,10,10,10', G: '0E,11,10,17,11,11,0F', H: '11,11,11,1F,11,11,11',
  I: '0E,04,04,04,04,04,0E', J: '07,02,02,02,02,12,0C', K: '11,12,14,18,14,12,11', L: '10,10,10,10,10,10,1F',
  M: '11,1B,15,15,11,11,11', N: '11,11,19,15,13,11,11', O: '0E,11,11,11,11,11,0E', P: '1E,11,11,1E,10,10,10',
  Q: '0E,11,11,11,15,12,0D', R: '1E,11,11,1E,14,12,11', S: '0F,10,10,0E,01,01,1E', T: '1F,04,04,04,04,04,04',
  U: '11,11,11,11,11,11,0E', V: '11,11,11,11,11,0A,04', W: '11,11,11,15,15,15,0A', X: '11,11,0A,04,0A,11,11',
  Y: '11,11,11,0A,04,04,04', Z: '1F,01,02,04,08,10,1F',
  '0': '0E,11,13,15,19,11,0E', '1': '04,0C,04,04,04,04,0E', '2': '0E,11,01,02,04,08,1F', '3': '1F,02,04,02,01,11,0E',
  '4': '02,06,0A,12,1F,02,02', '5': '1F,10,1E,01,01,11,0E', '6': '06,08,10,1E,11,11,0E', '7': '1F,01,02,04,08,08,08',
  '8': '0E,11,11,0E,11,11,0E', '9': '0E,11,11,0F,01,02,0C',
  '!': '04,04,04,04,04,00,04', '?': '0E,11,01,02,04,00,04', '.': '00,00,00,00,00,0C,0C', ',': '00,00,00,00,0C,04,08',
  ':': '00,0C,0C,00,0C,0C,00', '-': '00,00,00,1F,00,00,00', "'": '04,04,08,00,00,00,00', '+': '00,04,04,1F,04,04,00',
  '#': '0A,0A,1F,0A,1F,0A,0A', '/': '01,01,02,04,08,10,10', '@': '0E,11,17,15,17,10,0F', '&': '0C,12,14,08,15,12,0D',
  '(': '02,04,08,08,08,04,02', ')': '08,04,02,02,02,04,08', '=': '00,00,1F,00,1F,00,00', '*': '00,04,15,0E,15,04,00',
  '$': '04,0F,14,0E,05,1E,04', '%': '18,19,02,04,08,13,03', '<': '02,04,08,10,08,04,02', '>': '08,04,02,01,02,04,08',
  '_': '00,00,00,00,00,00,1F', '"': '0A,0A,0A,00,00,00,00', ';': '00,0C,0C,00,0C,04,08'
};

export const GLYPHS: Record<string, number[]> = {};

for (const k in FONT_SRC) {
  const rows = FONT_SRC[k].split(',').map(h => parseInt(h, 16));
  const cols: number[] = [];
  for (let x = 0; x < 5; x++) {
    let m = 0;
    for (let r = 0; r < 7; r++) {
      if ((rows[r] >> (4 - x)) & 1) m |= 1 << r;
    }
    cols.push(m);
  }
  GLYPHS[k] = cols;
}
GLYPHS[' '] = [0, 0, 0];

export function textCols(text: string): { cols: number[]; w: number } {
  const cols: number[] = [];
  const s = (text || '').toUpperCase();
  for (const ch of s) {
    const g = GLYPHS[ch] || GLYPHS['?'];
    cols.push(...g, 0);
  }
  if (cols.length) cols.pop();
  return { cols, w: cols.length };
}

export function validateText(text: string): { isValid: boolean; warning?: string } {
  if (!text) return { isValid: true };
  const upper = text.toUpperCase();
  const nonAscii = /[^\x20-\x7E]/.test(text);
  const unsupported = [...new Set([...upper].filter(ch => !GLYPHS[ch]))];

  if (nonAscii) {
    return {
      isValid: false,
      warning: "Non-ASCII characters (accents/emoji) aren't supported on the clock and will render as '?'."
    };
  }
  if (unsupported.length > 0) {
    return {
      isValid: false,
      warning: `Unsupported glyphs will render as '?': ${unsupported.join(' ')}`
    };
  }
  return { isValid: true };
}
