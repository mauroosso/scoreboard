import { StyleSheet } from 'react-native';

/** Paleta del control panel (distinta al display scoreboard) */
export const controlColors = {
  navyDeep: '#080b24',
  surfaceCard: '#111640',
  surfaceInput: '#0a0e2a',
  text: '#ffffff',
  textSecondary: '#8892b8',
  textMuted: '#5c6590',
  accent: '#00e5ff',
  accentDim: 'rgba(0,229,255,0.12)',
  accentBorder: 'rgba(0,229,255,0.20)',
  danger: '#ff4c6b',
  dangerDim: 'rgba(255,76,107,0.12)',
  dangerBorder: 'rgba(255,76,107,0.25)',
  border: 'rgba(255,255,255,0.06)',
} as const;

const C = controlColors;

export const controlStyles = StyleSheet.create({
  // Root
  root: {
    flex: 1,
    backgroundColor: C.navyDeep,
  },
  rootContent: {
    padding: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerIcon: {
    width: 36,
    height: 36,
    backgroundColor: C.accentDim,
    borderWidth: 1,
    borderColor: C.accentBorder,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 18,
  },
  h1: {
    fontSize: 20,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.4,
  },
  h1Sub: {
    color: C.textSecondary,
    fontWeight: '500',
    fontSize: 13,
  },

  // Card
  card: {
    backgroundColor: C.surfaceCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.5,
  },

  // Section title
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  sectionTitleIndicator: {
    width: 3,
    height: 12,
    backgroundColor: C.accent,
    borderRadius: 2,
  },
  sectionTitleText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: C.textSecondary,
  },

  // Labels & inputs
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: C.textMuted,
    letterSpacing: 0.9,
    marginBottom: 6,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surfaceInput,
    color: C.text,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '500',
  },

  // Picker
  pickerWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surfaceInput,
    overflow: 'hidden',
  },
  picker: {
    color: C.text,
    height: 42,
  },

  // Layout
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  flex1: {
    flex: 1,
  },
  btnSpacer: {
    marginTop: 12,
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },

  // Buttons
  btn: {
    flexGrow: 1,
    flexBasis: '22%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surfaceInput,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  btnDanger: {
    backgroundColor: C.dangerDim,
    borderColor: C.dangerBorder,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  btnText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.textSecondary,
    letterSpacing: 0.2,
  },
  btnPrimaryText: {
    color: C.navyDeep,
    fontWeight: '800',
  },
  btnDangerText: {
    color: C.danger,
  },

  // State pre
  statePre: {
    backgroundColor: C.surfaceInput,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 14,
    maxHeight: 260,
    marginBottom: 12,
  },
  statePreText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: C.textSecondary,
    lineHeight: 18,
  },
});
