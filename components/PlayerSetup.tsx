import React, { useState } from 'react';
import { Player, GameMode } from '../types';

interface PlayerSetupProps {
  onStartGame: (players: Player[], mode: GameMode) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame }) => {
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

  const handleStart = () => {
    if (names.length > 0) {
      const players: Player[] = names.map((name, index) => ({
        id: `player-${index}-${Date.now()}`,
        name
      }));
      onStartGame(players, selectedMode);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-2">
          Wong Lao
        </h1>
        <p className="text-gray-400 text-sm">Truth or Dare AI Edition</p>
      </div>

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

        <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
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
          onClick={handleStart}
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
    </div>
  );
};

export default PlayerSetup;