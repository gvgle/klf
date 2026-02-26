import React, { useEffect, useRef, useState } from 'react';

type PlantType = 'peashooter' | 'sunflower' | 'wallnut' | 'ultimate';
type ZombieType = 'normal' | 'conehead' | 'buckethead' | 'fast';

const PLANT_DATA = {
  peashooter: { cost: 100, hp: 6, name: '豌豆射手' },
  sunflower: { cost: 50, hp: 6, name: '向日葵' },
  wallnut: { cost: 50, hp: 72, name: '坚果墙' },
  ultimate: { cost: 1000, hp: 999, name: '毁灭神' }
};

const ZOMBIE_DATA = {
  normal: { hp: 5, speed: 1.2, color: '#8B4513' },
  conehead: { hp: 14, speed: 1.0, color: '#CD853F' },
  buckethead: { hp: 28, speed: 0.8, color: '#A0522D' },
  fast: { hp: 4, speed: 2.5, color: '#D2691E' }
};

interface GameCanvasProps {
  onNavigate: (screen: string) => void;
  hasUltimate: boolean;
}

export default function GameCanvas({ onNavigate, hasUltimate }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sun, setSun] = useState(150);
  const [selectedSeed, setSelectedSeed] = useState<PlantType | null>(null);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    plants: [] as any[],
    zombies: [] as any[],
    bullets: [] as any[],
    suns: [] as any[],
    zombiesToSpawn: 10,
    lastSpawnTime: 0,
    lastSunTime: 0,
    running: true
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;
    let animationId: number;

    // Game loop
    const gameLoop = (timestamp: number) => {
      if (!state.running) return;

      // Clear canvas
      ctx.fillStyle = '#2d5016';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#3d6026';
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 9; j++) {
          ctx.strokeRect(100 + j * 80, 50 + i * 100, 80, 100);
        }
      }

      // Spawn zombies
      if (timestamp - state.lastSpawnTime > 3000 && state.zombiesToSpawn > 0) {
        const types: ZombieType[] = ['normal', 'conehead', 'buckethead', 'fast'];
        const type = types[Math.floor(Math.random() * Math.min(level, 4))];
        state.zombies.push({
          type,
          row: Math.floor(Math.random() * 5),
          x: canvas.width,
          hp: ZOMBIE_DATA[type].hp,
          speed: ZOMBIE_DATA[type].speed
        });
        state.zombiesToSpawn--;
        state.lastSpawnTime = timestamp;
      }

      // Spawn sun
      if (timestamp - state.lastSunTime > 8000) {
        state.suns.push({
          x: 100 + Math.random() * 600,
          y: 50,
          targetY: 50 + Math.random() * 450
        });
        state.lastSunTime = timestamp;
      }

      // Update and draw suns
      state.suns = state.suns.filter(s => {
        s.y = Math.min(s.y + 1, s.targetY);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 20, 0, Math.PI * 2);
        ctx.fill();
        return s.y < canvas.height;
      });

      // Update and draw plants
      state.plants.forEach(p => {
        const x = 100 + p.col * 80 + 40;
        const y = 50 + p.row * 100 + 50;

        if (p.type === 'peashooter') {
          ctx.fillStyle = '#00FF00';
          ctx.fillRect(x - 20, y - 20, 40, 40);
          // Shoot
          if (timestamp % 2000 < 16) {
            state.bullets.push({ row: p.row, x: x + 20 });
          }
        } else if (p.type === 'sunflower') {
          ctx.fillStyle = '#FFFF00';
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, Math.PI * 2);
          ctx.fill();
          // Generate sun
          if (timestamp % 10000 < 16) {
            state.suns.push({ x, y, targetY: y });
            setSun(s => s + 25);
          }
        } else if (p.type === 'wallnut') {
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(x - 25, y - 25, 50, 50);
        }
      });

      // Update and draw bullets
      state.bullets = state.bullets.filter(b => {
        b.x += 5;
        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.arc(b.x, 50 + b.row * 100 + 50, 5, 0, Math.PI * 2);
        ctx.fill();

        // Check collision with zombies
        const hitZombie = state.zombies.find(z =>
          z.row === b.row && Math.abs(z.x - b.x) < 30
        );
        if (hitZombie) {
          hitZombie.hp--;
          return false;
        }
        return b.x < canvas.width;
      });

      // Update and draw zombies
      state.zombies = state.zombies.filter(z => {
        z.x -= z.speed;

        ctx.fillStyle = ZOMBIE_DATA[z.type].color;
        ctx.fillRect(z.x - 20, 50 + z.row * 100 + 30, 40, 60);

        // Check collision with plants
        const hitPlant = state.plants.find(p =>
          p.row === z.row && Math.abs((100 + p.col * 80 + 40) - z.x) < 40
        );
        if (hitPlant) {
          if (timestamp % 1000 < 16) {
            hitPlant.hp--;
            if (hitPlant.hp <= 0) {
              state.plants = state.plants.filter(p => p !== hitPlant);
            }
          }
        }

        // Game over check
        if (z.x < 50) {
          state.running = false;
          setGameOver(true);
          return false;
        }

        return z.hp > 0;
      });

      // Level complete
      if (state.zombiesToSpawn === 0 && state.zombies.length === 0) {
        setLevel(l => l + 1);
        state.zombiesToSpawn = 10 + level * 5;
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      state.running = false;
      cancelAnimationFrame(animationId);
    };
  }, [level]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedSeed || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor((x - 100) / 80);
    const row = Math.floor((y - 50) / 100);

    if (col >= 0 && col < 9 && row >= 0 && row < 5) {
      const cost = PLANT_DATA[selectedSeed].cost;
      if (sun >= cost) {
        const exists = gameStateRef.current.plants.some(p => p.row === row && p.col === col);
        if (!exists) {
          gameStateRef.current.plants.push({
            type: selectedSeed,
            row,
            col,
            hp: PLANT_DATA[selectedSeed].hp
          });
          setSun(s => s - cost);
          setSelectedSeed(null);
        }
      }
    }
  };

  const handleSunClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedSun = gameStateRef.current.suns.findIndex(s =>
      Math.abs(s.x - x) < 20 && Math.abs(s.y - y) < 20
    );

    if (clickedSun !== -1) {
      gameStateRef.current.suns.splice(clickedSun, 1);
      setSun(s => s + 25);
    }
  };

  const handleRestart = () => {
    gameStateRef.current = {
      plants: [],
      zombies: [],
      bullets: [],
      suns: [],
      zombiesToSpawn: 10,
      lastSpawnTime: 0,
      lastSunTime: 0,
      running: true
    };
    setSun(150);
    setLevel(1);
    setGameOver(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-black relative">
      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex gap-2">
          <div className="bg-amber-900/90 border-2 border-amber-700 rounded-lg p-2 w-20 text-center">
            <div className="text-yellow-400 font-black text-xl">{sun}</div>
            <div className="text-xs text-amber-200">阳光</div>
          </div>

          {(Object.keys(PLANT_DATA) as PlantType[]).filter(t => t !== 'ultimate' || hasUltimate).map(type => (
            <button
              key={type}
              onClick={() => sun >= PLANT_DATA[type].cost && setSelectedSeed(type)}
              className={`w-16 h-20 rounded-lg border-2 ${
                sun < PLANT_DATA[type].cost ? 'opacity-50 grayscale border-stone-600 bg-stone-800' :
                selectedSeed === type ? 'border-green-400 bg-green-900/80 scale-105' :
                'border-amber-700 bg-amber-900/80 hover:bg-amber-800'
              }`}
            >
              <div className="text-xs text-white">{PLANT_DATA[type].name}</div>
              <div className="text-xs text-white mt-1">{PLANT_DATA[type].cost}</div>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={() => onNavigate('menu')} className="px-4 py-2 bg-stone-700 rounded-xl font-bold hover:bg-stone-600">
            菜单
          </button>
          <div className="bg-black/60 px-4 py-2 rounded-lg border border-white/20 font-bold text-amber-400">
            关卡 {level}
          </div>
        </div>
      </div>

      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        width={900}
        height={600}
        onClick={(e) => {
          handleCanvasClick(e);
          handleSunClick(e);
        }}
        className="border-4 border-green-800 cursor-crosshair"
      />

      {/* Game over overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
          <h2 className="text-5xl font-black text-red-500 mb-8">游戏结束！</h2>
          <div className="flex gap-4">
            <button onClick={handleRestart} className="px-8 py-4 bg-green-600 rounded-xl font-bold text-2xl hover:bg-green-500">
              重新开始
            </button>
            <button onClick={() => onNavigate('menu')} className="px-8 py-4 bg-stone-700 rounded-xl font-bold text-2xl hover:bg-stone-600">
              返回菜单
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
