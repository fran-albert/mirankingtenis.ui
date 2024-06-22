export interface GroupRankingDto {
    groupId: number;
    groupName: string;
    rankings: ParticipantRankingDto[];
}

export interface ParticipantRankingDto {
    userId: number;
    userName: string;
    points: number;
    wonMatches: number;
    lostMatches: number;
    playedMatches: number;
    position: number;
}


export interface GroupDto {
    id: number;
    name: string;
    groupStageId: number;
    participants: ParticipantDto[];
}

export interface ParticipantDto {
    id: number;
    userId: number;
    userName: string;
    userLastName: string;
}
