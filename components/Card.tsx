import React from 'react';
import { GameContent } from '../types';

interface CardProps {
  content: GameContent | null;
  isFlipped: boolean;
  isLoading: boolean;
  onFlipComplete?: () => void;
}

const Card: React.FC<CardProps> = ({ content, isFlipped, isLoading }) => {
  return (
    /* 
      Mobile Fixes:
      1. h-[460px]: Forces a specific height on mobile so it doesn't collapse to 0.
      2. sm:h-auto sm:aspect-[3/4]: On larger screens, go back to aspect ratio.
      3. transform-gpu: Forces hardware acceleration to prevent flickering/disappearing on iOS.
    */
    <div className="relative w-full max-w-sm h-[460px] sm:h-auto sm:aspect-[3/4] group perspective-1000 mx-auto my-8 transform-gpu">
      <div
        className={`relative w-full h-full duration-700 preserve-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of Card (The Back Pattern) */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-500/30 bg-gray-900">
          <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
            <div className="w-24 h-24 rounded-full border-4 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-pulse">
              <span className="text-4xl">🍻</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase tracking-widest">
              Wong Lao
            </h2>
            <p className="text-gray-400 text-sm mt-2 tracking-widest">TAP BUTTON TO DRAW</p>
          </div>
        </div>

        {/* Back of Card (The Content) */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] overflow-hidden bg-gray-900 border border-white/10 ${
          !isLoading && content ? 'animate-reveal-impact' : ''
        }`}>
           {/* Dynamic Background based on type */}
           <div className={`absolute inset-0 opacity-20 ${content?.type === 'TRUTH' ? 'bg-blue-600' : 'bg-red-600'}`}></div>
           
           <div className="relative h-full flex flex-col items-center justify-between p-8 text-center z-10">
            {isLoading ? (
               <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                 <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                 <p className="text-white animate-pulse">กำลังชง...</p>
               </div>
            ) : content ? (
              <>
                <div className="flex flex-col items-center">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wider mb-4 ${
                    content.type === 'TRUTH' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/50'
                  }`}>
                    {content.type}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                    {content.title}
                  </h3>
                </div>

                <div className="flex-1 flex items-center justify-center my-4">
                  <p className="text-xl text-gray-100 font-medium leading-relaxed">
                    "{content.description}"
                  </p>
                </div>

                <div className="w-full bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Penalty / บทลงโทษ</p>
                  <p className="text-yellow-400 font-bold text-lg animate-pulse">
                    ⚠️ {content.penalty}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                 <p className="text-gray-500">Select a card type</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        /* Force hardware acceleration for smoother animations on mobile */
        .transform-gpu {
          transform: translateZ(0);
        }
        
        @keyframes reveal-impact {
          0% { transform: rotateY(180deg) scale(0.98); box-shadow: 0 0 30px rgba(168,85,247,0.4); }
          40% { transform: rotateY(180deg) scale(1.04); box-shadow: 0 0 60px rgba(255,255,255,0.5); }
          60% { transform: rotateY(180deg) scale(1.02) rotate(1deg); }
          80% { transform: rotateY(180deg) scale(1.01) rotate(-1deg); }
          100% { transform: rotateY(180deg) scale(1); box-shadow: 0 0 30px rgba(168,85,247,0.4); }
        }
        .animate-reveal-impact {
          animation: reveal-impact 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Card;