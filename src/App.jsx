// src/App.jsx
import React from 'react';
import useGameStore from './store/gameStore';
import GameCanvas from './components/Game/GameCanvas';
import GameUI from './components/UI/GameUI';
import { MainMenu, GameOver } from './components/UI/GameUI';
import './App.css';

function App() {
  const { gameState } = useGameStore();

  const renderCurrentScreen = () => {
    switch (gameState) {
      case 'menu':
        return <MainMenu />;
      
      case 'playing':
      case 'paused':
        return (
          <div className="min-h-screen bg-black flex items-center justify-center relative">
            <GameCanvas />
            <GameUI />
            {gameState === 'paused' && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                <div className="bg-gray-900 rounded-2xl p-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">⏸️ Pausado</h2>
                  <p className="text-gray-300 mb-4">Clique em "Continuar" para retomar o jogo</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'gameOver':
        return <GameOver />;
      
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;