export type PlayoffRound = 'RoundOf16' | 'QuarterFinals' | 'SemiFinals' | 'Finals';

export interface TournamentCategory {
    id: number;
    name: string;
    skipGroupStage?: boolean;
    startingPlayoffRound?: PlayoffRound;
}

export interface CreateTournamentCategoryRequest {
    tournamentId: number;
    categoryIds: number[];
    skipGroupStage?: boolean;
    startingPlayoffRound?: PlayoffRound;
}

export interface ManualBracketMatchup {
    positionInBracket: number;
    user1Id: number;
    user2Id: number;
}

export interface ManualBracketRequest {
    tournamentId: number;
    categoryId: number;
    startingRound: PlayoffRound;
    matches: ManualBracketMatchup[];
}
