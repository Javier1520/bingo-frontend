import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameService } from "../services/GameService";
import { gameState$ } from "../store/Observables";
import BingoCard from "../components/BingoCard";

export const Room = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(gameState$.value);
  const [ballCalls, setBallCalls] = useState<string[]>([]);
  const ballCallsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const subscription = gameState$.subscribe((state) => {
      setGameState(state);

      if (state.latestBall) {
        setBallCalls((prev) =>
          state.latestBall ? [...prev, String(state.latestBall)] : prev
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
        console.log(state.isRegistered, '\nisRegistered\n');
        navigate("/home");
      }
    });

    gameService.startBallPolling();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleClaimWin = async () => {
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

  return (
    <div>
      <h1>Bingo Game</h1>
      <div
        ref={ballCallsRef}
        style={{
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

        <h2 >
          Ball Calls: {ballCalls.join(" ")}
        </h2>
      </div>
      <BingoCard bingoCard={gameState.bingoCard} />
      <button onClick={handleClaimWin}>Claim Win</button>
    </div>
  );
};

export default Room;
