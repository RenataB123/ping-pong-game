// src/store/gameStore.js
import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // Game State
  gameState: 'menu', // 'menu', 'playing', 'paused', 'gameOver'
  score: 0,
  lives: 3,
  level: 1,
  combo: 0,
  maxCombo: 0,
  
  // Player Info
  playerName: '',
  difficulty: 'facil',
  scenario: 'cyberpunk',
  
  // Game Objects
  ball: {
    x: 400,
    y: 300,
    dx: 5,
    dy: 5,
    radius: 10,
    speed: 5
  },
  
  paddle: {
    x: 50,
    y: 250,
    width: 15,
    height: 100,
    speed: 8
  },
  
  cpu: {
    x: 750,
    y: 250,
    width: 15,
    height: 100,
    speed: 4
  },
  
  // Game Settings
  canvas: {
    width: 800,
    height: 600
  },
  
  powerUps: [],
  
  // Actions
  setGameState: (state) => set({ gameState: state }),
  
  setPlayerName: (name) => set({ playerName: name }),
  
  setDifficulty: (difficulty) => {
    const difficultySettings = {
      principiante: { ballSpeed: 3, cpuSpeed: 2, paddleHeight: 120 },
      facil: { ballSpeed: 5, cpuSpeed: 4, paddleHeight: 100 },
      medio: { ballSpeed: 7, cpuSpeed: 5, paddleHeight: 80 },
      dificil: { ballSpeed: 9, cpuSpeed: 6, paddleHeight: 70 },
      extremo: { ballSpeed: 11, cpuSpeed: 7, paddleHeight: 60 },
      impossivel: { ballSpeed: 13, cpuSpeed: 8, paddleHeight: 50 }
    };
    
    const settings = difficultySettings[difficulty];
    
    set((state) => ({
      difficulty,
      ball: { ...state.ball, speed: settings.ballSpeed },
      cpu: { ...state.cpu, speed: settings.cpuSpeed },
      paddle: { ...state.paddle, height: settings.paddleHeight },
    }));
  },
  
  setScenario: (scenario) => set({ scenario }),
  
  updateBall: (newBall) => set((state) => ({ ball: { ...state.ball, ...newBall } })),
  
  updatePaddle: (newPaddle) => set((state) => ({ paddle: { ...state.paddle, ...newPaddle } })),
  
  updateCPU: (newCPU) => set((state) => ({ cpu: { ...state.cpu, ...newCPU } })),
  
  addScore: (points = 1) => set((state) => {
    const newScore = state.score + points;
    const newCombo = state.combo + 1;
    const newMaxCombo = Math.max(state.maxCombo, newCombo);
    
    return {
      score: newScore,
      combo: newCombo,
      maxCombo: newMaxCombo
    };
  }),
  
  resetCombo: () => set({ combo: 0 }),
  
  loseLife: () => set((state) => {
    const newLives = state.lives - 1;
    if (newLives <= 0) {
      return { lives: 0, gameState: 'gameOver' };
    }
    return { lives: newLives, combo: 0 };
  }),
  
  resetGame: () => set((state) => ({
    score: 0,
    lives: 3,
    combo: 0,
    gameState: 'menu',
    ball: {
      x: 400,
      y: 300,
      dx: state.ball.speed,
      dy: state.ball.speed,
      radius: 10,
      speed: state.ball.speed
    },
    paddle: {
      ...state.paddle,
      x: 50,
      y: 250
    },
    cpu: {
      ...state.cpu,
      x: 750,
      y: 250
    },
    powerUps: []
  })),
  
  pauseGame: () => set((state) => ({
    gameState: state.gameState === 'paused' ? 'playing' : 'paused'
  }))
}));

export default useGameStore;