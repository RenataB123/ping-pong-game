// src/components/Game/GameCanvas.jsx
import React, { useRef, useEffect, useCallback } from 'react';
import useGameStore from '../../store/gameStore';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseYRef = useRef(300);
  
  const {
    gameState,
    ball,
    paddle,
    cpu,
    canvas,
    scenario,
    updateBall,
    updatePaddle,
    updateCPU,
    addScore,
    loseLife,
    resetCombo
  } = useGameStore();

  // Detectar colisão
  const checkCollision = useCallback((rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);

  // Lógica principal do jogo
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Atualizar posição da bola
    let newBallX = ball.x + ball.dx;
    let newBallY = ball.y + ball.dy;
    let newDx = ball.dx;
    let newDy = ball.dy;

    // Colisão com as bordas superior e inferior
    if (newBallY - ball.radius <= 0 || newBallY + ball.radius >= canvas.height) {
      newDy = -newDy;
    }

    // Colisão com paddle do jogador
    const ballRect = {
      x: newBallX - ball.radius,
      y: newBallY - ball.radius,
      width: ball.radius * 2,
      height: ball.radius * 2
    };

    const paddleRect = {
      x: paddle.x,
      y: paddle.y,
      width: paddle.width,
      height: paddle.height
    };

    const cpuRect = {
      x: cpu.x,
      y: cpu.y,
      width: cpu.width,
      height: cpu.height
    };

    if (checkCollision(ballRect, paddleRect) && newDx < 0) {
      newDx = -newDx;
      const hitPos = (newBallY - paddle.y) / paddle.height;
      newDy = (hitPos - 0.5) * 10; // Adiciona ângulo baseado na posição do hit
    }

    // Colisão com paddle da CPU
    if (checkCollision(ballRect, cpuRect) && newDx > 0) {
      newDx = -newDx;
      const hitPos = (newBallY - cpu.y) / cpu.height;
      newDy = (hitPos - 0.5) * 10;
    }

    // Verificar se alguém fez ponto
    if (newBallX < 0) {
      // CPU fez ponto
      loseLife();
      resetCombo();
      newBallX = canvas.width / 2;
      newBallY = canvas.height / 2;
      newDx = ball.speed;
      newDy = ball.speed;
    } else if (newBallX > canvas.width) {
      // Jogador fez ponto
      addScore(1);
      newBallX = canvas.width / 2;
      newBallY = canvas.height / 2;
      newDx = -ball.speed;
      newDy = ball.speed;
    }

    // Atualizar bola
    updateBall({
      x: newBallX,
      y: newBallY,
      dx: newDx,
      dy: newDy
    });

    // IA da CPU (seguir a bola)
    const cpuCenter = cpu.y + cpu.height / 2;
    const ballCenter = newBallY;
    
    if (cpuCenter < ballCenter - 10) {
      updateCPU({ y: Math.min(cpu.y + cpu.speed, canvas.height - cpu.height) });
    } else if (cpuCenter > ballCenter + 10) {
      updateCPU({ y: Math.max(cpu.y - cpu.speed, 0) });
    }

    // Atualizar paddle do jogador baseado no mouse
    const targetY = mouseYRef.current - paddle.height / 2;
    const clampedY = Math.max(0, Math.min(targetY, canvas.height - paddle.height));
    updatePaddle({ y: clampedY });

  }, [gameState, ball, paddle, cpu, canvas, checkCollision, updateBall, updatePaddle, updateCPU, addScore, loseLife, resetCombo]);

  // Renderizar o jogo
  const render = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background baseado no cenário
    const backgrounds = {
      cyberpunk: 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)',
      natureza: 'linear-gradient(45deg, #2d5016, #3e6b1f, #4f7942)',
      espaco: 'linear-gradient(45deg, #0c0c2e, #1a1a3a, #2d2d5f)',
      anime_dojo: 'linear-gradient(45deg, #4a2c2a, #6b3423, #8b4513)'
    };

    // Aplicar background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const colors = backgrounds[scenario] || backgrounds.cyberpunk;
    const colorStops = colors.match(/#[a-fA-F0-9]{6}/g) || ['#1a1a2e', '#16213e', '#0f3460'];
    
    colorStops.forEach((color, index) => {
      gradient.addColorStop(index / (colorStops.length - 1), color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Linha central
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddle do jogador
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Paddle da CPU
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(cpu.x, cpu.y, cpu.width, cpu.height);

    // Bola
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Adicionar glow effect na bola
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [ball, paddle, cpu, canvas, scenario]);

  // Game loop principal
  useEffect(() => {
    const loop = () => {
      gameLoop();
      render();
      animationRef.current = requestAnimationFrame(loop);
    };

    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop, render]);

  // Controle do mouse
  const handleMouseMove = useCallback((event) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseYRef.current = event.clientY - rect.top;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      width={canvas.width}
      height={canvas.height}
      className="border-2 border-gray-600 bg-black cursor-none"
      style={{ cursor: 'none' }}
    />
  );
};

export default GameCanvas;