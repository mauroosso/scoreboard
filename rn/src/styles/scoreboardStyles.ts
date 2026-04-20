import { StyleSheet } from 'react-native';
import { colors, layout } from '../theme';

export const scoreboardStyles = StyleSheet.create({
  container: {
    width: layout.width,
    height: layout.height,
    backgroundColor: colors.gradientTop,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  disconnected: {
    borderWidth: 2,
    borderColor: colors.danger,
  },
});

export const teamCellStyles = StyleSheet.create({
  cell: {
    flex: 2.2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  homeCell: {
    justifyContent: 'flex-start',
  },
  awayCell: {
    justifyContent: 'flex-end',
  },
  noBorder: {
    borderRightWidth: 0,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.4,
    flexShrink: 1,
  },
});

const logoSize = layout.logoSize;

export const teamLogoStyles = StyleSheet.create({
  container: {
    width: logoSize,
    height: logoSize,
    borderRadius: logoSize / 2,
    backgroundColor: colors.logoBg,
    borderWidth: 1,
    borderColor: colors.logoBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: logoSize,
    height: logoSize,
  },
  placeholder: {
    fontSize: 14,
    color: colors.logoPlaceholder,
    fontWeight: '800',
  },
});

export const scoreCellStyles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  score: {
    fontSize: 58,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 58,
  },
});

export const clockCellStyles = StyleSheet.create({
  cell: {
    flex: 2.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  clock: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 48,
    letterSpacing: 1.4,
  },
  clockOvertime: {
    color: colors.clockOvertime,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.badgeBorder,
    backgroundColor: colors.badgeBg,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 5,
  },
  badgeText: {
    color: colors.muted,
    fontWeight: '700',
    fontSize: 12,
  },
});
