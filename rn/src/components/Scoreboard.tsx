import React from 'react';
import { View } from 'react-native';
import { useScoreboard } from '../hooks/useScoreboard';
import { TeamCell } from './TeamCell';
import { ScoreCell } from './ScoreCell';
import { ClockCell } from './ClockCell';
import { scoreboardStyles as styles } from '../styles/scoreboardStyles';

/**
 * Componente principal — replica el layout de #app (7-column grid → flexDirection row).
 *
 * Jerarquía visual preservada:
 *   [Home Logo+Name] [Home Score] [Clock + Period/Status] [Away Score] [Away Name+Logo]
 */
export function Scoreboard() {
  const { state, connected, clockDisplay, clockOvertime } = useScoreboard();

  if (!state) return null;

  return (
    <View style={[styles.container, !connected && styles.disconnected]}>
      <TeamCell name={state.homeTeam} logoUrl={state.homeLogoUrl} />
      <ScoreCell value={state.homeScore} />
      <ClockCell
        clockDisplay={clockDisplay}
        clockOvertime={clockOvertime}
        period={state.period}
        status={state.status}
      />
      <ScoreCell value={state.awayScore} />
      <TeamCell name={state.awayTeam} logoUrl={state.awayLogoUrl} away last />
    </View>
  );
}
