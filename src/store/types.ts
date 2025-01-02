export interface AuthState {
    user: string | null;
    token: string | null;
  }

export interface BingoCardInterface {
  B: (number)[];
  I: (number)[];
  N: (number | null)[];
  G: (number)[];
  O: (number)[];
}

export interface GameState {
  bingoCard: BingoCardInterface | null;
  latestBall: string | null;
  totalPlayers: number;
  isRegistered: boolean;
  gameFinished: boolean;
  winner?: string | null;
}
