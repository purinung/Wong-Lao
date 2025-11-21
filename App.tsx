
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Player, CardType, GameContent, GameMode } from './types';
import PlayerSetup from './components/PlayerSetup';
import Card from './components/Card';
import SpinBottle from './components/SpinBottle';
import RussianRoulette from './components/RussianRoulette';
import KingsCup from './components/KingsCup';
import TimeBomb from './components/TimeBomb';
import DiceGame from './components/DiceGame';
import { TRUTH_SOFT, TRUTH_HARD, DARE_SOFT, DARE_HARD } from './data/gameContent';
import { shuffleArray, processContent } from './utils/gameUtils';

// Define the structure of our Decks
type GameDecks = {
  SOFT: {
    TRUTH: string[];
    DARE: string[];
  };
  HARD: {
    TRUTH: string[];
    DARE: string[];
  };
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>('HARD');
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentContent, setCurrentContent] = useState<GameContent | null>(null);
  const [showSpinBottle, setShowSpinBottle] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [showKingsCup, setShowKingsCup] = useState(false);
  const [showTimeBomb, setShowTimeBomb] = useState(false);
  const [showDiceGame, setShowDiceGame] = useState(false);

  // State to hold the active shuffled decks
  const [decks, setDecks] = useState<GameDecks>({
    SOFT: { TRUTH: [], DARE: [] },
    HARD: { TRUTH: [], DARE: [] }
  });

  const handleStartGame = (playerList: Player[], mode: GameMode) => {
    setPlayers(playerList);
    setGameMode(mode);
    setGameState(GameState.PLAYING);
    
    // Initialize and Shuffle Decks
    initializeDecks();
  };

  const initializeDecks = () => {
    setDecks({
      SOFT: {
        TRUTH: shuffleArray(TRUTH_SOFT),
        DARE: shuffleArray(DARE_SOFT)
      },
      HARD: {
        TRUTH: shuffleArray(TRUTH_HARD),
        DARE: shuffleArray(DARE_HARD)
      }
    });
    console.log("Decks shuffled and initialized!");
  };

  // Get current player object
  const currentPlayer = players[currentPlayerIndex];

  const handleDrawCard = async (type: CardType) => {
    if (isFlipped) return;

    setIsLoading(true);
    setIsFlipped(true);

    // Simulate a brief "thinking" delay for effect (optional, but makes it feel less static)
    setTimeout(() => {
      drawCardFromDeck(type);
      setIsLoading(false);
    }, 600);
  };

  const drawCardFromDeck = (type: CardType) => {
    // Clone the current decks to modify them
    const currentDecks = { ...decks };
    let targetDeck = currentDecks[gameMode][type];

    // Check if deck is empty
    if (targetDeck.length === 0) {
      console.log(`${gameMode} ${type} deck empty! Reshuffling...`);
      // Reshuffle from source
      const source = 
        gameMode === 'SOFT' 
          ? (type === 'TRUTH' ? TRUTH_SOFT : DARE_SOFT)
          : (type === 'TRUTH' ? TRUTH_HARD : DARE_HARD);
      
      targetDeck = shuffleArray(source);
    }

    // Draw the card (pop from stack)
    const rawText = targetDeck.pop() || "Error: No card found";
    
    // Update state with the modified deck
    currentDecks[gameMode][type] = targetDeck;
    setDecks(currentDecks);

    // Process the text (replace placeholders)
    const finalDescription = processContent(rawText, players, currentPlayerIndex);

    // Determine Title and Penalty based on mode/type
    let title = "";
    let penalty = "หมดแก้ว!"; // Default

    if (type === 'TRUTH') {
      title = gameMode === 'SOFT' ? "ความจริงที่น่ารัก" : "ความจริงที่เจ็บปวด";
      penalty = "ถ้าไม่ตอบ ดื่ม 1 ช็อต";
    } else {
      title = gameMode === 'SOFT' ? "ภารกิจวัดดวง" : "ภารกิจวัดใจ";
      penalty = "ถ้าไม่ทำ หมดแก้ว";
    }

    setCurrentContent({
      type,
      title,
      description: finalDescription,
      penalty
    });
  };

  const handleNextTurn = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentContent(null);
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }, 600); // Wait for flip back animation
  };

  const handleSpinBottleResult = (index: number) => {
    setCurrentPlayerIndex(index);
    setShowSpinBottle(false);
    // If there was a card showing, reset it
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentContent(null);
    }, 300);
  };

  const handleResetGame = () => {
    setGameState(GameState.SETUP);
    setPlayers([]);
    setCurrentContent(null);
    setIsFlipped(false);
    setCurrentPlayerIndex(0);
    setShowSpinBottle(false);
    setShowRoulette(false);
    setShowKingsCup(false);
    setShowTimeBomb(false);
    setShowDiceGame(false);
  };

  return (
    // Use min-h-[100dvh] to properly handle mobile browser address bars
    <div className="min-h-[100dvh] bg-black text-white overflow-hidden relative selection:bg-purple-500 selection:text-white font-sans">
      {/* Background Ambience */}
      <div className={`fixed inset-0 pointer-events-none transition-colors duration-1000 ${
        gameMode === 'SOFT' 
        ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/40 via-gray-900 to-black' 
        : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/40 via-gray-900 to-black'
      }`}></div>
      
      <div className={`fixed top-0 left-0 w-full h-1 bg-gradient-to-r shadow-[0_0_20px_rgba(255,255,255,0.5)] ${
        gameMode === 'SOFT' 
        ? 'from-pink-400 via-purple-400 to-indigo-400 shadow-pink-500/50'
        : 'from-red-500 via-orange-500 to-yellow-500 shadow-red-500/50'
      }`}></div>

      {/* Spin Bottle Overlay */}
      {showSpinBottle && (
        <SpinBottle 
            players={players} 
            onClose={() => setShowSpinBottle(false)}
            onPlayerSelected={handleSpinBottleResult}
        />
      )}

      {/* Russian Roulette Overlay */}
      {showRoulette && (
        <RussianRoulette 
          onClose={() => setShowRoulette(false)}
        />
      )}

      {/* King's Cup Overlay */}
      {showKingsCup && (
        <KingsCup 
          onClose={() => setShowKingsCup(false)}
        />
      )}

       {/* Time Bomb Overlay */}
       {showTimeBomb && (
        <TimeBomb 
          onClose={() => setShowTimeBomb(false)}
        />
      )}

      {/* Dice Game Overlay */}
      {showDiceGame && (
        <DiceGame 
          onClose={() => setShowDiceGame(false)}
        />
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-[100dvh] flex flex-col">
        
        {gameState === GameState.SETUP && (
          <div className="flex-1 flex items-center justify-center">
            <PlayerSetup 
              onStartGame={handleStartGame} 
              onStartRoulette={() => setShowRoulette(true)}
              onStartKingsCup={() => setShowKingsCup(true)}
              onStartTimeBomb={() => setShowTimeBomb(true)}
              onStartDiceGame={() => setShowDiceGame(true)}
            />
          </div>
        )}

        {gameState === GameState.PLAYING && (
          <div className="flex-1 flex flex-col max-w-lg mx-auto w-full justify-between">
            
            {/* Header / Turn Indicator */}
            <div className="flex justify-between items-start mb-4 relative">
               <div className="flex space-x-2">
                 <button 
                   onClick={handleResetGame}
                   className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 border border-gray-800 rounded-lg bg-gray-900 hover:border-gray-600"
                 >
                   Quit
                 </button>
                 {/* Spin Bottle Trigger */}
                 <button 
                    onClick={() => setShowSpinBottle(true)}
                    className="text-xl bg-gray-800 border border-green-500/30 rounded-lg px-3 py-1 hover:bg-gray-700 transition-colors shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                    title="Spin the Bottle"
                 >
                    🍾
                 </button>
                 {/* Russian Roulette Trigger */}
                 <button 
                    onClick={() => setShowRoulette(true)}
                    className="text-xl bg-gray-800 border border-red-500/30 rounded-lg px-3 py-1 hover:bg-gray-700 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    title="Russian Roulette"
                 >
                    🔫
                 </button>
                 {/* King's Cup Trigger */}
                 <button 
                    onClick={() => setShowKingsCup(true)}
                    className="text-xl bg-gray-800 border border-yellow-500/30 rounded-lg px-3 py-1 hover:bg-gray-700 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                    title="King's Cup"
                 >
                    👑
                 </button>
                 {/* Time Bomb Trigger */}
                 <button 
                    onClick={() => setShowTimeBomb(true)}
                    className="text-xl bg-gray-800 border border-orange-500/30 rounded-lg px-3 py-1 hover:bg-gray-700 transition-colors shadow-[0_0_10px_rgba(234,88,12,0.2)]"
                    title="Time Bomb"
                 >
                    💣
                 </button>
                 {/* Dice Game Trigger */}
                 <button 
                    onClick={() => setShowDiceGame(true)}
                    className="text-xl bg-gray-800 border border-blue-500/30 rounded-lg px-3 py-1 hover:bg-gray-700 transition-colors shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                    title="Dice"
                 >
                    🎲
                 </button>
               </div>

               <div className="text-center flex-1 absolute left-0 right-0 pointer-events-none">
                  <div className="inline-flex items-center space-x-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border backdrop-blur-sm ${
                      gameMode === 'SOFT' 
                      ? 'border-pink-500/50 text-pink-400 bg-pink-500/10' 
                      : 'border-red-500/50 text-red-400 bg-red-500/10'
                    }`}>
                      MODE: {gameMode}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mt-1">
                    {currentPlayer?.name}
                  </h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">YOUR TURN</p>
               </div>
               
               {/* Spacer to balance layout */}
               <div className="w-[40px]"></div>
            </div>

            {/* The Card Area - Centered vertically in available space */}
            <div className="flex-1 flex items-center justify-center perspective-container my-2">
              <Card 
                content={currentContent} 
                isFlipped={isFlipped} 
                isLoading={isLoading} 
              />
            </div>

            {/* Controls */}
            <div className="mt-auto pb-4 space-y-4">
              {!isFlipped ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleDrawCard('TRUTH')}
                    disabled={isFlipped}
                    className="group relative overflow-hidden rounded-xl bg-gray-800 p-6 border border-blue-500/30 hover:border-blue-400 transition-all active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-3xl mb-2">🤫</span>
                      <span className="text-xl font-bold text-blue-400 tracking-widest">TRUTH</span>
                      <span className="text-[10px] text-gray-500 mt-1">
                        {decks[gameMode].TRUTH.length} cards left
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDrawCard('DARE')}
                    disabled={isFlipped}
                    className="group relative overflow-hidden rounded-xl bg-gray-800 p-6 border border-red-500/30 hover:border-red-400 transition-all active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-3xl mb-2">🔥</span>
                      <span className="text-xl font-bold text-red-400 tracking-widest">DARE</span>
                      <span className="text-[10px] text-gray-500 mt-1">
                        {decks[gameMode].DARE.length} cards left
                      </span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={handleNextTurn}
                    disabled={isLoading}
                    className={`w-full max-w-xs font-bold py-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all transform active:scale-95 text-white ${
                      gameMode === 'SOFT'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 shadow-pink-500/20'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 shadow-green-500/20'
                    }`}
                  >
                    <span>Next Player</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              )}
              
               {/* Footer Info */}
               <div className="text-center">
                  <p className="text-gray-600 text-xs">
                    Player {currentPlayerIndex + 1} of {players.length}
                  </p>
               </div>
            </div>
            
          </div>
        )}
      </div>
      
      {/* Custom CSS for 3D Rotation utilities */}
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
      `}</style>
    </div>
  );
};

export default App;
