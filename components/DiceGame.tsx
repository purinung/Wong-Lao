
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

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setResultMessage("กำลังทอย...");
    setSubMessage("");
    setResultColor("text-yellow-400");

    // Rolling duration
    setTimeout(() => {
      const newD1 = Math.ceil(Math.random() * 6);
      const newD2 = Math.ceil(Math.random() * 6);
      
      setDice1(newD1);
      setDice2(newD2);
      
      calculateResult(newD1, newD2);
      setIsRolling(false);
    }, 1500); // 1.5s roll time
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

  // Helper to render dots for a specific face number
  const FaceContent = ({ num }: { num: number }) => {
    const dots = [];
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
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${activeDots.includes(i) ? (num === 1 ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'bg-black') : 'bg-transparent'}`}></div>
        );
    }
    return <div className="grid grid-cols-3 gap-1 p-2 w-full h-full">{dots}</div>;
  };

  // A Single Face of the cube
  const DieFace = ({ num, transform }: { num: number, transform: string }) => (
      <div className="absolute w-full h-full bg-gray-100 border-2 border-gray-300 rounded-xl flex items-center justify-center backface-visible shadow-[inset_0_0_15px_rgba(0,0,0,0.1)]"
           style={{ transform }}>
          <FaceContent num={num} />
      </div>
  );

  // The 3D Die Component
  const Die = ({ val, isRolling, delay = 0 }: { val: number, isRolling: boolean, delay?: number }) => {
    // Mapping numbers to 3D rotations to bring that face to front
    // Standard Dice Orientation assumed:
    // 1 Front, 6 Back, 2 Right, 5 Left, 3 Top, 4 Bottom
    const getEndRotation = (n: number) => {
        switch(n) {
            case 1: return 'rotateX(0deg) rotateY(0deg)';
            case 6: return 'rotateX(180deg) rotateY(0deg)';
            case 2: return 'rotateX(0deg) rotateY(-90deg)';
            case 5: return 'rotateX(0deg) rotateY(90deg)';
            case 3: return 'rotateX(-90deg) rotateY(0deg)';
            case 4: return 'rotateX(90deg) rotateY(0deg)';
            default: return 'rotateX(0deg) rotateY(0deg)';
        }
    };

    return (
        <div className="w-24 h-24 relative perspective-container" style={{ perspective: '800px' }}>
             <div className={`w-full h-full relative preserve-3d transition-transform duration-[1000ms] ease-out ${isRolling ? 'animate-tumble' : ''}`}
                  style={{ 
                      transform: isRolling ? '' : getEndRotation(val),
                      animationDelay: isRolling ? `${delay}ms` : '0ms'
                  }}>
                 {/* The 6 Faces of a Cube (Size 96px -> TranslateZ 48px) */}
                 <DieFace num={1} transform="translateZ(48px)" />
                 <DieFace num={6} transform="rotateY(180deg) translateZ(48px)" />
                 <DieFace num={2} transform="rotateY(90deg) translateZ(48px)" />
                 <DieFace num={5} transform="rotateY(-90deg) translateZ(48px)" />
                 <DieFace num={3} transform="rotateX(90deg) translateZ(48px)" />
                 <DieFace num={4} transform="rotateX(-90deg) translateZ(48px)" />
             </div>
        </div>
    );
  };

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
        <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="flex space-x-12 mb-12">
                <Die val={dice1} isRolling={isRolling} />
                <Die val={dice2} isRolling={isRolling} delay={100} />
            </div>

            {/* Result Display */}
            <div className={`text-center transition-all duration-500 ${isRolling ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                <h3 className={`text-3xl font-black uppercase mb-2 drop-shadow-md ${resultColor}`}>
                    {resultMessage}
                </h3>
                <p className="text-white text-xl font-medium bg-white/10 px-6 py-3 rounded-full backdrop-blur border border-white/10 inline-block">
                    {subMessage || "..."}
                </p>
            </div>
        </div>

        {/* Controls */}
        <div className="w-full space-y-4">
             <button 
                onClick={rollDice}
                disabled={isRolling}
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-2xl rounded-2xl shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
             >
                <span className={isRolling ? 'animate-pulse' : 'group-hover:scale-110 inline-block transition-transform'}>
                    {isRolling ? 'Rolling...' : 'ROLL DICE 🎲'}
                </span>
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
        .preserve-3d { transform-style: preserve-3d; }
        .backface-visible { backface-visibility: visible; } /* Visible so we can see sides while rotating */
        
        @keyframes tumble {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg); }
          50% { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg); }
          75% { transform: rotateX(540deg) rotateY(270deg) rotateZ(135deg); }
          100% { transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg); }
        }
        .animate-tumble {
          animation: tumble 0.6s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DiceGame;
