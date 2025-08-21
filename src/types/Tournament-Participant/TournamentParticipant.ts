
export interface TournamentParticipant {
    id: number;
    name: string;
    lastname: string;
    signupDate: Date;
    isActive: boolean;
    idPlayer: number;
    position?: number;
}
