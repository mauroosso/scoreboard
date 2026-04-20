import React from 'react';
import { View, Text } from 'react-native';
import { TeamLogo } from './TeamLogo';
import { teamCellStyles as styles } from '../styles/scoreboardStyles';

interface Props {
  name: string;
  logoUrl: string;
  /** true para el equipo visitante (logo a la derecha) */
  away?: boolean;
  /** Ocultar borde derecho en la última celda */
  last?: boolean;
}

/** Equivale a <div class="cell team"> / <div class="cell team away"> */
export function TeamCell({ name, logoUrl, away, last }: Props) {
  return (
    <View
      style={[
        styles.cell,
        away ? styles.awayCell : styles.homeCell,
        last && styles.noBorder,
      ]}
    >
      {!away && <TeamLogo url={logoUrl} />}
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>
      {away && <TeamLogo url={logoUrl} />}
    </View>
  );
}
