import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService } from '../services/GameService';
import { gameState$ } from '../store/Observables';
import BingoCard from '../components/BingoCard';

export const Room = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(gameState$.value);
  const hasReceivedBalls = useRef(false);

  useEffect(() => {
    const subscription = gameState$.subscribe((state) => {
      setGameState(state);

      // If we receive a valid ball
      if (state.latestBall) {
        hasReceivedBalls.current = true;
      }
      // If we had balls before but now we don't, game is finished
      else if (hasReceivedBalls.current) {
        hasReceivedBalls.current = false; // Reset the flag
        alert('Game finished!');
        gameState$.next({
          bingoCard: null,
          latestBall: null,
          isRegistered: false
        });
        navigate('/home');
      }
    });

    const pollingInterval = gameService.startBallPolling();

    return () => {
      subscription.unsubscribe();
      clearInterval(pollingInterval);
    };
  }, [navigate]);

  const convertCardToObject = (
    card: number[][] | { [key: string]: (number | null)[] } | null
  ): { [key: string]: (number | null)[] } | null => {
    if (!card) return null;

    if (typeof card === 'object' && !Array.isArray(card)) {
      return card as { [key: string]: (number | null)[] };
    }

    const columns = ['B', 'I', 'N', 'G', 'O'];
    const cardObject: { [key: string]: (number | null)[] } = {};

    (card as number[][]).forEach((column, index) => {
      cardObject[columns[index]] = column;
    });

    return cardObject;
  };

  const bingoCard = convertCardToObject(gameState.bingoCard);

  const handleClaimWin = async () => {
    try {
      await gameService.claimWin();
      alert('Congratulations, you won!');
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert('You are not registered in the game.');
      } else if (error.response?.status === 403) {
        alert('You are disqualified.');
      } else {
        alert('An unexpected error occurred.');
      }
    } finally {
      navigate('/home');
    }
  };

  return (
    <div>
      <h1>Bingo Game</h1>
      {gameState.latestBall && <h2>Latest Ball: {gameState.latestBall}</h2>}
      <BingoCard bingoCard={bingoCard} />
      <button onClick={handleClaimWin}>Claim Win</button>
    </div>
  );
};

export default Room;