export enum NotaMusical {
    DO = 'C',
    RE = 'D',
    MI = 'E',
    FA = 'F',
    SOL = 'G',
    LA = 'A',
    SI = 'B',

    // Sustenidos
    DO_SUSTENIDO = 'C#',
    RE_SUSTENIDO = 'D#',
    FA_SUSTENIDO = 'F#',
    SOL_SUSTENIDO = 'G#',
    LA_SUSTENIDO = 'A#',
}

export const NOTE_FREQUENCIES: { [key in NotaMusical]: number } = {
  'C': 261.63,  // Dó
  'D': 293.66,  // Ré
  'E': 329.63,  // Mi
  'F': 349.23,  // Fá
  'G': 392.00,  // Sol
  'A': 440.00,  // Lá
  'B': 493.88,  // Si
  'C#': 277.18, // Dó#
  'D#': 311.13, // Ré#
  'F#': 369.99, // Fá#
  'G#': 415.30, // Sol#
  'A#': 466.16, // Lá#
};