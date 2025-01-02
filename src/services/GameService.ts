import { gameState$ } from '../store/Observables';
import { registerToGame, getBingoCard, claimWin, connectToGame } from './api';

class GameService {
    async registerToGame() {
      try {
        await registerToGame();
        const cardResponse = await getBingoCard();
        gameState$.next({
          ...gameState$.value,
          bingoCard: cardResponse.data.card,
          isRegistered: true,
          gameFinished: false,
          winner: null
        });
      } catch (error) {
        console.error('Failed to register to game:', error);
        throw error;
      }
    }

    async claimWin() {
      try {
        await claimWin();
        gameState$.next({
          bingoCard: null,
          latestBall: null,
          totalPlayers: 0,
          isRegistered: false,
          gameFinished: false,
          winner: null
        });
      } catch (error) {
        console.error('Failed to claim win:', error);
        throw error;
      }
    }

    async startBallPolling() {
        connectToGame();
      }
  }

  export const gameService = new GameService();