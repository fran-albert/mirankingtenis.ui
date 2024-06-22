import { GetPlayerInfoDto } from "@/common/types/get-player-info.dto";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Match } from "@/modules/match/domain/Match";
import { User } from "@/modules/users/domain/User";
import CurrentTournament from "../Current-Tournament";
import PersonalInformation from "../Personal-Information";
import { Tournament } from "@/modules/tournament/domain/Tournament";
import CompletedTournament from "../Completed-Tournament";
import { NextMatchDto } from "@/common/types/next-match.dto";
import { getInitials } from "@/common/helpers/helpers";
import MatchStatistics from "../Match-Statistics";
import { MatchSummaryDto } from "@/common/types/match-summary.dto";
import { SetSummaryDto } from "@/common/types/set-summary.dto";

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
  player: User | null;
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
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <header className="py-8 px-4 md:px-8 flex items-center justify-center">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full w-16 h-16 bg-white flex items-center justify-center text-4xl font-bold">
              {getInitials(String(player?.name), String(player?.lastname))}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {player?.name} {player?.lastname}
              </h1>
              <p className="text-gray-900">Swiss, 41 years old</p>
            </div>
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
          <h2 className="text-2xl font-bold mb-4">Torneos Jugados</h2>
          <CompletedTournament completedTournaments={completedTournaments} />
        </section>
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Estadísticas Globales</h2>
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
