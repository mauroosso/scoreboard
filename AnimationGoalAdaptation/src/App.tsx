/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from "react";
import Scoreboard from "./components/Scoreboard";
import GoalOverlay from "./components/GoalOverlay";

interface Player {
  name: string;
  photo: string;
}

const PLAYERS: Record<string, Player[]> = {
  home: [
    { name: "Lionel Messi", photo: "https://picsum.photos/seed/messi/400/400" },
    { name: "Julian Alvarez", photo: "https://picsum.photos/seed/alvarez/400/400" },
  ],
  away: [
    { name: "Kylian Mbappé", photo: "https://picsum.photos/seed/mbappe/400/400" },
    { name: "Antoine Griezmann", photo: "https://picsum.photos/seed/griezmann/400/400" },
  ]
};

export default function App() {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [overlayState, setOverlayState] = useState<{
    visible: boolean;
    playerName?: string;
    playerPhoto?: string;
    teamColor?: string;
  }>({
    visible: false,
  });

  const handleGoal = useCallback((team: 'home' | 'away') => {
    // Update score
    if (team === 'home') setHomeScore(s => s + 1);
    else setAwayScore(s => s + 1);

    // Pick a random player from the team
    const players = PLAYERS[team];
    const randomPlayer = players[Math.floor(Math.random() * players.length)];

    // Trigger overlay
    setOverlayState({
      visible: true,
      playerName: randomPlayer.name,
      playerPhoto: randomPlayer.photo,
      teamColor: team === 'home' ? "#0072ff" : "#00f2fe", // Blue vs Cyan
    });
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlayState(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Scoreboard
        homeTeam={{
          name: "Argentina",
          score: homeScore,
          color: "#0072ff",
          logo: "https://picsum.photos/seed/arg/200/200"
        }}
        awayTeam={{
          name: "France",
          score: awayScore,
          color: "#00f2fe",
          logo: "https://picsum.photos/seed/fra/200/200"
        }}
        time="84:22"
        period="2nd Half"
        onGoal={handleGoal}
      />

      <GoalOverlay
        isVisible={overlayState.visible}
        playerName={overlayState.playerName}
        playerPhoto={overlayState.playerPhoto}
        teamColor={overlayState.teamColor}
        onComplete={closeOverlay}
      />
    </div>
  );
}

