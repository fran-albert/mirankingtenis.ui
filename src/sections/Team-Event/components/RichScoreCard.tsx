"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface PlayerInfo {
  name?: string;
  lastname: string;
  seed?: number;
  flag?: string;
  image?: string;
}

interface RichScoreCardProps {
  status: "LIVE" | "PRÓXIMO" | "FINALIZADO";
  matchInfo: string; 
  player1: PlayerInfo;
  player2: PlayerInfo;
  score1: number[];
  score2: number[];
  isLive?: boolean;
  time?: string;
}

export const RichScoreCard: React.FC<RichScoreCardProps> = ({
  status,
  matchInfo,
  player1,
  player2,
  score1,
  score2,
  isLive,
  time,
}) => {
  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-tennis-card to-tennis-dark text-white p-4 shadow-xl min-h-[180px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {status === "LIVE" && (
            <Badge variant="destructive" className="bg-tennis-live text-[10px] font-bold px-2 py-0 animate-pulse">
              LIVE
            </Badge>
          )}
          {status === "PRÓXIMO" && (
             <Badge variant="outline" className="border-tennis-accent text-tennis-accent text-[10px] font-bold px-2 py-0">
                PRÓXIMO: {time}
             </Badge>
          )}
          <span className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">
            {matchInfo}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
               {player1.flag && <span className="text-lg">{player1.flag}</span>}
               <span className="font-bold text-sm sm:text-base">
                 {player1.lastname} {player1.seed && <span className="text-tennis-accent text-xs">({player1.seed})</span>}
               </span>
            </div>
            <div className="flex gap-2">
              {score1.map((s, i) => (
                <span key={i} className={`w-6 text-center text-sm font-bold ${i === score1.length - 1 ? 'text-white' : 'text-gray-500'}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
               {player2.flag && <span className="text-lg">{player2.flag}</span>}
               <span className="font-bold text-sm sm:text-base">
                 {player2.lastname} {player2.seed && <span className="text-tennis-accent text-xs">({player2.seed})</span>}
               </span>
            </div>
            <div className="flex gap-2">
              {score2.map((s, i) => (
                <span key={i} className={`w-6 text-center text-sm font-bold ${i === score2.length - 1 ? 'text-white' : 'text-gray-500'}`}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:block w-32 h-32 relative opacity-80 pointer-events-none">
           <div className="w-full h-full bg-gray-800/20 rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
               {player1.image ? (
                 <Image src={player1.image} alt={player1.lastname} layout="fill" objectFit="cover" />
               ) : (
                 <span className="text-4xl">🎾</span>
               )}
           </div>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-center">
         <span className="text-[10px] text-tennis-live font-bold tracking-[0.2em] uppercase">
            {status === "LIVE" ? "EN VIVO" : ""}
         </span>
      </div>
    </Card>
  );
};
