
import React, { useState, useEffect } from 'react';

interface RussianRouletteProps {
  onClose: () => void;
}

const RussianRoulette: React.FC<RussianRouletteProps> = ({ onClose }) => {
  // Settings State
  const [totalChambers, setTotalChambers] = useState<number>(6);
  const [totalBullets, setTotalBullets] = useState<number>(1);

  // Game State
  const [bulletLocations, setBulletLocations] = useState<number[]>([]);
  const [currentChamber, setCurrentChamber] = useState<number>(0);
  const [firedChambers, setFiredChambers] = useState<boolean[]>([]); // True if chamber has been checked
  const [status, setStatus] = useState<'SETUP' | 'SPINNING' | 'READY' | 'SAFE' | 'BANG'>('SETUP');
  const [shake, setShake] = useState(false);

  // Reset game to setup mode
  const resetToSetup = () => {
    setStatus('SETUP');
    setBulletLocations([]);
    setFiredChambers([]);
    setCurrentChamber(0);
  };

  // Start the game (Spin)
  const loadAndSpin = () => {
    // Validate logic (Max bullets = N - 1)
    if (totalBullets >= totalChambers) {
        setTotalBullets(totalChambers - 1);
    }

    setStatus('SPINNING');
    setFiredChambers(new Array(totalChambers).fill(false));
    setCurrentChamber(0);
    
    // Randomly place bullets
    const bullets: number[] = [];
    const availableSlots = Array.from({ length: totalChambers }, (_, i) => i);
    
    for (let i = 0; i < totalBullets; i++) {
        const randomIndex = Math.floor(Math.random() * availableSlots.length);
        bullets.push(availableSlots[randomIndex]);
        availableSlots.splice(randomIndex, 1); // Remove used slot
    }
    setBulletLocations(bullets);
    
    // Simulate spinning delay
    setTimeout(() => {
      setStatus('READY');
    }, 1500);
  };

  const pullTrigger = () => {
    if (status !== 'READY') return;

    // Trigger animation
    setShake(true);
    setTimeout(() => setShake(false), 200);
    
    // Vibrate if supported
    if (navigator.vibrate) navigator.vibrate(50);

    // Mark this chamber as fired regardless of result
    const newFired = [...firedChambers];
    newFired[currentChamber] = true;
    setFiredChambers(newFired);

    if (bulletLocations.includes(currentChamber)) {
      // BANG!
      setStatus('BANG');
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } else {
      // Click (Safe)
      setStatus('SAFE');
      
      // Auto reset to READY for next person after delay
      setTimeout(() => {
        moveToNextChamber();
      }, 1500);
    }
  };

  const moveToNextChamber = () => {
    // Move to next chamber cyclically
    setCurrentChamber(prev => (prev + 1) % totalChambers);
    setStatus('READY');
  };

  // Check bullets remaining
  const getBulletsRemaining = () => {
    const firedBulletsCount = bulletLocations.filter(loc => firedChambers[loc]).length;
    return totalBullets - firedBulletsCount;
  };

  // Adjust settings helpers
  const changeChambers = (delta: number) => {
    const newVal = Math.max(3, Math.min(12, totalChambers + delta));
    setTotalChambers(newVal);
    // Adjust bullets if needed to maintain N-1 rule
    if (totalBullets >= newVal) {
        setTotalBullets(newVal - 1);
    }
  };

  const changeBullets = (delta: number) => {
    const maxBullets = totalChambers - 1;
    const newVal = Math.max(1, Math.min(maxBullets, totalBullets + delta));
    setTotalBullets(newVal);
  };

  // Dynamic Cylinder SVG
  const CylinderSVG = () => {
    // Calculation parameters
    const radius = 90;
    const holeRadius = totalChambers > 8 ? 15 : (totalChambers > 5 ? 20 : 25); // Smaller holes for more chambers
    const distFromCenter = 55;
    
    return (
        <svg viewBox="0 0 200 200" 
             className={`w-64 h-64 transition-transform duration-500 ${status === 'SPINNING' ? 'animate-spin' : ''}`} 
             style={{ transform: `rotate(${currentChamber * -(360 / totalChambers)}deg)` }}>
          
          {/* Main Body */}
          <circle cx="100" cy="100" r={radius} fill="#1f2937" stroke="#4b5563" strokeWidth="4" />
          <circle cx="100" cy="100" r="15" fill="#111827" />
          
          {/* Dynamic Chambers */}
          {Array.from({ length: totalChambers }).map((_, i) => {
            const angleDeg = (i * (360 / totalChambers)) - 90;
            const angleRad = angleDeg * (Math.PI / 180);
            const x = 100 + Math.cos(angleRad) * distFromCenter;
            const y = 100 + Math.sin(angleRad) * distFromCenter;
            const isFired = firedChambers[i];
            const isBullet = bulletLocations.includes(i);
            
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={holeRadius} fill="#000" stroke="#374151" strokeWidth="2" />
                
                {/* Visual Logic:
                    - If Fired AND Bullet: Show Spent Shell (Dark Red/Grey)
                    - If Fired AND Empty: Show Empty (Grey opacity)
                    - If Not Fired: Hidden (Black)
                */}
                {isFired && (
                    isBullet ? (
                        <circle cx={x} cy={y} r={holeRadius * 0.7} fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" opacity="0.8" />
                    ) : (
                        <circle cx={x} cy={y} r={holeRadius * 0.5} fill="#4b5563" opacity="0.5" />
                    )
                )}
              </g>
            );
          })}
          
          {/* Indicator for current chamber (Fixed at Top) */}
          <path d="M100 5 L110 20 L90 20 Z" fill="red" transform="translate(0, -10)" />
        </svg>
    );
  };

  const bulletsLeft = getBulletsRemaining();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ${status === 'BANG' ? 'bg-red-900/95' : 'bg-black/95'}`}>
      
      <div className={`relative w-full max-w-md p-6 flex flex-col items-center h-[90dvh] justify-between ${shake ? 'animate-pulse-fast' : ''}`}>
        
        {/* Title */}
        <div className="text-center mt-4">
          <h2 className="text-3xl font-bold text-white uppercase tracking-widest drop-shadow-lg">
            Russian Roulette
          </h2>
          <p className="text-gray-400 text-xs mt-1">
              {status === 'SETUP' ? 'ตั้งค่าปืนของคุณ' : `กระสุนเหลือ: ${bulletsLeft} / ${totalBullets} นัด`}
          </p>
        </div>

        {/* SETUP PHASE UI */}
        {status === 'SETUP' && (
            <div className="flex-1 flex flex-col items-center justify-center w-full space-y-8 animate-fade-in">
                
                {/* Chambers Control */}
                <div className="w-full bg-gray-800/50 p-6 rounded-2xl border border-white/10">
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-4 text-center">จำนวนช่องโม่ (Chambers)</label>
                    <div className="flex items-center justify-between">
                        <button onClick={() => changeChambers(-1)} className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold shadow-lg active:scale-95 transition-all">-</button>
                        <span className="text-4xl font-black text-blue-400">{totalChambers}</span>
                        <button onClick={() => changeChambers(1)} className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold shadow-lg active:scale-95 transition-all">+</button>
                    </div>
                </div>

                {/* Bullets Control */}
                <div className="w-full bg-gray-800/50 p-6 rounded-2xl border border-white/10">
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-4 text-center">จำนวนกระสุน (Bullets)</label>
                    <div className="flex items-center justify-between">
                        <button onClick={() => changeBullets(-1)} className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold shadow-lg active:scale-95 transition-all">-</button>
                        <span className="text-4xl font-black text-red-500">{totalBullets}</span>
                        <button onClick={() => changeBullets(1)} className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold shadow-lg active:scale-95 transition-all">+</button>
                    </div>
                    <p className="text-center text-gray-500 text-[10px] mt-3">
                        Max: {totalChambers - 1} นัด
                    </p>
                </div>

                <button
                  onClick={loadAndSpin}
                  className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-xl rounded-2xl shadow-lg shadow-green-900/30 transform active:scale-95 transition-all uppercase tracking-wider"
                >
                  LOAD & SPIN 🔄
                </button>
            </div>
        )}

        {/* GAME PHASE UI */}
        {status !== 'SETUP' && (
            <>
                <div className="relative my-auto">
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
                <div className="w-full space-y-4 mb-6">
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
                      <div className="bg-red-500/20 border border-red-500 p-4 rounded-xl backdrop-blur-sm">
                        <p className="text-red-200 font-bold text-lg">☠️ คุณตายแล้ว!</p>
                        <p className="text-white text-2xl font-black mt-2">หมดแก้วเดี๋ยวนี้</p>
                        
                        {bulletsLeft > 0 ? (
                             <p className="text-yellow-300 text-sm mt-2 font-bold animate-pulse">
                               ระวัง! ยังมีกระสุนอีก {bulletsLeft} นัด
                             </p>
                        ) : (
                             <p className="text-gray-300 text-sm mt-2">
                               กระสุนหมดแล้ว!
                             </p>
                        )}
                      </div>
                      
                      {bulletsLeft > 0 ? (
                          <button
                            onClick={moveToNextChamber}
                            className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-lg uppercase tracking-wider"
                          >
                             ส่งต่อให้คนต่อไป (Next) 💀
                          </button>
                      ) : (
                          <button
                            onClick={resetToSetup}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg uppercase tracking-wider"
                          >
                            จบเกม (Reset) 🔄
                          </button>
                      )}
                    </div>
                  )}
                  
                  {(status === 'SAFE') && (
                     <div className="w-full py-6 text-center text-gray-400 text-sm">
                       ส่งมือถือให้คนต่อไป...
                     </div>
                  )}
                </div>

                {/* Footer Stats */}
                {status !== 'BANG' && (
                    <div className="flex justify-between w-full px-4 text-xs text-gray-500 border-t border-white/5 pt-4">
                        <span>Bullets Left: {bulletsLeft}</span>
                        <button onClick={resetToSetup} className="text-gray-400 underline hover:text-white">Reset</button>
                    </div>
                )}
            </>
        )}

        {/* Close */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors z-50"
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
