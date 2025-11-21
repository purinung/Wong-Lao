
import React, { useState, useEffect } from 'react';

interface DiceGameProps {
  onClose: () => void;
}

const DiceGame: React.FC<DiceGameProps> = ({ onClose }) => {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [resultMessage, setResultMessage] = useState("แตะปุ่มเพื่อทอยเต๋า!");
  const [subMessage, setSubMessage] = useState("");
  const [resultColor, setResultColor] = useState("text-gray-400");

  // Random initial rotation for visual flair
  const [rotation1, setRotation1] = useState({ x: 0, y: 0 });
  const [rotation2, setRotation2] = useState({ x: 0, y: 0 });

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setResultMessage("กำลังทอย...");
    setSubMessage("");
    setResultColor("text-yellow-400");

    // Animation: Spin frantically
    const spinInterval = setInterval(() => {
        setDice1(Math.ceil(Math.random() * 6));
        setDice2(Math.ceil(Math.random() * 6));
        setRotation1({ x: Math.random() * 720, y: Math.random() * 720 });
        setRotation2({ x: Math.random() * 720, y: Math.random() * 720 });
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      
      const newD1 = Math.ceil(Math.random() * 6);
      const newD2 = Math.ceil(Math.random() * 6);
      
      setDice1(newD1);
      setDice2(newD2);
      
      // Reset rotation to flat faces for readability
      setRotation1({ x: 0, y: 0 });
      setRotation2({ x: 0, y: 0 });
      
      calculateResult(newD1, newD2);
      setIsRolling(false);
    }, 1500);
  };

  const calculateResult = (d1: number, d2: number) => {
    const sum = d1 + d2;
    
    // Rules logic
    if (sum === 7) {
        setResultMessage("SUM 7: ลัคกี้เซเว่น!");
        setSubMessage("🎉 หมดแก้วทันที! 🎉");
        setResultColor("text-red-500");
    } else if (d1 === d2) {
        setResultMessage(`DOUBLE ${d1}: ออกคู่!`);
        setSubMessage(`👉 แจกเพียว ${d1} ช็อต ให้ใครก็ได้`);
        setResultColor("text-green-400");
    } else if (sum === 9) {
        setResultMessage("SUM 9: เก้าก้าวหน้า");
        setSubMessage("➡️ คนทางขวา ดื่ม 1 แก้ว");
        setResultColor("text-orange-400");
    } else if (sum === 8) {
        setResultMessage("SUM 8: แปดเปื้อน");
        setSubMessage("⬅️ คนทางซ้าย ดื่ม 1 แก้ว");
        setResultColor("text-orange-400");
    } else if (sum === 11 || sum === 12) {
        setResultMessage(`SUM ${sum}: สูงเสียดฟ้า`);
        setSubMessage("💀 คนทอยโดนเอง 1 แก้ว");
        setResultColor("text-red-400");
    } else if (sum <= 4) {
        setResultMessage(`SUM ${sum}: ต่ำเตี้ยเรี่ยดิน`);
        setSubMessage("💀 คนทอยโดนเอง ครึ่งแก้ว");
        setResultColor("text-yellow-400");
    } else {
        setResultMessage(`SUM ${sum}: รอดตัว!`);
        setSubMessage("ส่งต่อให้เพื่อนคนต่อไป");
        setResultColor("text-blue-400");
    }
  };

  // Helper to render dots on dice face
  const renderDots = (num: number) => {
    const dots = [];
    // Positioning logic for flex/grid dots
    // Simple approach: 9 grid cells
    const positions = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8]
    };
    const activeDots = positions[num as keyof typeof positions] || [];

    for (let i = 0; i < 9; i++) {
        dots.push(
            <div key={i} className={`w-2 h-2 rounded-full ${activeDots.includes(i) ? (num === 1 ? 'bg-red-500' : 'bg-black') : 'bg-transparent'}`}></div>
        );
    }
    return <div className="grid grid-cols-3 gap-1 p-2 w-full h-full">{dots}</div>;
  };

  const Die = ({ val, rot }: { val: number, rot: {x: number, y: number} }) => (
    <div className="w-24 h-24 relative preserve-3d transition-all duration-500 ease-out" 
         style={{ transform: isRolling ? `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` : 'rotateX(0) rotateY(0)' }}>
        {/* Front */}
        <div className="absolute inset-0 bg-white rounded-xl border-2 border-gray-300 flex items-center justify-center backface-hidden shadow-inner">
             {renderDots(val)}
        </div>
        {/* Pseudo-3D sides (Visual trickery since we reset rotation to 0) */}
        <div className="absolute inset-0 bg-gray-200 rounded-xl transform translate-z-[-10px] scale-90 opacity-50"></div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-8 flex flex-col items-center justify-between h-[90dvh]">
        
        {/* Header */}
        <div className="text-center">
           <h2 className="text-3xl font-bold text-blue-400 uppercase tracking-widest drop-shadow-lg">
             DRINKING DICE
           </h2>
           <p className="text-gray-400 text-xs mt-1">เต๋าวัดดวง วงเหล้า</p>
        </div>

        {/* Dice Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full perspective-1000">
            <div className="flex space-x-8 mb-12">
                <Die val={dice1} rot={rotation1} />
                <Die val={dice2} rot={rotation2} />
            </div>

            {/* Result Display */}
            <div className={`text-center transition-all duration-300 ${isRolling ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                <h3 className={`text-3xl font-black uppercase mb-2 drop-shadow-md ${resultColor}`}>
                    {resultMessage}
                </h3>
                <p className="text-white text-xl font-medium bg-white/10 px-6 py-3 rounded-full backdrop-blur border border-white/10">
                    {subMessage || "..."}
                </p>
            </div>
        </div>

        {/* Controls */}
        <div className="w-full space-y-4">
             <button 
                onClick={rollDice}
                disabled={isRolling}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-2xl rounded-2xl shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {isRolling ? 'Rolling...' : 'ROLL DICE 🎲'}
             </button>
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default DiceGame;
