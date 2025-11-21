
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
    }, 300);
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
    return (suit === 'hearts' || suit === 'diamonds') ? 'text-red-500' : 'text-black';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 flex flex-col items-center h-[90dvh] justify-between">
        
        {/* Header */}
        <div className="text-center w-full flex justify-between items-start">
          <div>
             <h2 className="text-3xl font-bold text-yellow-400 uppercase tracking-widest drop-shadow-lg">
               King's Cup
             </h2>
             <p className="text-gray-400 text-xs">ไพ่เหลือ {deck.length} ใบ</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-600/50 px-3 py-1 rounded-lg flex flex-col items-center">
             <span className="text-xs text-yellow-200">KINGS COUNT</span>
             <div className="flex space-x-1 mt-1">
                {[1, 2, 3, 4].map(i => (
                   <span key={i} className={`text-sm ${i <= kingsCount ? 'text-yellow-400' : 'text-gray-700'}`}>♛</span>
                ))}
             </div>
          </div>
        </div>

        {/* Main Card Display */}
        <div className="relative w-64 h-96 perspective-1000 cursor-pointer group" onClick={drawCard}>
          <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${drawnCard && !isFlipping ? 'rotate-y-0' : ''} ${!drawnCard ? 'rotate-y-180' : ''}`}>
             
             {/* Card Back (Deck) */}
             {deck.length > 0 && (
               <div className={`absolute top-0 left-0 w-full h-full backface-hidden rounded-2xl border-4 border-white bg-blue-900 shadow-2xl flex items-center justify-center ${isFlipping ? 'animate-pulse' : ''}`}
                    style={{ transform: 'rotateY(180deg)' }}>
                   <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-50 absolute"></div>
                   <span className="text-6xl relative z-10">👑</span>
               </div>
             )}

             {/* Card Front (Active Card) */}
             {drawnCard && (
               <div className="absolute top-0 left-0 w-full h-full backface-hidden rounded-2xl bg-white shadow-[0_0_40px_rgba(234,179,8,0.4)] flex flex-col justify-between p-4 select-none">
                  {/* Top Corner */}
                  <div className={`text-left text-4xl font-bold leading-none ${getCardColor(drawnCard.suit)}`}>
                    <div>{drawnCard.rank}</div>
                    <div>{getSuitSymbol(drawnCard.suit)}</div>
                  </div>

                  {/* Center Symbol */}
                  <div className={`text-center text-8xl ${getCardColor(drawnCard.suit)}`}>
                    {getSuitSymbol(drawnCard.suit)}
                  </div>

                  {/* Bottom Corner */}
                  <div className={`text-right text-4xl font-bold leading-none ${getCardColor(drawnCard.suit)} transform rotate-180`}>
                    <div>{drawnCard.rank}</div>
                    <div>{getSuitSymbol(drawnCard.suit)}</div>
                  </div>
               </div>
             )}
             
             {/* Empty State */}
             {deck.length === 0 && drawnCard && (
                 // Drawn card stays visible, but no back card behind it.
                 <></>
             )}
          </div>
          
          {deck.length > 0 && !isFlipping && (
             <div className="absolute -bottom-12 left-0 right-0 text-center text-gray-400 animate-bounce text-sm">
                TAP TO DRAW
             </div>
          )}
           {deck.length === 0 && (
             <div className="absolute -bottom-12 left-0 right-0 text-center text-red-400 font-bold animate-pulse text-sm">
                DECK EMPTY - GAME OVER
             </div>
          )}
        </div>

        {/* Rule Description */}
        <div className="w-full min-h-[180px] bg-gray-800/80 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-lg mt-4 flex flex-col items-center justify-center transition-all">
           {drawnCard ? (
             <>
                <div className="text-5xl mb-2">{RULES[drawnCard.rank].icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2 text-yellow-400">{RULES[drawnCard.rank].title}</h3>
                <p className="text-gray-200 text-lg">{RULES[drawnCard.rank].desc}</p>
                
                {drawnCard.rank === 'K' && kingsCount === 4 && (
                   <div className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold animate-pulse shadow-lg shadow-red-500/50">
                      ☠️ KING ใบสุดท้าย! ดื่มกองกลาง! ☠️
                   </div>
                )}
             </>
           ) : (
             <p className="text-gray-500">Jokers not included. Standard 52-card rules apply.</p>
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

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default KingsCup;
