"use client";
import { TeamEventSeries, TeamEventTeam } from "@/types/Team-Event/TeamEvent";
import { TeamEventSeriesPhase } from "@/common/enum/team-event.enum";
import { SeriesCard } from "./SeriesCard";

interface FixtureViewProps {
  series: TeamEventSeries[];
  teams?: TeamEventTeam[];
  onSeriesClick?: (series: TeamEventSeries) => void;
  onDeleteSeries?: (seriesId: number) => void;
}

export function FixtureView({ series, teams, onSeriesClick, onDeleteSeries }: FixtureViewProps) {
  if (series.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        El fixture aún no fue generado.
      </p>
    );
  }

  const regularSeries = series.filter(
    (s) => s.phase === TeamEventSeriesPhase.regular
  );
  const finalSeries = series.filter(
    (s) => s.phase === TeamEventSeriesPhase.final
  );

  const rounds = new Map<number, TeamEventSeries[]>();
  for (const s of regularSeries) {
    const key = s.roundNumber;
    if (!rounds.has(key)) rounds.set(key, []);
    rounds.get(key)!.push(s);
  }

  const matchdays = (seriesList: TeamEventSeries[]) => {
    const grouped = new Map<number, TeamEventSeries[]>();
    for (const s of seriesList) {
      if (!grouped.has(s.matchday)) grouped.set(s.matchday, []);
      grouped.get(s.matchday)!.push(s);
    }
    return [...grouped.entries()].sort(([a], [b]) => a - b);
  };

  const getFreeTeams = (mdSeries: TeamEventSeries[]): string[] => {
    if (!teams || teams.length === 0) return [];
    const usedIds = new Set<number>();
    for (const s of mdSeries) {
      if (s.homeTeamId != null) {
        usedIds.add(s.homeTeamId);
      }
      if (s.awayTeamId != null) {
        usedIds.add(s.awayTeamId);
      }
    }
    return teams
      .filter((t) => !usedIds.has(t.id))
      .map((t) => t.name);
  };

  const playoffRounds = new Map<number, TeamEventSeries[]>();
  for (const s of finalSeries) {
    const key = s.roundNumber;
    if (!playoffRounds.has(key)) playoffRounds.set(key, []);
    playoffRounds.get(key)!.push(s);
  }

  const getPlayoffRoundLabel = (seriesList: TeamEventSeries[]): string => {
    if (seriesList.length === 1) return "Final";
    if (seriesList.length === 2) return "Semifinales";
    if (seriesList.length === 4) return "Cuartos de Final";
    return "Playoffs";
  };

  return (
    <div className="space-y-8">
      {[...rounds.entries()]
        .sort(([a], [b]) => a - b)
        .map(([roundNum, roundSeries]) => (
          <div key={roundNum}>
            <h3 className="text-lg font-semibold mb-4">
              {roundNum === 1 ? "Ida" : "Vuelta"}
            </h3>
            <div className="space-y-6">
              {matchdays(roundSeries).map(([matchday, mdSeries]) => (
                <div key={matchday}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Jornada {matchday}
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {mdSeries.map((s) => (
                      <SeriesCard
                        key={s.id}
                        series={s}
                        onClick={
                          onSeriesClick ? () => onSeriesClick(s) : undefined
                        }
                        onDelete={onDeleteSeries}
                      />
                    ))}
                  </div>
                  {(() => {
                    const free = getFreeTeams(mdSeries);
                    if (free.length === 0) return null;
                    return (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        Libre: {free.join(", ")}
                      </p>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        ))}

      {finalSeries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Playoffs</h3>
          <div className="space-y-6">
            {[...playoffRounds.entries()]
              .sort(([a], [b]) => a - b)
              .map(([, roundSeries]) => (
                <div key={roundSeries[0].roundNumber}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    {getPlayoffRoundLabel(roundSeries)}
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[...roundSeries]
                      .sort(
                        (a, b) =>
                          (a.positionInBracket ?? 0) - (b.positionInBracket ?? 0),
                      )
                      .map((s) => (
                        <SeriesCard
                          key={s.id}
                          series={s}
                          onClick={
                            onSeriesClick ? () => onSeriesClick(s) : undefined
                          }
                          onDelete={onDeleteSeries}
                        />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
