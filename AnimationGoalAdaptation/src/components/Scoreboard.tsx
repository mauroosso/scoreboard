import { Trophy } from "lucide-react";

interface Team {
  name: string;
  score: number;
  color: string;
  logo: string;
}

interface ScoreboardProps {
  homeTeam: Team;
  awayTeam: Team;
  time: string;
  period: string;
  onGoal: (team: 'home' | 'away') => void;
}

export default function Scoreboard({ homeTeam, awayTeam, time, period, onGoal }: ScoreboardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] p-8 font-sans" id="scoreboard-root">
      {/* Main Scoreboard Container */}
      <div className="w-full max-w-5xl bg-[#111] border border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-xl">
        
        {/* Header / Info Bar */}
        <div className="flex justify-between items-center px-8 py-3 bg-black/50 border-b border-white/5">
          <div className="flex items-center gap-2 text-[#00f2fe] font-bold uppercase tracking-[4px] text-xs">
            <Trophy size={14} />
            <span>STADIUM LIVE FEED</span>
          </div>
          <div className="text-white/30 font-mono text-xs tracking-widest">
            {time} • {period}
          </div>
        </div>

        {/* Score Display Area */}
        <div className="flex items-stretch h-56">
          {/* Home Team */}
          <div className="flex-1 flex items-center justify-end pr-10 gap-6 relative overflow-hidden">
            <div className="text-right z-10">
              <h2 className="text-4xl font-black uppercase text-white leading-none">{homeTeam.name}</h2>
              <p className="text-[#00f2fe] font-bold uppercase tracking-widest text-xs mt-2">Home</p>
            </div>
            <div className="w-24 h-24 bg-white/5 rounded-lg flex items-center justify-center p-3 z-10 border border-white/10">
              <img src={homeTeam.logo} alt={homeTeam.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="text-7xl font-black text-white z-10 tabular-nums">{homeTeam.score}</div>
          </div>

          {/* Center Divider */}
          <div className="w-px bg-white/10 my-8" />

          {/* Away Team */}
          <div className="flex-1 flex items-center justify-start pl-10 gap-6 relative overflow-hidden">
            <div className="text-7xl font-black text-white z-10 tabular-nums">{awayTeam.score}</div>
            <div className="w-24 h-24 bg-white/5 rounded-lg flex items-center justify-center p-3 z-10 border border-white/10">
              <img src={awayTeam.logo} alt={awayTeam.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="text-left z-10">
              <h2 className="text-4xl font-black uppercase text-white leading-none">{awayTeam.name}</h2>
              <p className="text-[#00f2fe] font-bold uppercase tracking-widest text-xs mt-2">Away</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="mt-12 flex gap-6">
        <button 
          onClick={() => onGoal('home')}
          className="px-10 py-4 bg-white text-[#050505] font-black uppercase italic hover:bg-[#00f2fe] transition-all rounded-sm shadow-xl -skew-x-12"
          id="btn-goal-home"
        >
          <span className="inline-block skew-x-12">Goal {homeTeam.name}</span>
        </button>
        <button 
          onClick={() => onGoal('away')}
          className="px-10 py-4 bg-white text-[#050505] font-black uppercase italic hover:bg-[#00f2fe] transition-all rounded-sm shadow-xl -skew-x-12"
          id="btn-goal-away"
        >
          <span className="inline-block skew-x-12">Goal {awayTeam.name}</span>
        </button>
      </div>
    </div>
  );
}
