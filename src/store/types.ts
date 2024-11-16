export interface AuthState {
    user: string | null;
    token: string | null;
  }

  export interface GameState {
    bingoCard: number[][] | null;
    latestBall: number | null;
    isRegistered: boolean;
  }
