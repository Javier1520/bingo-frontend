import React from 'react';
import { useNavigate } from 'react-router-dom';
import { claimWin } from '../api';

const Room: React.FC = () => {
  const navigate = useNavigate();

  const handleClaimWin = async () => {
    try {
      const response = await claimWin();

      if (response.status === 200) {
        alert('Congratulations, you won!');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        alert('You are not registered in the game.');
      } else if (error.response && error.response.status === 403) {
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
      {/* Render game UI here */}
      <button onClick={handleClaimWin}>Claim Win</button>
    </div>
  );
};

export default Room;
