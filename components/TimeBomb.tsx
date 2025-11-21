
import React, { useState, useEffect, useRef } from 'react';

interface TimeBombProps {
  onClose: () => void;
}

const TOPICS = [
  "ชื่อจังหวัดในประเทศไทย",
  "ยี่ห้อรถยนต์",
  "ชื่อสัตว์ที่มี 4 ขา",
  "ชื่อแฟนเก่า (ของใครก็ได้)",
  "ยี่ห้อเบียร์ / เหล้า",
  "ชื่อผลไม้",
  "ชื่อประเทศในเอเชีย",
  "เมนูอาหารตามสั่ง",
  "ชื่อดาราไทย",
  "ชื่อวงดนตรี",
  "สิ่งของในห้องน้ำ",
  "อวัยวะในร่างกาย",
  "ชื่อเพื่อนในวง (ห้ามซ้ำ)",
  "คำด่าที่เจ็บแสบ",
  "สถานที่ท่องเที่ยว",
  "ชื่อตัวละครในหนัง/การ์ตูน",
  "ยี่ห้อรองเท้า",
  "สีต่างๆ",
  "กิริยาอาการ (เดิน, นั่ง, ...)",
  "สัตว์น้ำ"
];

const TimeBomb: React.FC<TimeBombProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'IDLE' | 'TICKING' | 'EXPLODED'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(0); // Percentage or remaining time
  const [currentTopic, setCurrentTopic] = useState("");
  const [shakeIntensity, setShakeIntensity] = useState(0);
  
  // Internal refs to manage the game loop without triggering re-renders constantly
  const durationRef = useRef(0);
  const startTimeRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const startGame = () => {
    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    setCurrentTopic(randomTopic);
    setStatus('TICKING');
    
    // Random duration between 15 and 45 seconds
    const duration = (Math.floor(Math.random() * 30) + 15) * 1000;
    durationRef.current = duration;
    startTimeRef.current = Date.now();
    
    // Start visual update loop
    updateVisuals();

    // Set explosion timer
    timerRef.current = window.setTimeout(() => {
      explode();
    }, duration);
  };

  const updateVisuals = () => {
    if (status === 'EXPLODED') return;

    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(elapsed / durationRef.current, 1);
    
    // Increase shake intensity as time runs out
    // 0 to 1
    setShakeIntensity(progress);
    
    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(updateVisuals);
    }
  };

  const passBomb = () => {
    if (status !== 'TICKING') return;
    // Visual feedback for passing (maybe a brief flash or sound later)
    // Logic: The timer DOES NOT reset, but maybe we can add specific feedback
  };

  const explode = () => {
    setStatus('EXPLODED');
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    // Vibrate device if supported
    if (navigator.vibrate) navigator.vibrate(1000);
  };

  const resetGame = () => {
    setStatus('IDLE');
    setShakeIntensity(0);
  };

  // Calculate Bomb Color based on intensity
  const getBombColor = () => {
    if (status === 'EXPLODED') return 'text-red-600';
    // Transition from Gray -> Yellow -> Red
    if (shakeIntensity < 0.5) return 'text-gray-300';
    if (shakeIntensity < 0.8) return 'text-yellow-400';
    return 'text-red-500';
  };

  // Calculate Shake Style
  const getShakeStyle = () => {
    if (status !== 'TICKING') return {};
    const amount = 2 + (shakeIntensity * 15); // Max 17px shake
    const x = (Math.random() - 0.5) * amount;
    const y = (Math.random() - 0.5) * amount;
    return { transform: `translate(${x}px, ${y}px)` };
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-200 ${status === 'EXPLODED' ? 'bg-red-900/90' : 'bg-black/95'}`}>
      <div className="w-full max-w-md p-8 flex flex-col items-center justify-between h-[90dvh]">
        
        {/* Header */}
        <div className="text-center">
           <h2 className="text-3xl font-bold text-orange-500 uppercase tracking-widest drop-shadow-lg">
             Time Bomb
           </h2>
           <p className="text-gray-400 text-xs mt-1">ตอบคำถามแล้วรีบส่งต่อ!</p>
        </div>

        {/* Main Bomb Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
           
           {status === 'IDLE' && (
             <div className="text-center space-y-6">
                <div className="text-8xl">💣</div>
                <button 
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-xl rounded-full shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:scale-105 transition-transform animate-pulse"
                >
                  จุดชนวน
                </button>
             </div>
           )}

           {status === 'TICKING' && (
             <div className="text-center w-full" style={getShakeStyle()}>
                {/* Topic Card */}
                <div className="bg-gray-800/80 backdrop-blur border border-orange-500/30 p-6 rounded-2xl mb-8 shadow-lg">
                   <p className="text-gray-400 text-sm mb-2">หัวข้อ</p>
                   <h3 className="text-2xl font-bold text-white">{currentTopic}</h3>
                </div>

                {/* Bomb Graphic */}
                <div className={`text-9xl transition-colors duration-300 ${getBombColor()}`}>
                   💣
                </div>
                
                {/* Pass Button */}
                <button
                  onClick={passBomb}
                  className="mt-12 w-full py-6 bg-gray-700 hover:bg-gray-600 border-b-4 border-gray-900 active:border-b-0 active:translate-y-1 rounded-xl text-white text-2xl font-bold transition-all"
                >
                  ส่งต่อ! ➡️
                </button>
             </div>
           )}

           {status === 'EXPLODED' && (
             <div className="text-center animate-bounce">
                <div className="text-9xl mb-4">💥</div>
                <h2 className="text-5xl font-black text-white drop-shadow-[0_4px_0_rgb(0,0,0)] stroke-black">
                  BOOM!
                </h2>
                <div className="mt-8 bg-black/40 p-6 rounded-xl backdrop-blur-sm border border-white/20">
                   <p className="text-xl text-white font-bold">คนถือระเบิด...</p>
                   <p className="text-4xl text-yellow-400 font-black mt-2 uppercase">หมดแก้ว!</p>
                </div>
                <button 
                  onClick={resetGame}
                  className="mt-8 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                >
                   เล่นอีกครั้ง 🔄
                </button>
             </div>
           )}

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
    </div>
  );
};

export default TimeBomb;
