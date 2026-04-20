export interface ClockState {
  isRunning: boolean;
  elapsedMs: number;
  lastStartServerTs: number | null;
  periodDurationMs: number;
}

export interface MatchSnapshot {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeLogoUrl: string;
  awayLogoUrl: string;
  period: number;
  status: string;
  clock: ClockState;
  updatedAt: number;
  serverNow: number;
}

export type MatchStatus = 'PRE' | 'LIVE' | 'PAUSED' | 'BREAK' | 'ENDED';
