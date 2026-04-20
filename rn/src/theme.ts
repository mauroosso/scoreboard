/** Constantes que reemplazan las CSS variables de :root */
export const colors = {
  bg: '#0a0f16',
  surface: '#111927',
  gradientTop: '#0f1724',
  gradientBottom: '#09101a',
  text: '#f5f7fb',
  muted: '#b5bfd1',
  accent: '#00a3ff',
  accent2: '#a4e24e',
  danger: '#ff5b5b',
  clockOvertime: '#ff9c9c',
  border: 'rgba(255,255,255,0.1)',
  logoBg: 'rgba(255,255,255,0.06)',
  logoBorder: 'rgba(255,255,255,0.12)',
  badgeBg: 'rgba(255,255,255,0.06)',
  badgeBorder: 'rgba(255,255,255,0.12)',
  logoPlaceholder: '#8b98b3',
} as const;

export const layout = {
  width: 768,
  height: 128,
  logoSize: 64,
} as const;

export const statusColors: Record<string, string> = {
  live: colors.accent2,
  paused: '#ffd76b',
  pre: colors.muted,
  break: colors.muted,
  ended: colors.danger,
};

export const periodLabel = 'Q';
