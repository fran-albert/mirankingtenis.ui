export enum DoublesEventStatus {
  draft = 'draft',
  active = 'active',
  finished = 'finished',
}

export enum DoublesMatchStatus {
  pending = 'pending',
  played = 'played',
  cancelled = 'cancelled',
}

export enum DoublesMatchPhase {
  zone = 'zone',
  playoff = 'playoff',
}

export enum DoublesPlayoffRound {
  roundOf32 = 'roundOf32',
  roundOf16 = 'roundOf16',
  quarterFinals = 'quarterFinals',
  semiFinals = 'semiFinals',
  final = 'final',
  thirdPlace = 'thirdPlace',
}
