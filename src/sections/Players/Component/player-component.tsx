import { GetPlayerInfoDto } from "@/common/types/get-player-info.dto";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Match } from "@/modules/match/domain/Match";
import { User } from "@/types/User/User";
import CurrentTournament from "../Current-Tournament";
import PersonalInformation from "../Personal-Information";
import { Tournament } from "@/types/Tournament/Tournament";
import CompletedTournament from "../Completed-Tournament";
import { NextMatchDto } from "@/common/types/next-match.dto";
import { getInitials } from "@/common/helpers/helpers";
import MatchStatistics from "../Match-Statistics";
import { MatchSummaryDto } from "@/common/types/match-summary.dto";
import { SetSummaryDto } from "@/common/types/set-summary.dto";
import Image from "next/image";

export function PlayerComponent({
  player,
  currentUser,
  currentTournaments,
  allTournaments,
  setSummary,
  nextMatch,
  completedTournaments,
  matchSummary,
  matches,
  playerInfo,
}: {
  player: User;
  currentTournaments: any;
  matchSummary: MatchSummaryDto | undefined;
  nextMatch: NextMatchDto | undefined;
  setSummary: SetSummaryDto | undefined;
  completedTournaments: Tournament[];
  playerInfo: GetPlayerInfoDto;
  allTournaments: any;
  currentUser: string;
  matches: Match[];
}) {
  return (
    <div className="  text-gray-900 min-h-screen">
      <header className="py-8 px-4 md:px-8 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center space-x-6">
          <Image
            src={player?.photo}
            alt="Player Image"
            width={150}
            height={150}
            className="rounded-full w-[100px] h-[100px] object-cover"
          />
          <div className="space-y-2 mt-4 md:mt-0">
            <h1 className="text-4xl font-bold">
              {player?.name} {player?.lastname}
            </h1>
            <p className="text-muted-foreground text-center">
              {/* Edad: | Mejor Ranking: */}
            </p>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto py-8 px-4 md:px-8">
        <section className="grid md:grid-cols-2 gap-8">
          <PersonalInformation player={player} />
          <CurrentTournament
            nextMatch={nextMatch}
            playerInfo={playerInfo}
            currentTournaments={currentTournaments}
          />
        </section>
        <section className="mt-8">
          <CompletedTournament
            completedTournaments={completedTournaments}
            idPlayer={Number(player?.id)}
          />
        </section>
        <section className="mt-8">
          <MatchStatistics
            matchSummary={matchSummary}
            setSummary={setSummary}
          />
        </section>
        {/* <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <img
              alt="Gallery Image 1"
              className="rounded-lg object-cover w-full h-60"
              height={300}
              src="/placeholder.svg"
              style={{
                aspectRatio: "400/300",
                objectFit: "cover",
              }}
              width={400}
            />
            <img
              alt="Gallery Image 2"
              className="rounded-lg object-cover w-full h-60"
              height={300}
              src="/placeholder.svg"
              style={{
                aspectRatio: "400/300",
                objectFit: "cover",
              }}
              width={400}
            />
            <img
              alt="Gallery Image 3"
              className="rounded-lg object-cover w-full h-60"
              height={300}
              src="/placeholder.svg"
              style={{
                aspectRatio: "400/300",
                objectFit: "cover",
              }}
              width={400}
            />
            <img
              alt="Gallery Image 4"
              className="rounded-lg object-cover w-full h-60"
              height={300}
              src="/placeholder.svg"
              style={{
                aspectRatio: "400/300",
                objectFit: "cover",
              }}
              width={400}
            />
            <img
              alt="Gallery Image 5"
              className="rounded-lg object-cover w-full h-60"
              height={300}
              src="/placeholder.svg"
              style={{
                aspectRatio: "400/300",
                objectFit: "cover",
              }}
              width={400}
            />
            <img
              alt="Gallery Image 6"
              className="rounded-lg object-cover w-full h-60"
              height={300}
              src="/placeholder.svg"
              style={{
                aspectRatio: "400/300",
                objectFit: "cover",
              }}
              width={400}
            />
          </div>
        </section> */}
      </main>
    </div>
  );
}
