import React, { useState, useEffect } from 'react';

interface KingsCupProps {
  onClose: () => void;
}

type CardSuit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface PlayingCard {
  suit: CardSuit;
  rank: CardRank;
  id: number;
}

const RULES: Record<string, { title: string; desc: string; icon: string }> = {
  'A': { title: 'DRINK', desc: 'กินเอง (ผู้จับได้ต้องดื่มเอง 1 ช็อต/แก้ว)', icon: '🍺' },
  '2': { title: 'DUO', desc: 'Duo (เลือกเพื่อนกินเป็นเพื่อน 1 คน)', icon: '✌️' },
  '3': { title: 'TRIO', desc: 'Trio (เลือกเพื่อนกินเป็นเพื่อน 2 คน)', icon: '🤟' },
  '4': { title: 'LEFT', desc: 'ซ้าย (คนทางซ้ายของผู้จับไพ่ต้องดื่ม)', icon: '⬅️' },
  '5': { title: 'ALL', desc: 'เฮฮา (ดื่มพร้อมกันทุกคนรอบวง)', icon: '🍻' },
  '6': { title: 'RIGHT', desc: 'ขวา (คนทางขวาของผู้จับไพ่ต้องดื่ม)', icon: '➡️' },
  '7': { title: 'BUDDY', desc: 'Buddy (เลือกบัดดี้ 1 คน ถ้าเราดื่มเขาต้องดื่มด้วย)', icon: '🔗' },
  '8': { title: 'RELAX', desc: 'Relax (พักผ่อน 30 วินาที ห้ามใครสั่ง/ดื่ม)', icon: '🛑' },
  '9': { title: 'MINI GAME', desc: 'คิดมินิเกมมา 1 อย่าง ใครแพ้โดนดื่ม', icon: '🎮' },
  '10': { title: 'POWDER', desc: 'ทาแป้ง (บทลงโทษพิเศษ โดนทาแป้ง/เขียนหน้า)', icon: '🤡' },
  'J': { title: 'THE FACE', desc: 'คนจับเริ่ม "จับหน้า" หรือทำท่าทางตอนไหนก็ได้ คนอื่นต้องทำตาม ใครช้าสุดดื่ม', icon: '🫣' },
  'Q': { title: 'QUESTION', desc: 'ห้ามตอบคำถามคนจับไพ่ ใครเผลอตอบต้องดื่ม', icon: '❓' },
  'K': { title: 'RULE MAKER', desc: 'สั่งกฎพิเศษ 1 ข้อที่ทุกคนต้องทำตามตลอดเกม', icon: '👑' },
};

