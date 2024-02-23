export interface Ranking {
  id: number;
  points: number;
  wonMatches: number;
  lostMatches: number;
  playedMatches: number;
  user: {
    name: string;
    lastname: string;
    photo: string;
  };
}
