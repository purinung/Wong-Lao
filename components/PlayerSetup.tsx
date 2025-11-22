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
  <div className="flex flex-col items-center justify-center mb-6 select-none scale-90">
    <div className="relative w-32 h-32 mb-2">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-fade-in">
        {/* Outer Circle Ring */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="#1e40af" strokeWidth="4" className="opacity-60" />
        <path d="M 100 10 A 90 90 0 0 1 190 100" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
        <path d="M 10 100 A 90 90 0 0 1 100 190" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" transform="rotate(180 100 100)" className="drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />

        {/* Icons Group */}
        <g transform="translate(100, 100)">
           <g transform="translate(0, -45)">
              <path d="M -20 -10 L -10 10 L 0 -20 L 10 10 L 20 -10 L 20 20 L -20 20 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
              <circle cx="0" cy="-20" r="3" fill="#fbbf24" />
           </g>
           <g transform="translate(45, -10) rotate(10)">
              <path d="M -15 -5 L 25 -5 L 25 5 L -5 5 L -5 18 L -20 18 L -20 5 Z" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
           </g>
           <g transform="translate(30, 40)">
              <circle cx="0" cy="5" r="14" fill="#1f2937" stroke="#ef4444" strokeWidth="1.5"/>
              <path d="M 0 -9 Q 5 -20 12 -15" fill="none" stroke="#f97316" strokeWidth="2" />
              <circle cx="14" cy="-17" r="2" fill="#ef4444" className="animate-pulse" />
           </g>
           <g transform="translate(-30, 40)">
              <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2" transform="rotate(-15)" />
              <circle cx="-4" cy="-4" r="2.5" fill="white" transform="rotate(-15)"/>
              <circle cx="4" cy="4" r="2.5" fill="white" transform="rotate(-15)"/>
           </g>
           <g transform="translate(-45, -10) rotate(-15)">
              <rect x="-12" y="-16" width="24" height="32" rx="3" fill="#e5e7eb" stroke="#f97316" strokeWidth="2" transform="rotate(-10)" />
              <text x="-8" y="5" fontSize="14" fill="#f97316" fontWeight="bold" transform="rotate(-10)">A</text>
           </g>
        </g>
      </svg>
    </div>
    
    <h1 className="text-5xl font-black text-white tracking-tighter leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Wong</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Lao</span>
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
    <div className="w-full max-w-md mx-auto p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] h-full overflow-y-auto custom-scrollbar flex flex-col">
      
      <AppLogo />

      {/* Mode Selection */}
      <div className="mb-6">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Select Intensity</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedMode('SOFT')}
            className={`relative overflow-hidden rounded-2xl p-3 border transition-all duration-300 flex flex-col items-center justify-center ${
              selectedMode === 'SOFT'
                ? 'border-pink-500/50 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                : 'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10'
            }`}
          >
            <div className="text-2xl mb-1">🐣</div>
            <div className={`font-bold text-sm ${selectedMode === 'SOFT' ? 'text-pink-400' : 'text-gray-400'}`}>สายแบ๊ว</div>
          </button>

          <button
            onClick={() => setSelectedMode('HARD')}
            className={`relative overflow-hidden rounded-2xl p-3 border transition-all duration-300 flex flex-col items-center justify-center ${
              selectedMode === 'HARD'
                ? 'border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10'
            }`}
          >
            <div className="text-2xl mb-1">🔥</div>
            <div className={`font-bold text-sm ${selectedMode === 'HARD' ? 'text-red-400' : 'text-gray-400'}`}>สายแข็ง</div>
          </button>
        </div>
      </div>

      {/* Player Input */}
      <div className="space-y-3">
        <div className="flex space-x-2 relative group">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ชื่อเพื่อน..."
            className="flex-1 bg-[#111] border border-gray-800 text-gray-200 placeholder-gray-600 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner text-sm"
          />
          <button
            onClick={addPlayer}
            disabled={!currentInput.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:bg-gray-700 text-white rounded-xl px-4 transition-all shadow-[0_0_10px_rgba(37,99,235,0.4)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        <div className="max-h-32 overflow-y-auto space-y-2 custom-scrollbar pr-1">
          {names.length === 0 && (
            <div className="text-center py-4 border border-dashed border-gray-800 rounded-xl">
               <p className="text-gray-600 text-xs italic">ยังไม่มีใครเข้าวง...</p>
            </div>
          )}
          {names.map((name, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
              <span className="text-gray-200 font-medium text-sm flex items-center">
                 <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                 {name}
              </span>
              <button
                onClick={() => removePlayer(index)}
                className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleStartGame}
          disabled={names.length < 1}
          className={`w-full mt-4 font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
            selectedMode === 'SOFT' 
            ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-pink-900/30 text-white'
            : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-red-900/30 text-white'
          } disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none`}
        >
          <span>START PARTY</span>
          <span className="text-lg">{selectedMode === 'SOFT' ? '🐣' : '🔥'}</span>
        </button>
      </div>

      {/* Extra Modes Section */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between mb-4 px-1">
           <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Quick Games</span>
           <span className="text-[9px] text-blue-400 bg-blue-900/20 border border-blue-500/20 px-2 py-0.5 rounded-full">Mini-Apps</span>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
            {[
                { icon: '🔫', label: 'Roulette', color: 'from-gray-800 to-gray-900', glow: 'hover:shadow-red-500/20', onClick: onStartRoulette },
                { icon: '👑', label: 'King\'s', color: 'from-gray-800 to-gray-900', glow: 'hover:shadow-yellow-500/20', onClick: onStartKingsCup },
                { icon: '💣', label: 'Bomb', color: 'from-gray-800 to-gray-900', glow: 'hover:shadow-orange-500/20', onClick: onStartTimeBomb },
                { icon: '🎲', label: 'Dice', color: 'from-gray-800 to-gray-900', glow: 'hover:shadow-blue-500/20', onClick: onStartDiceGame },
            ].map((item, idx) => (
                <button
                    key={idx}
                    onClick={item.onClick}
                    className={`group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 transition-all duration-300 active:scale-95`}
                >
                    <div className={`relative bg-[#151515] rounded-[15px] p-2 flex flex-col items-center justify-center h-20 transition-all group-hover:bg-[#1a1a1a] ${item.glow}`}>
                         <div className="text-2xl mb-2 group-hover:scale-110 transition-transform filter drop-shadow-md">{item.icon}</div>
                         <div className="text-gray-400 font-bold text-[9px] group-hover:text-white transition-colors">{item.label}</div>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* Credits Section */}
      <div className="mt-auto pt-6 pb-2 text-center opacity-50 hover:opacity-100 transition-opacity">
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 font-bold text-[10px] uppercase tracking-[0.2em]">
          Created by อุงอุงวายร้ายปทุม
        </p>
      </div>

    </div>
  );
};

export default PlayerSetup;