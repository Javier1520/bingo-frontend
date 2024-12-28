import { gameState$ } from '../store/Observables';
import { api, registerToGame, getBingoCard, claimWin } from './api';

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
          isRegistered: false,
          gameFinished: false,
          winner: null
        });
      } catch (error) {
        console.error('Failed to claim win:', error);
        throw error;
      }
    }

    startBallPolling() {
        return setInterval(async () => {
          try {
            const response = await api.get('/latest-ball');

            gameState$.next({
              ...gameState$.value,
              latestBall: response.data.latest_ball || null
            });
          } catch (error) {
            console.error('Failed to get latest ball:', error);
          }
        }, 5002);
      }
  }

  export const gameService = new GameService();