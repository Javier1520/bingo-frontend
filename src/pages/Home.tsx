
import { useAuth } from '../context/AuthContext';
import { registerToGame } from '../api';

const Home = () => {
  const { user } = useAuth();

  const handleRegisterToGame = async () => {
    try {
      await registerToGame();
      alert('Registered to game successfully!');
    } catch (error) {
      console.error('Failed to register', error);
    }
  };

  return (
    <div>
      <h1>Welcome {user}</h1>
      <button onClick={handleRegisterToGame}>Register for Game</button>
    </div>
  );
};

export default Home;
