import React from 'react';
import { View, Text } from 'react-native';
import { colors, statusColors, periodLabel } from '../theme';
import { clockCellStyles as styles } from '../styles/scoreboardStyles';

interface Props {
  clockDisplay: string;
  clockOvertime: boolean;
  period: number;
  status: string;
}

/** Equivale a <div id="clock-container" class="cell center"> */
export function ClockCell({ clockDisplay, clockOvertime, period, status }: Props) {
  const statusKey = status.toLowerCase();
  const statusColor = statusColors[statusKey] ?? colors.muted;

  return (
    <View style={styles.cell}>
      <Text style={[styles.clock, clockOvertime && styles.clockOvertime]}>
        {clockDisplay}
      </Text>
      <View style={styles.meta}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{`${periodLabel}${period}`}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={[styles.badgeText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>
    </View>
  );
}
