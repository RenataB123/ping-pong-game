// src/components/UI/GameUI.jsx
import React from 'react';
import useGameStore from '../../store/gameStore';

const GameUI = () => {
  const { score, lives, combo, maxCombo, gameState, pauseGame } = useGameStore();

  if (gameState === 'menu' || gameState === 'gameOver') {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start text-white z-10">
      {/* Score e informações do jogador */}
      <div className="bg-black bg-opacity-50 rounded-lg p-4 backdrop-blur-sm">
        <div className="text-2xl font-bold mb-2">Score: {score}</div>
        <div className="text-lg">Vidas: {'❤️'.repeat(lives)}</div>
        <div className="text-lg">Combo: {combo}</div>
        {maxCombo > 0 && (
          <div className="text-sm text-yellow-400">Max Combo: {maxCombo}</div>
        )}
      </div>

      {/* Controles */}
      <div className="bg-black bg-opacity-50 rounded-lg p-4 backdrop-blur-sm">
        <button
          onClick={pauseGame}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-bold transition-colors"
        >
          {gameState === 'paused' ? 'Continuar' : 'Pausar'}
        </button>
      </div>
    </div>
  );
};

// src/components/UI/MainMenu.jsx
export const MainMenu = () => {
  const { 
    playerName, 
    difficulty, 
    scenario, 
    setPlayerName, 
    setDifficulty, 
    setScenario, 
    setGameState, 
    resetGame 
  } = useGameStore();

  const animeNames = [
    'Naruto', 'Goku', 'Luffy', 'Ichigo', 'Edward', 'Tanjiro', 'Deku',
    'Sakura', 'Bulma', 'Nami', 'Rukia', 'Winry', 'Nezuko', 'Ochako'
  ];

  const getRandomAnimeName = () => {
    return animeNames[Math.floor(Math.random() * animeNames.length)];
  };

  const startGame = () => {
    if (!playerName.trim()) {
      setPlayerName(getRandomAnimeName());
    }
    resetGame();
    setGameState('playing');
  };

  const difficulties = [
    { value: 'principiante', label: 'Principiante', color: 'bg-green-500' },
    { value: 'facil', label: 'Fácil', color: 'bg-blue-500' },
    { value: 'medio', label: 'Médio', color: 'bg-yellow-500' },
    { value: 'dificil', label: 'Difícil', color: 'bg-orange-500' },
    { value: 'extremo', label: 'Extremo', color: 'bg-red-500' },
    { value: 'impossivel', label: 'Impossível', color: 'bg-purple-500' }
  ];

  const scenarios = [
    { value: 'cyberpunk', label: 'Cyberpunk', emoji: '🌃' },
    { value: 'natureza', label: 'Natureza', emoji: '🌲' },
    { value: 'espaco', label: 'Espaço', emoji: '🚀' },
    { value: 'anime_dojo', label: 'Dojo Anime', emoji: '🥋' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-50 rounded-2xl p-8 backdrop-blur-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-white text-center mb-8 glow">
          🏓 Ping Pong Elite
        </h1>

        {/* Nome do jogador */}
        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2">
            Nome do Jogador
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Deixe vazio para nome automático"
            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={20}
          />
        </div>

        {/* Dificuldade */}
        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2">
            Dificuldade
          </label>
          <div className="grid grid-cols-2 gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setDifficulty(diff.value)}
                className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                  difficulty === diff.value
                    ? `${diff.color} text-white shadow-lg`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cenário */}
        <div className="mb-8">
          <label className="block text-white text-sm font-bold mb-2">
            Cenário
          </label>
          <div className="grid grid-cols-2 gap-2">
            {scenarios.map((scen) => (
              <button
                key={scen.value}
                onClick={() => setScenario(scen.value)}
                className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  scenario === scen.value
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span>{scen.emoji}</span>
                <span className="text-sm">{scen.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Botão de iniciar */}
        <button
          onClick={startGame}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
        >
          🎮 Iniciar Jogo
        </button>
      </div>
    </div>
  );
};

// src/components/UI/GameOver.jsx
export const GameOver = () => {
  const { score, maxCombo, setGameState, resetGame } = useGameStore();

  const playAgain = () => {
    resetGame();
    setGameState('playing');
  };

  const backToMenu = () => {
    resetGame();
    setGameState('menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-50 rounded-2xl p-8 backdrop-blur-lg max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          💀 Game Over
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="text-2xl text-white mb-2">
            Score Final: <span className="text-yellow-400">{score}</span>
          </div>
          <div className="text-lg text-gray-300">
            Melhor Combo: <span className="text-blue-400">{maxCombo}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={playAgain}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            🔄 Jogar Novamente
          </button>
          
          <button
            onClick={backToMenu}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            🏠 Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameUI;