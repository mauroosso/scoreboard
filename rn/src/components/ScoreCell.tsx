import React from 'react';
import { View, Text } from 'react-native';
import { scoreCellStyles as styles } from '../styles/scoreboardStyles';

interface Props {
  value: number;
}

/** Equivale a <div class="cell"><div class="score">0</div></div> */
export function ScoreCell({ value }: Props) {
  return (
    <View style={styles.cell}>
      <Text style={styles.score}>{String(value)}</Text>
    </View>
  );
}
