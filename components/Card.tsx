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
    <div className="relative w-full max-w-sm h-[480px] sm:h-[550px] group perspective-1000 mx-auto my-4 transform-gpu">
      <div
        className={`relative w-full h-full duration-700 preserve-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of Card (The Back Pattern) - Dark, Stylish, Premium */}
        <div className="absolute w-full h-full backface-hidden rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 bg-[#0a0a0a]">
          
          {/* Geometric Pattern Background */}
          <div className="absolute inset-0 opacity-30" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', 
                 backgroundSize: '24px 24px' 
               }}>
          </div>
          
          {/* Center Logo Area */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-black/50 to-black/80">
            <div className="relative w-32 h-32 mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-2 rounded-full border-2 border-purple-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-5xl filter drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">🍻</span>
              </div>
            </div>
            
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 tracking-tighter drop-shadow-lg">
              Wong Lao
            </h2>
            <div className="h-1 w-12 bg-gray-700 rounded-full my-4"></div>
            <p className="text-gray-500 text-xs tracking-[0.3em] font-bold uppercase animate-pulse">
              Tap to Draw
            </p>
          </div>
          
          {/* Border Glow */}
          <div className="absolute inset-0 rounded-[24px] border border-white/5 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"></div>
        </div>

        {/* Back of Card (The Content) - Matte Black, Neon Text */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-[24px] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden bg-[#111] border border-gray-700/50 ${
          !isLoading && content ? 'animate-reveal-impact' : ''
        }`}>
           
           {/* Ambient Glow based on Type */}
           <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-40 pointer-events-none ${
              content?.type === 'TRUTH' ? 'bg-blue-600' : 'bg-red-600'
           }`}></div>
           <div className={`absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-[80px] opacity-30 pointer-events-none ${
              content?.type === 'TRUTH' ? 'bg-cyan-600' : 'bg-orange-600'
           }`}></div>

           <div className="relative h-full flex flex-col items-center justify-between p-8 text-center z-10">
            {isLoading ? (
               <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                 <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
                 </div>
                 <p className="text-gray-400 text-sm tracking-wider animate-pulse">GENERATING...</p>
               </div>
            ) : content ? (
              <>
                {/* Header Tag */}
                <div className="mt-2">
                  <span className={`px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md ${
                    content.type === 'TRUTH' 
                    ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30 shadow-blue-900/20' 
                    : 'bg-red-900/40 text-red-300 border border-red-500/30 shadow-red-900/20'
                  }`}>
                    {content.type}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mt-6 drop-shadow-md">
                  {content.title}
                </h3>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center my-2 w-full">
                  <div className="relative">
                    {/* Quote marks decorative */}
                    <span className="absolute -top-4 -left-2 text-4xl text-gray-700 opacity-50 font-serif">"</span>
                    <p className="text-lg sm:text-xl text-gray-100 font-medium leading-relaxed px-4 drop-shadow-md">
                      {content.description}
                    </p>
                    <span className="absolute -bottom-4 -right-2 text-4xl text-gray-700 opacity-50 font-serif">"</span>
                  </div>
                </div>

                {/* Penalty Section */}
                <div className="w-full bg-black/40 backdrop-blur-md rounded-xl p-5 border border-white/5 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 text-left pl-2">Penalty</p>
                  <p className="text-yellow-400 font-bold text-lg text-left pl-2 flex items-center">
                    <span className="mr-2">⚠️</span> {content.penalty}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center opacity-30">
                 <p className="text-sm tracking-widest">WAITING FOR INPUT</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .transform-gpu { transform: translateZ(0); }
        
        @keyframes reveal-impact {
          0% { transform: rotateY(180deg) scale(0.95); opacity: 0.5; }
          60% { transform: rotateY(180deg) scale(1.02); opacity: 1; }
          100% { transform: rotateY(180deg) scale(1); opacity: 1; }
        }
        .animate-reveal-impact { animation: reveal-impact 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default Card;