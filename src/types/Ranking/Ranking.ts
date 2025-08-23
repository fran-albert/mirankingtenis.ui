export interface Ranking {
  id: number;
  points: number;
  wonMatches: number;
  lostMatches: number;
  playedMatches: number;
  isActive: boolean;
  position: number;
  user: {
    name: string;
    lastname: string;
    photo: string;
    id: number
  };
}
