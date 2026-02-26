"use client";
import React from "react";
import { TeamEventSeries } from "@/types/Team-Event/TeamEvent";
import { TeamEventSeriesStatus } from "@/common/enum/team-event.enum";
import { Check, Trophy } from "lucide-react";

interface BracketViewProps {
  series: TeamEventSeries[];
}

interface BracketMatchProps {
  series: TeamEventSeries;
}

const BracketMatch: React.FC<BracketMatchProps> = ({ series }) => {
  const homeWinner = series.winnerId === series.homeTeamId;
  const awayWinner = series.winnerId === series.awayTeamId;

  return (
    <div className="relative flex flex-col w-48 sm:w-56 bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
      {/* Home Team */}
      <div className={`flex items-center justify-between p-3 border-b border-white/10 ${homeWinner ? 'bg-tennis-accent/10' : ''}`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className={`text-xs font-bold truncate ${homeWinner ? 'text-tennis-accent' : 'text-gray-300'}`}>
            {series.homeTeam?.name || "TBD"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {homeWinner && <Check className="w-3 h-3 text-tennis-accent" />}
          <span className={`text-sm font-mono font-bold ${homeWinner ? 'text-tennis-accent' : 'text-gray-500'}`}>
             {series.homeMatchesWon}
          </span>
        </div>
      </div>

      {/* Away Team */}
      <div className={`flex items-center justify-between p-3 ${awayWinner ? 'bg-tennis-accent/10' : ''}`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className={`text-xs font-bold truncate ${awayWinner ? 'text-tennis-accent' : 'text-gray-300'}`}>
            {series.awayTeam?.name || "TBD"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {awayWinner && <Check className="w-3 h-3 text-tennis-accent" />}
          <span className={`text-sm font-mono font-bold ${awayWinner ? 'text-tennis-accent' : 'text-gray-500'}`}>
             {series.awayMatchesWon}
          </span>
        </div>
      </div>
    </div>
  );
};

export const BracketView: React.FC<BracketViewProps> = ({ series }) => {
  const finalPhaseSeries = series.filter(s => s.phase === 'final');
  
  const rounds: Record<number, TeamEventSeries[]> = {};
  finalPhaseSeries.forEach(s => {
    if (!rounds[s.roundNumber]) rounds[s.roundNumber] = [];
    rounds[s.roundNumber].push(s);
  });

  const sortedRounds = Object.keys(rounds)
    .map(Number)
    .sort((a, b) => b - a);

  const getRoundName = (count: number) => {
    if (count === 1) return "Final";
    if (count === 2) return "Semis";
    if (count === 4) return "Cuartos";
    if (count === 8) return "Octavos";
    return `Ronda ${count}`;
  };

  if (finalPhaseSeries.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
         <Trophy className="w-12 h-12 text-white/5 mx-auto mb-4" />
         <p className="text-gray-500 text-sm italic font-medium">No hay series de fase final generadas aún.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-center gap-1 bg-white/5 p-1 rounded-lg w-fit mx-auto">
        {sortedRounds.map((r, idx) => (
          <button 
            key={r}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${
              idx === sortedRounds.length - 1 ? 'bg-tennis-accent text-black shadow-lg shadow-tennis-accent/20' : 'text-gray-500 hover:text-white'
            }`}
          >
            {getRoundName(rounds[r].length)}
          </button>
        ))}
      </div>

      <div className="relative overflow-x-auto pb-8 no-scrollbar">
        <div className="flex items-center gap-12 min-w-max px-4">
          {sortedRounds.reverse().map((roundKey, roundIdx) => (
            <div key={roundKey} className="flex flex-col justify-around gap-8 py-4">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-center mb-4">
                {getRoundName(rounds[roundKey].length)}
              </h4>
              <div className="flex flex-col gap-16">
                {rounds[roundKey].map((s) => (
                  <div key={s.id} className="relative flex items-center">
                    <BracketMatch series={s} />
                    {roundIdx < sortedRounds.length - 1 && (
                      <div className="absolute left-full w-12 h-full flex items-center">
                        <div className="w-full h-px bg-white/10" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
