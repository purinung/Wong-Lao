
import React, { useState } from 'react';
import { Player, GameMode } from '../types';

interface PlayerSetupProps {
  onStartGame: (players: Player[], mode: GameMode) => void;
  onStartRoulette: () => void;
  onStartKingsCup: () => void;
  onStartTimeBomb: () => void;
  onStartDiceGame: () => void;
}

const AppLogo = () => (
  <div className="flex flex-col items-center justify-center mb-8 select-none">
    <div className="relative w-40 h-40 mb-2">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl animate-fade-in">
        {/* Outer Circle Ring - Navy Blue & Orange */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="#1e3a8a" strokeWidth="6" className="opacity-80" />
        
        {/* Decorative Arcs */}
        <path d="M 100 10 A 90 90 0 0 1 190 100" fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
        <path d="M 10 100 A 90 90 0 0 1 100 190" fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round" transform="rotate(180 100 100)" />

        {/* Icons Group - Combined all game modes */}
        <g transform="translate(100, 100)">
           
           {/* Crown (King's Cup) - Top Center */}
           <g transform="translate(0, -45)">
              <path d="M -20 -10 L -10 10 L 0 -20 L 10 10 L 20 -10 L 20 20 L -20 20 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
              <circle cx="0" cy="-20" r="3" fill="#fbbf24" />
              <circle cx="-20" cy="-10" r="2" fill="#fbbf24" />
              <circle cx="20" cy="-10" r="2" fill="#fbbf24" />
           </g>

           {/* Gun (Russian Roulette) - Right */}
           <g transform="translate(45, -10) rotate(10)">
              <path d="M -15 -5 L 25 -5 L 25 5 L -5 5 L -5 18 L -20 18 L -20 5 Z" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
              <circle cx="-10" cy="2" r="6" fill="#4b5563" />
           </g>

           {/* Bomb (Time Bomb) - Bottom Right */}
           <g transform="translate(30, 40)">
              <circle cx="0" cy="5" r="14" fill="#1f2937" stroke="#ef4444" strokeWidth="1.5"/>
              <path d="M 0 -9 Q 5 -20 12 -15" fill="none" stroke="#f97316" strokeWidth="2" />
              <path d="M 12 -15 L 16 -19 M 10 -19 L 14 -15" stroke="#ef4444" strokeWidth="2" />
           </g>

           {/* Dice (Chance) - Bottom Left */}
           <g transform="translate(-30, 40)">
              <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2" transform="rotate(-15)" />
              <circle cx="-4" cy="-4" r="2.5" fill="white" transform="rotate(-15)"/>
              <circle cx="4" cy="4" r="2.5" fill="white" transform="rotate(-15)"/>
              <circle cx="4" cy="-4" r="2.5" fill="white" transform="rotate(-15)"/>
              <circle cx="-4" cy="4" r="2.5" fill="white" transform="rotate(-15)"/>
           </g>

           {/* Cards (General) - Left */}
           <g transform="translate(-45, -10) rotate(-15)">
              <rect x="-12" y="-16" width="24" height="32" rx="3" fill="white" stroke="#f97316" strokeWidth="2" transform="rotate(-10)" />
              <text x="-8" y="5" fontSize="14" fill="#f97316" fontWeight="bold" transform="rotate(-10)">A</text>
              <rect x="0" y="-16" width="24" height="32" rx="3" fill="white" stroke="#1e3a8a" strokeWidth="2" transform="rotate(10)" />
              <text x="4" y="5" fontSize="14" fill="#1e3a8a" fontWeight="bold" transform="rotate(10)">K</text>
           </g>
        </g>
      </svg>
    </div>
    
    <h1 className="text-5xl font-black text-white tracking-tighter leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
      <span className="text-blue-500">Wong</span> <span className="text-orange-500">Lao</span>
    </h1>
  </div>
);

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame, onStartRoulette, onStartKingsCup, onStartTimeBomb, onStartDiceGame }) => {
  const [names, setNames] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<GameMode>('HARD');

  const addPlayer = () => {
    if (currentInput.trim() !== '') {
      setNames([...names, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const removePlayer = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    if (names.length > 0) {
      const players: Player[] = names.map((name, index) => ({
        id: `player-${index}-${Date.now()}`,
        name
      }));
      onStartGame(players, selectedMode);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl h-full overflow-y-auto custom-scrollbar flex flex-col">
      
      <AppLogo />

      {/* Mode Selection */}
      <div className="mb-6 space-y-2">
        <p className="text-gray-300 text-sm font-medium ml-1">เลือกระดับความแรง</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedMode('SOFT')}
            className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 ${
              selectedMode === 'SOFT'
                ? 'border-pink-400 bg-pink-500/20 shadow-[0_0_15px_rgba(244,114,182,0.4)]'
                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
          >
            <div className="text-2xl mb-1">🐣</div>
            <div className="font-bold text-sm text-pink-300">สายแบ๊ว</div>
            <div className="text-[10px] text-gray-400 mt-1">ใสๆ น่ารัก เน้นฮา</div>
          </button>

          <button
            onClick={() => setSelectedMode('HARD')}
            className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 ${
              selectedMode === 'HARD'
                ? 'border-red-500 bg-red-600/20 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
          >
            <div className="text-2xl mb-1">🔥</div>
            <div className="font-bold text-sm text-red-400">สายแข็ง</div>
            <div className="text-[10px] text-gray-400 mt-1">ดิบเถื่อน ถึงเนื้อถึงตัว</div>
          </button>
        </div>
      </div>

      {/* Player Input */}
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ชื่อเพื่อน..."
            className="flex-1 bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button
            onClick={addPlayer}
            disabled={!currentInput.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl px-4 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-2 custom-scrollbar">
          {names.length === 0 && (
            <p className="text-center text-gray-600 py-4 italic">ยังไม่มีใครเข้าวง...</p>
          )}
          {names.map((name, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-800/30 p-3 rounded-lg border border-gray-700/50 animate-fade-in">
              <span className="text-white font-medium">🍺 {name}</span>
              <button
                onClick={() => removePlayer(index)}
                className="text-gray-500 hover:text-red-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleStartGame}
          disabled={names.length < 1}
          className={`w-full mt-6 font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 ${
            selectedMode === 'SOFT' 
            ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 shadow-pink-500/20'
            : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-red-500/20'
          } disabled:opacity-50 disabled:cursor-not-allowed text-white`}
        >
          START PARTY {selectedMode === 'SOFT' ? '🐣' : '🔥'}
        </button>
      </div>

      {/* Extra Modes Section */}
      <div className="mt-8 pt-6 border-t border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
           <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Extra Modes</span>
           <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded">Quick Play</span>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
            {/* Russian Roulette */}
            <button
                onClick={onStartRoulette}
                className="group relative overflow-hidden rounded-xl p-1 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-red-900 hover:to-gray-900 transition-all duration-300 active:scale-95 shadow-lg"
            >
                <div className="relative bg-gray-900/90 rounded-[10px] p-1 flex flex-col items-center justify-center h-16">
                     <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🔫</div>
                     <div className="text-white font-bold text-[9px]">Roulette</div>
                </div>
            </button>

             {/* King's Cup */}
             <button
                onClick={onStartKingsCup}
                className="group relative overflow-hidden rounded-xl p-1 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-yellow-900 hover:to-gray-900 transition-all duration-300 active:scale-95 shadow-lg"
            >
                <div className="relative bg-gray-900/90 rounded-[10px] p-1 flex flex-col items-center justify-center h-16">
                     <div className="text-xl mb-1 group-hover:scale-110 transition-transform">👑</div>
                     <div className="text-white font-bold text-[9px]">King's Cup</div>
                </div>
            </button>

            {/* Time Bomb */}
            <button
                onClick={onStartTimeBomb}
                className="group relative overflow-hidden rounded-xl p-1 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-orange-900 hover:to-gray-900 transition-all duration-300 active:scale-95 shadow-lg"
            >
                <div className="relative bg-gray-900/90 rounded-[10px] p-1 flex flex-col items-center justify-center h-16">
                     <div className="text-xl mb-1 group-hover:scale-110 transition-transform">💣</div>
                     <div className="text-white font-bold text-[9px]">Bomb</div>
                </div>
            </button>

            {/* Dice Game (Replaced Vote) */}
            <button
                onClick={onStartDiceGame}
                className="group relative overflow-hidden rounded-xl p-1 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-blue-900 hover:to-gray-900 transition-all duration-300 active:scale-95 shadow-lg"
            >
                <div className="relative bg-gray-900/90 rounded-[10px] p-1 flex flex-col items-center justify-center h-16">
                     <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🎲</div>
                     <div className="text-white font-bold text-[9px]">Dice</div>
                </div>
            </button>
        </div>
      </div>

      {/* Credits Section */}
      <div className="mt-auto pt-8 pb-2 text-center">
        <p className="text-gray-600 text-[10px] uppercase tracking-widest">Created By</p>
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 font-bold text-sm mt-1 animate-pulse">
          ✨ อุงอุงวายร้ายปทุม ✨
        </p>
      </div>

    </div>
  );
};

export default PlayerSetup;
