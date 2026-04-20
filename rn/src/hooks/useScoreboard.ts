import { useEffect, useRef, useState, useCallback } from 'react';
import type { MatchSnapshot } from '../types';

import { SERVER_URL } from '../config';

/**
 * Hook que replica la lógica de scoreboard.js:
 * - fetch inicial de /api/state
 * - conexión WebSocket con reconexión automática
 * - cálculo del reloj interpolado con requestAnimationFrame
 */
export function useScoreboard() {
  const [state, setState] = useState<MatchSnapshot | null>(null);
  const [connected, setConnected] = useState(false);
  const [clockDisplay, setClockDisplay] = useState('00:00');
  const [clockOvertime, setClockOvertime] = useState(false);

  const stateRef = useRef<MatchSnapshot | null>(null);
  const clientBasePerfRef = useRef(performance.now());
  const rafRef = useRef<number | null>(null);

  // --- Reloj interpolado (equivale a getVisibleElapsedMs + renderClock) ---

  const getVisibleElapsedMs = useCallback((): number => {
    const s = stateRef.current;
    if (!s) return 0;
    const { clock, serverNow } = s;
    if (!clock.isRunning || !clock.lastStartServerTs) return clock.elapsedMs;

    const elapsedClient = performance.now() - clientBasePerfRef.current;
    const approxServerNow = serverNow + elapsedClient;
    return clock.elapsedMs + Math.max(0, approxServerNow - clock.lastStartServerTs);
  }, []);

  const formatClock = (ms: number): string => {
    const safe = Math.max(0, Math.floor(ms));
    const totalSeconds = Math.floor(safe / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const tickClock = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const visible = getVisibleElapsedMs();
    setClockDisplay(formatClock(visible));
    setClockOvertime(
      s.clock.periodDurationMs > 0 && visible >= s.clock.periodDurationMs,
    );
    rafRef.current = requestAnimationFrame(tickClock);
  }, [getVisibleElapsedMs]);

  const applySnapshot = useCallback(
    (snapshot: MatchSnapshot) => {
      stateRef.current = snapshot;
      clientBasePerfRef.current = performance.now();
      setState(snapshot);

      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tickClock);
    },
    [tickClock],
  );

  // --- Bootstrap (fetch /api/state) ---
  useEffect(() => {
    fetch(`${SERVER_URL}/api/state`)
      .then((r) => r.json())
      .then((data: MatchSnapshot) => applySnapshot(data))
      .catch(console.error);
  }, [applySnapshot]);

  // --- WebSocket con reconexión ---
  useEffect(() => {
    let socket: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    function connect() {
      const wsUrl = SERVER_URL.replace(/^http/, 'ws');
      socket = new WebSocket(wsUrl);

      socket.onopen = () => setConnected(true);
      socket.onclose = () => {
        setConnected(false);
        reconnectTimeout = setTimeout(connect, 1500);
      };
      socket.onerror = () => setConnected(false);
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string);
          if (message.type === 'MATCH_STATE' || message.payload?.clock) {
            applySnapshot(message.payload);
          }
        } catch (err) {
          console.error('Invalid socket message', err);
        }
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      socket?.close();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [applySnapshot]);

  return { state, connected, clockDisplay, clockOvertime };
}
