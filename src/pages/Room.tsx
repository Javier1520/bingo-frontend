import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameService } from "../services/GameService";
import { gameState$ } from "../store/Observables";
import BingoCard from "../components/BingoCard";

export const Room = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(gameState$.value);
  const [ballCalls, setBallCalls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(30);
  const [waitingCountdown, setWaitingCountdown] = useState<number>(60);
  const ballCallsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);

  useEffect(() => {
    const subscription = gameState$.subscribe((state) => {
      setGameState(state);

      if (state.latestBall) {
        setBallCalls((prev) =>
          prev[prev.length - 1] !== (state.latestBall as string)
            ? [...prev, state.latestBall as string]
            : prev
        );

        // Auto-scroll to the right after DOM updates
        if (!isDragging.current && ballCallsRef.current) {
          requestAnimationFrame(() => {
            ballCallsRef.current?.scrollTo({
              left: ballCallsRef.current.scrollWidth,
              behavior: "smooth",
            });
          });
        }
      } else if (state.gameFinished) {
        alert("Game finished!");
        gameState$.next({
          ...state,
          gameFinished: false,
        });
        console.log(state.isRegistered, "\nisRegistered\n");
        navigate("/home");
      }
    });

    gameService.startBallPolling();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleClaimWin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await gameService.claimWin();
      alert("Congratulations, you won!");
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert("You are not registered in the game.");
      } else if (error.response?.status === 403) {
        alert("You are disqualified.");
        gameState$.next({
          ...gameState,
          latestBall: null,
        });
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      navigate("/home");
    }
  };

  // Mouse Down: Start Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (ballCallsRef.current) {
      isDragging.current = true;
      startX.current = e.pageX - ballCallsRef.current.offsetLeft;
      scrollLeft.current = ballCallsRef.current.scrollLeft;
    }
  };

  // Mouse Move: Drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !ballCallsRef.current) return;
    e.preventDefault();
    const x = e.pageX - ballCallsRef.current.offsetLeft;
    const walk = x - startX.current; // Distance dragged
    ballCallsRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Mouse Up/Leave: Stop Dragging
  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (gameState.totalPlayers === 1 && waitingCountdown > 0) {
      const timer = setTimeout(
        () => setWaitingCountdown(waitingCountdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
    if (gameState.totalPlayers >= 2 && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.totalPlayers, waitingCountdown, countdown]);

  return (
    <div>
      {!gameState.latestBall ? (
        gameState.totalPlayers >= 2 ? (
          <h2>Game starts in: {countdown}</h2>
        ) : (
          <h2>Min of 2 players required: {waitingCountdown}</h2>
        )
      ) : (
        <h2>Bingo Game</h2>
      )}
      <h2>Total Players: {gameState.totalPlayers}</h2>
      <div
        ref={ballCallsRef}
        style={{
          width: "400px",
          maxWidth: "400px",
          margin: "0 auto",
          overflow: "hidden",
          whiteSpace: "nowrap",
          cursor: isDragging.current ? "grabbing" : "grab",
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <h2>Ball Calls: {ballCalls.join(" ")}</h2>
      </div>
      <BingoCard bingoCard={gameState.bingoCard} />
      <button
        onClick={handleClaimWin}
        disabled={loading}
        style={{
          marginTop: "1rem",
          backgroundColor: loading ? "#374151" : "",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        {loading ? "Claiming Win..." : "Claim Win"}
      </button>
    </div>
  );
};

export default Room;