const KingsCup: React.FC<KingsCupProps> = ({ onClose }) => {
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [drawnCard, setDrawnCard] = useState<PlayingCard | null>(null);
  const [kingsCount, setKingsCount] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    initializeDeck();
  }, []);

  const initializeDeck = () => {
    const suits: CardSuit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
    const ranks: CardRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck: PlayingCard[] = [];
    
    let id = 0;
    suits.forEach(suit => {
      ranks.forEach(rank => {
        newDeck.push({ suit, rank, id: id++ });
      });
    });

    // Fisher-Yates Shuffle
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    setDeck(newDeck);
  };

  const drawCard = () => {
    if (deck.length === 0 || isFlipping) return;

    setIsFlipping(true);
    
    setTimeout(() => {
      const card = deck.pop();
      if (!card) return;

      setDeck([...deck]);
      setDrawnCard(card);
      setIsFlipping(false);

      if (card.rank === 'K') {
        const newCount = kingsCount + 1;
        setKingsCount(newCount);
      }
    }, 400); // Timing matched with CSS transition
  };

  const getSuitSymbol = (suit: CardSuit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'spades': return '♠';
      case 'clubs': return '♣';
    }
  };

  const getCardColor = (suit: CardSuit) => {
    return (suit === 'hearts' || suit === 'diamonds') ? 'text-red-600' : 'text-slate-900';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 flex flex-col items-center h-[90dvh] justify-between">
        
        {/* Header */}
        <div className="text-center w-full mb-4 z-10">
           <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 uppercase tracking-widest drop-shadow-sm">
             King's Cup
           </h2>
           <p className="text-gray-400 text-xs mt-1 font-mono">CARDS REMAINING: <span className="text-white font-bold">{deck.length}</span></p>
        </div>

        {/* Main Card Display */}
        <div className="relative w-64 h-96 perspective-1000 cursor-pointer group z-0" onClick={drawCard}>
          
          {/* Stack Simulation (Cards behind) */}
          {deck.length > 2 && (
             <div className="absolute top-0 left-0 w-full h-full rounded-2xl border border-white/10 bg-blue-900 transform rotate-3 translate-x-2 translate-y-2 -z-10 shadow-xl"></div>
          )}
          {deck.length > 5 && (
             <div className="absolute top-0 left-0 w-full h-full rounded-2xl border border-white/10 bg-blue-950 transform -rotate-2 translate-x-[-4px] translate-y-4 -z-20 shadow-xl"></div>
          )}

          <div className={`relative w-full h-full duration-700 preserve-3d transition-all ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${drawnCard && !isFlipping ? 'rotate-y-0 translate-y-0 scale-100' : 'rotate-y-180'} ${isFlipping ? 'scale-110 -translate-y-4' : ''}`}>
             
             {/* Card Back (Deck) */}
             {deck.length > 0 && (
               <div className={`absolute top-0 left-0 w-full h-full backface-hidden rounded-2xl border-[6px] border-white bg-[#0f172a] shadow-2xl flex items-center justify-center overflow-hidden`}
                    style={{ transform: 'rotateY(180deg)' }}>
                   {/* Detailed Pattern */}
                   <div className="absolute inset-0 opacity-20" 
                        style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                   <div className="absolute inset-2 border border-white/20 rounded-xl"></div>
                   <span className="text-7xl relative z-10 filter drop-shadow-lg animate-pulse">👑</span>
               </div>
             )}

             {/* Card Front (Active Card) */}
             {drawnCard && (
               <div className={`absolute top-0 left-0 w-full h-full backface-hidden rounded-2xl bg-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col justify-between p-5 select-none overflow-hidden ${drawnCard.rank === 'K' ? 'ring-4 ring-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.5)]' : ''}`}>
                  
                  {/* Paper Texture */}
                  <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ filter: 'contrast(120%) brightness(95%)' }}>
                     {/* Simulating paper grain with noise/gradient could go here */}
                  </div>

                  {/* Decorative Inner Border */}
                  <div className={`absolute inset-3 border-2 border-double ${getCardColor(drawnCard.suit)} opacity-30 rounded-lg pointer-events-none`}></div>

                  {/* Top Corner */}
                  <div className={`text-left text-5xl font-black leading-none z-10 ${getCardColor(drawnCard.suit)}`}>
                    <div className="tracking-tighter">{drawnCard.rank}</div>
                    <div className="text-3xl mt-1">{getSuitSymbol(drawnCard.suit)}</div>
                  </div>

                  {/* Center Watermark */}
                  <div className={`absolute inset-0 flex items-center justify-center z-0 opacity-20 ${getCardColor(drawnCard.suit)}`}>
                    <span className="text-[180px] leading-none transform scale-150">{getSuitSymbol(drawnCard.suit)}</span>
                  </div>

                  {/* Bottom Corner */}
                  <div className={`text-right text-5xl font-black leading-none z-10 ${getCardColor(drawnCard.suit)} transform rotate-180`}>
                    <div className="tracking-tighter">{drawnCard.rank}</div>
                    <div className="text-3xl mt-1">{getSuitSymbol(drawnCard.suit)}</div>
                  </div>
               </div>
             )}
          </div>
          
          {deck.length > 0 && !isFlipping && (
             <div className="absolute -bottom-16 left-0 right-0 text-center">
                <span className="text-gray-400 text-xs bg-white/10 px-3 py-1 rounded-full animate-bounce">TAP DECK TO DRAW</span>
             </div>
          )}
           {deck.length === 0 && (
             <div className="absolute -bottom-16 left-0 right-0 text-center text-red-400 font-bold animate-pulse text-sm">
                DECK EMPTY - GAME OVER
             </div>
          )}
        </div>

        {/* Rule Description Panel */}
        <div className={`w-full min-h-[180px] bg-gradient-to-b from-gray-800/90 to-gray-900/90 border border-white/10 rounded-3xl p-6 text-center backdrop-blur-xl mt-8 flex flex-col items-center justify-center transition-all duration-500 shadow-2xl transform ${drawnCard ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           {drawnCard ? (
             <>
                <div className="text-5xl mb-3 filter drop-shadow-md">{RULES[drawnCard.rank].icon}</div>
                <h3 className={`text-2xl font-black mb-2 tracking-wide uppercase ${drawnCard.rank === 'K' ? 'text-yellow-400 animate-pulse' : 'text-white'}`}>
                    {RULES[drawnCard.rank].title}
                </h3>
                <p className="text-gray-300 text-lg font-medium leading-relaxed">
                    {RULES[drawnCard.rank].desc}
                </p>
                
                {drawnCard.rank === 'K' && kingsCount === 4 && (
                   <div className="mt-4 w-full bg-red-600/90 text-white px-4 py-3 rounded-xl font-bold animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.6)] border border-red-400">
                      👑 KING ใบสุดท้าย! <br/> <span className="text-sm font-normal text-red-100">ใครจับได้ ดื่มกองกลางหมดแก้ว!</span>
                   </div>
                )}
             </>
           ) : (
             <p className="text-gray-500 italic text-sm">Tap the deck to reveal your fate.</p>
           )}
        </div>

        {/* Close Button (Improved) */}
        <button 
            onClick={onClose} 
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 border border-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all z-50 backdrop-blur-md shadow-lg active:scale-95"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .rotate-y-0 { transform: rotateY(0deg); }
      `}</style>
    </div>
  );
};

export default KingsCup;