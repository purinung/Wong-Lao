
import React, { useState, useEffect } from 'react';

interface RussianRouletteProps {
  onClose: () => void;
}

const RussianRoulette: React.FC<RussianRouletteProps> = ({ onClose }) => {
  const [bulletIndex, setBulletIndex] = useState<number>(-1);
  const [currentChamber, setCurrentChamber] = useState<number>(0);
  const [fired, setFired] = useState<boolean[]>(new Array(6).fill(false));
  const [status, setStatus] = useState<'READY' | 'SPINNING' | 'SAFE' | 'BANG'>('READY');
  const [shake, setShake] = useState(false);

  // Initialize game
  useEffect(() => {
    reloadGame();
  }, []);

  const reloadGame = () => {
    setStatus('SPINNING');
    setFired(new Array(6).fill(false));
    setCurrentChamber(0);
    
    // Simulate spinning delay
    setTimeout(() => {
      const newBullet = Math.floor(Math.random() * 6);
      setBulletIndex(newBullet);
      setStatus('READY');
    }, 1000);
  };

  const pullTrigger = () => {
    if (status !== 'READY') return;

    // Trigger animation
    setShake(true);
    setTimeout(() => setShake(false), 200);

    if (currentChamber === bulletIndex) {
      // BANG!
      setStatus('BANG');
    } else {
      // Click (Safe)
      setStatus('SAFE');
      const newFired = [...fired];
      newFired[currentChamber] = true;
      setFired(newFired);
      
      // Auto reset to READY for next person after delay
      setTimeout(() => {
        setCurrentChamber(prev => prev + 1);
        setStatus('READY');
      }, 1500);
    }
  };

  // Cylinder SVG
  const CylinderSVG = () => (
    <svg viewBox="0 0 200 200" className={`w-64 h-64 transition-transform duration-500 ${status === 'SPINNING' ? 'animate-spin' : ''}`} style={{ transform: `rotate(${currentChamber * -60}deg)` }}>
      {/* Main Body */}
      <circle cx="100" cy="100" r="90" fill="#1f2937" stroke="#4b5563" strokeWidth="4" />
      <circle cx="100" cy="100" r="20" fill="#111827" />
      
      {/* Chambers */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const x = 100 + Math.cos(angle) * 55;
        const y = 100 + Math.sin(angle) * 55;
        const isFired = fired[i];
        
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="22" fill="#000" stroke="#374151" strokeWidth="2" />
            {/* Show empty shell if fired and safe */}
            {isFired && (
               <circle cx={x} cy={y} r="10" fill="#4b5563" opacity="0.5" />
            )}
          </g>
        );
      })}
      
      {/* Indicator for current chamber (Top) */}
      <path d="M100 5 L110 20 L90 20 Z" fill="red" transform="translate(0, -10)" />
    </svg>
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ${status === 'BANG' ? 'bg-red-900/90' : 'bg-black/95'}`}>
      
      <div className={`relative w-full max-w-md p-8 flex flex-col items-center ${shake ? 'animate-pulse-fast' : ''}`}>
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white uppercase tracking-widest drop-shadow-lg">
            Russian Roulette
          </h2>
          <p className="text-gray-400 text-xs mt-2">วัดดวงกระสุนสังหาร... ใครโดนหมดแก้ว!</p>
        </div>

        {/* Visuals */}
        <div className="relative mb-10">
          <CylinderSVG />
          
          {status === 'BANG' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-6xl font-bold text-red-500 animate-bounce drop-shadow-[0_0_20px_rgba(220,38,38,1)]">
                 BANG!
               </div>
            </div>
          )}
           {status === 'SAFE' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-4xl font-bold text-green-400 animate-pulse drop-shadow-lg">
                 รอด
               </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full space-y-4">
          {status === 'READY' && (
            <button
              onClick={pullTrigger}
              className="w-full py-6 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white text-2xl font-bold rounded-2xl shadow-[0_4px_0_rgb(55,65,81)] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest"
            >
              PULL TRIGGER 🔫
            </button>
          )}
          
          {status === 'SPINNING' && (
            <div className="w-full py-6 text-center text-yellow-400 font-bold animate-pulse text-xl">
              หมุนลูกโม่...
            </div>
          )}

          {status === 'BANG' && (
            <div className="text-center space-y-4">
              <div className="bg-red-500/20 border border-red-500 p-4 rounded-xl">
                <p className="text-red-200 font-bold text-lg">☠️ คุณตายแล้ว!</p>
                <p className="text-white text-2xl font-black mt-2">หมดแก้วเดี๋ยวนี้</p>
              </div>
              <button
                onClick={reloadGame}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                โหลดกระสุนใหม่ 🔄
              </button>
            </div>
          )}
          
          {(status === 'SAFE') && (
             <div className="w-full py-6 text-center text-gray-400 text-sm">
               ส่งมือถือให้คนต่อไป...
             </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 flex space-x-4 text-xs text-gray-500">
           <span>Chamber: {currentChamber + 1}/6</span>
           <span>•</span>
           <span>Chance: {((1 / (6 - currentChamber)) * 100).toFixed(0)}%</span>
        </div>

        {/* Close */}
        <button 
            onClick={onClose} 
            className="absolute top-0 right-0 p-2 text-gray-500 hover:text-white transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

      </div>
    </div>
  );
};

export default RussianRoulette;
