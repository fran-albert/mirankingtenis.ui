import {
  TeamEventMatch,
  MatchResultRequest,
  LoadMatchScoreRequest,
} from "@/types/Team-Event/TeamEvent";
import {
  TeamEventMatchScoreFormat,
  TeamEventMatchType,
} from "@/common/enum/team-event.enum";

type ScoreShape = Pick<
  TeamEventMatch,
  | "matchType"
  | "scoreFormat"
  | "homeGames"
  | "awayGames"
  | "hasTiebreak"
  | "homeTiebreakScore"
  | "awayTiebreakScore"
  | "homeSet1Games"
  | "awaySet1Games"
  | "homeSet2Games"
  | "awaySet2Games"
  | "hasSuperTiebreak"
  | "homeSuperTiebreakScore"
  | "awaySuperTiebreakScore"
>;

type ScoreRequestShape =
  | ({
      matchType: TeamEventMatchType;
      scoreFormat?: TeamEventMatchScoreFormat;
    } & MatchResultRequest)
  | ({
      matchType: TeamEventMatchType;
      scoreFormat?: TeamEventMatchScoreFormat;
    } & LoadMatchScoreRequest);

export function isSetsDoublesMatch(match: {
  matchType: TeamEventMatchType;
  scoreFormat?: TeamEventMatchScoreFormat | null;
}): boolean {
  return (
    match.matchType === TeamEventMatchType.doubles &&
    match.scoreFormat === TeamEventMatchScoreFormat.setsSuperTiebreak
  );
}

export function formatMatchScore(match: ScoreShape): string {
  if (isSetsDoublesMatch(match)) {
    const parts = [
      `${match.homeSet1Games ?? "-"}-${match.awaySet1Games ?? "-"}`,
      `${match.homeSet2Games ?? "-"}-${match.awaySet2Games ?? "-"}`,
    ];

    if (match.hasSuperTiebreak) {
      parts.push(
        `ST ${match.homeSuperTiebreakScore ?? "-"}-${match.awaySuperTiebreakScore ?? "-"}`,
      );
    }

    return parts.join(", ");
  }

  const base = `${match.homeGames}-${match.awayGames}`;
  if (match.hasTiebreak) {
    return `${base} (${match.homeTiebreakScore}-${match.awayTiebreakScore})`;
  }
  return base;
}

export function buildScoreRequest(
  matchType: TeamEventMatchType,
  input: {
    homeGames: string;
    awayGames: string;
    hasTiebreak: boolean;
    homeTiebreakScore: string;
    awayTiebreakScore: string;
    homeSet1Games: string;
    awaySet1Games: string;
    homeSet2Games: string;
    awaySet2Games: string;
    hasSuperTiebreak: boolean;
    homeSuperTiebreakScore: string;
    awaySuperTiebreakScore: string;
  },
): ScoreRequestShape {
  if (matchType === TeamEventMatchType.doubles) {
    const homeSet1Games = Number(input.homeSet1Games);
    const awaySet1Games = Number(input.awaySet1Games);
    const homeSet2Games = Number(input.homeSet2Games);
    const awaySet2Games = Number(input.awaySet2Games);

    return {
      matchType,
      scoreFormat: TeamEventMatchScoreFormat.setsSuperTiebreak,
      homeGames: homeSet1Games + homeSet2Games,
      awayGames: awaySet1Games + awaySet2Games,
      homeSet1Games,
      awaySet1Games,
      homeSet2Games,
      awaySet2Games,
      hasSuperTiebreak: input.hasSuperTiebreak || undefined,
      homeSuperTiebreakScore: input.hasSuperTiebreak
        ? Number(input.homeSuperTiebreakScore)
        : undefined,
      awaySuperTiebreakScore: input.hasSuperTiebreak
        ? Number(input.awaySuperTiebreakScore)
        : undefined,
    };
  }

  return {
    matchType,
    scoreFormat: TeamEventMatchScoreFormat.legacyGames,
    homeGames: Number(input.homeGames),
    awayGames: Number(input.awayGames),
    hasTiebreak: input.hasTiebreak || undefined,
    homeTiebreakScore: input.hasTiebreak
      ? Number(input.homeTiebreakScore)
      : undefined,
    awayTiebreakScore: input.hasTiebreak
      ? Number(input.awayTiebreakScore)
      : undefined,
  };
}
