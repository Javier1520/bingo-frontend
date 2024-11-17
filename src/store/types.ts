export interface AuthState {
    user: string | null;
    token: string | null;
  }

  export interface GameState {
    bingoCard: number[][] | null;
    latestBall: string | null;
    isRegistered: boolean;
    gameFinished?: boolean;
    winner?: string | null;
  }
