import React, { useState } from 'react';
import { Player } from '../types';

interface SpinBottleProps {
  players: Player[];
  onClose: () => void;
  onPlayerSelected: (index: number) => void;
}

const SpinBottle: React.FC<SpinBottleProps> = ({ players, onClose, onPlayerSelected }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Player | null>(null);

  // Simple Beer Bottle SVG
  const BottleSVG = () => (
    <svg viewBox="0 0 100 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]">
      <path d="M35,0 L65,0 L70,80 L90,100 L90,280 Q90,300 70,300 L30,300 Q10,300 10,280 L10,100 L30,80 Z" fill="#10b981" opacity="0.9" stroke="white" strokeWidth="2" />
      <rect x="10" y="140" width="80" height="90" fill="#065f46" />
      <text x="50" y="185" fontSize="24" fontWeight="bold" fill="#fbbf24" textAnchor="middle" transform="rotate(-90 50 185)">LAGER</text>
      <rect x="35" y="-5" width="30" height="10" fill="#fbbf24" rx="2" />
    </svg>
  );

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    const randomIndex = Math.floor(Math.random() * players.length);
    const segmentAngle = 360 / players.length;
    
    // Calculation logic:
    // Players are arranged clockwise starting from Top (0deg / -90deg in CSS circle terms).
    // Bottle points UP (0deg) by default.
    // To point to Player i, we need to rotate i * segmentAngle.
    // Add 5-8 full rotations for effect.
    const spins = (5 + Math.floor(Math.random() * 3)) * 360;
    const targetAngle = (randomIndex * segmentAngle);
    
    // Logic to ensure we always spin forward (add to current rotation)
    // Current Rotation % 360 is the current offset. We want to reach targetAngle.
    // We calculate the delta needed to reach targetAngle from 0, then add spins.
    
    // Simplified: Just add big number + target.
    // Note: We need to account for current rotation to make it smooth.
    const currentRel = rotation % 360;
    const needed = targetAngle - currentRel;
    const finalRotation = rotation + needed + spins + (needed < 0 ? 360 : 0);

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(players[randomIndex]);
    }, 3500);
  };
  
  const handleConfirm = () => {
    if (winner) {
        const index = players.findIndex(p => p.id === winner.id);
        onPlayerSelected(index);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
        
        {/* Players Circle */}
        {players.map((p, i) => {
            const angleDeg = (i * 360) / players.length;
            const angleRad = (angleDeg - 90) * (Math.PI / 180); // -90 to start at top
            const radius = 130; // Radius of circle
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            
            const isWinner = winner?.id === p.id;

            return (
                <div 
                    key={p.id}
                    className="absolute flex flex-col items-center justify-center transition-all duration-500"
                    style={{
                        transform: `translate(${x}px, ${y}px)`
                    }}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isWinner 
                        ? 'bg-green-500 border-white scale-125 shadow-[0_0_20px_rgba(34,197,94,1)] z-20' 
                        : 'bg-gray-800 border-gray-600'
                    }`}>
                        <span className="text-xs font-bold text-white">{p.name.charAt(0)}</span>
                    </div>
                    <div className={`mt-1 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap max-w-[80px] truncate transition-colors ${
                        isWinner ? 'bg-green-900/80 text-green-300' : 'text-gray-400 bg-black/50'
                    }`}>
                        {p.name}
                    </div>
                </div>
            );
        })}

        {/* The Bottle */}
        <div 
            className="w-24 h-64 cursor-pointer z-10 filter drop-shadow-2xl"
            style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 3.5s cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}
            onClick={spin}
        >
            <BottleSVG />
        </div>
        
        {/* UI Controls */}
        <div className="absolute bottom-[-60px] w-full flex flex-col items-center space-y-3">
            {!isSpinning && !winner && (
                <p className="text-green-400 text-sm animate-pulse font-medium tracking-wider">
                    TAP BOTTLE TO SPIN
                </p>
            )}
            
            {winner && (
                <div className="flex flex-col items-center animate-fade-in">
                     <div className="bg-gray-800/90 border border-green-500/50 px-6 py-3 rounded-xl text-center mb-3 backdrop-blur">
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">The Victim Is</p>
                        <h3 className="text-2xl font-bold text-green-400">{winner.name}</h3>
                     </div>
                     <button 
                        onClick={handleConfirm}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-green-500/30 transform active:scale-95 transition-all"
                     >
                        LET'S PLAY
                     </button>
                </div>
            )}
        </div>
        
        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-[-40px] right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default SpinBottle;