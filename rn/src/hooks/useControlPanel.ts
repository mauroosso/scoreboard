import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { SERVER_URL } from '../config';
import type { MatchSnapshot, MatchStatus } from '../types';

/** Envía una acción POST al servidor y devuelve la respuesta */
async function sendAction(action: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${SERVER_URL}/api/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(action),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error ?? 'Error desconocido');
}

async function fetchState(): Promise<MatchSnapshot> {
  const res = await fetch(`${SERVER_URL}/api/state`);
  return res.json();
}

export function useControlPanel() {
  const [homeTeam, setHomeTeam] = useState('LOCAL');
  const [awayTeam, setAwayTeam] = useState('VISITA');
  const [homeLogoUrl, setHomeLogoUrl] = useState('');
  const [awayLogoUrl, setAwayLogoUrl] = useState('');
  const [homeScore, setHomeScore] = useState('0');
  const [awayScore, setAwayScore] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [period, setPeriod] = useState('1');
  const [status, setStatus] = useState<MatchStatus>('PRE');
  const [periodDuration, setPeriodDuration] = useState('15');
  const [stateJson, setStateJson] = useState('Cargando...');

  const loadState = useCallback(async () => {
    try {
      const data = await fetchState();
      setStateJson(JSON.stringify(data, null, 2));
      setHomeTeam(data.homeTeam);
      setAwayTeam(data.awayTeam);
      setHomeLogoUrl(data.homeLogoUrl || '');
      setAwayLogoUrl(data.awayLogoUrl || '');
      setHomeScore(String(data.homeScore));
      setAwayScore(String(data.awayScore));
      setPeriod(String(data.period));
      setStatus(data.status as MatchStatus);
      setPeriodDuration(String(Math.round(data.clock.periodDurationMs / 60000)));
      const totalSec = Math.floor(data.clock.elapsedMs / 1000);
      setMinutes(String(Math.floor(totalSec / 60)));
      setSeconds(String(totalSec % 60));
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const act = useCallback(
    async (action: Record<string, unknown>) => {
      try {
        await sendAction(action);
        await loadState();
      } catch (e: any) {
        Alert.alert('Error', e.message);
      }
    },
    [loadState],
  );

  return {
    // Fields
    homeTeam, setHomeTeam,
    awayTeam, setAwayTeam,
    homeLogoUrl, setHomeLogoUrl,
    awayLogoUrl, setAwayLogoUrl,
    homeScore, setHomeScore,
    awayScore, setAwayScore,
    minutes, setMinutes,
    seconds, setSeconds,
    period, setPeriod,
    status, setStatus,
    periodDuration, setPeriodDuration,
    stateJson,
    // Actions
    act,
    loadState,
  };
}
