
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Player, CardType, GameContent, GameMode, AppTheme } from './types';
import PlayerSetup from './components/PlayerSetup';
import Card from './components/Card';
import SpinBottle from './components/SpinBottle';
import RussianRoulette from './components/RussianRoulette';
import KingsCup from './components/KingsCup';
import TimeBomb from './components/TimeBomb';
import DiceGame from './components/DiceGame';
import SettingsModal from './components/SettingsModal';
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
  const [theme, setTheme] = useState<AppTheme>('NORMAL');
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentContent, setCurrentContent] = useState<GameContent | null>(null);
  
  // Modals
  const [showSettings, setShowSettings] = useState(false);
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
  };

  const currentPlayer = players[currentPlayerIndex];

  const handleDrawCard = async (type: CardType) => {
    if (isFlipped) return;

    setIsLoading(true);
    setIsFlipped(true);

    setTimeout(() => {
      drawCardFromDeck(type);
      setIsLoading(false);
    }, 800); // Slightly longer delay for suspense
  };

  const drawCardFromDeck = (type: CardType) => {
    const currentDecks = { ...decks };
    let targetDeck = currentDecks[gameMode][type];

    if (targetDeck.length === 0) {
      const source = 
        gameMode === 'SOFT' 
          ? (type === 'TRUTH' ? TRUTH_SOFT : DARE_SOFT)
          : (type === 'TRUTH' ? TRUTH_HARD : DARE_HARD);
      targetDeck = shuffleArray(source);
    }

    const rawText = targetDeck.pop() || "Error: No card found";
    currentDecks[gameMode][type] = targetDeck;
    setDecks(currentDecks);

    const finalDescription = processContent(rawText, players, currentPlayerIndex);

    let title = "";
    let penalty = "หมดแก้ว!"; 

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
    }, 600); 
  };

  const handleSpinBottleResult = (index: number) => {
    setCurrentPlayerIndex(index);
    setShowSpinBottle(false);
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

  // --- Dynamic Styles based on Theme ---
  const getBackgroundClass = () => {
    switch(theme) {
      case 'LIGHT': return 'bg-gray-100';
      case 'DARK': return 'bg-[#000000]';
      default: return 'bg-[#050505]'; // Normal
    }
  };

  const getTextColor = (defaultColor: string = 'text-white') => {
    return theme === 'LIGHT' ? 'text-gray-900' : defaultColor;
  };

  const getSubTextColor = () => {
    return theme === 'LIGHT' ? 'text-gray-500' : 'text-gray-400';
  };

  const getGlassClass = () => {
    return theme === 'LIGHT' 
      ? 'bg-white/60 border-gray-300 shadow-sm' 
      : 'bg-white/5 border-white/5';
  };

  return (
    <div className={`min-h-[100dvh] ${getBackgroundClass()} transition-colors duration-500 text-white overflow-hidden relative font-sans selection:bg-blue-500/30 selection:text-blue-200`}>
      
      {/* Atmospheric Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
          
          {theme === 'NORMAL' && (
            <>
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-80 z-0"></div>
              {/* Animated Blobs */}
              <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] animate-float z-0"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] animate-float-delayed z-0"></div>
              {gameMode === 'HARD' && (
                <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[100px] animate-pulse-fast z-0"></div>
              )}
            </>
          )}

          {theme === 'LIGHT' && (
             <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 z-0"></div>
          )}
          
          {/* DARK mode has no extra blobs, just pure bg color set in parent */}
      </div>

      {/* Overlays */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} currentTheme={theme} onThemeChange={setTheme} />}
      {showSpinBottle && <SpinBottle players={players} onClose={() => setShowSpinBottle(false)} onPlayerSelected={handleSpinBottleResult} />}
      {showRoulette && <RussianRoulette onClose={() => setShowRoulette(false)} />}
      {showKingsCup && <KingsCup onClose={() => setShowKingsCup(false)} />}
      {showTimeBomb && <TimeBomb onClose={() => setShowTimeBomb(false)} />}
      {showDiceGame && <DiceGame onClose={() => setShowDiceGame(false)} />}

      <div className="relative z-10 container mx-auto px-4 py-6 min-h-[100dvh] flex flex-col">
        
        {/* Settings Gear Button - Always Visible */}
        <div className="absolute top-6 right-4 z-20">
          <button 
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-full transition-all ${theme === 'LIGHT' ? 'text-gray-600 hover:bg-gray-200' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.212 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {gameState === GameState.SETUP && (
          <div className="flex-1 flex items-center justify-center pt-12">
            {/* Pass minimal visual props if needed, or rely on component internal styles. 
                PlayerSetup is quite complex visually, so we let it keep its "Card" look, 
                but it will sit on the dynamic background. */}
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
          <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-between pt-4">
            
            {/* Top Bar */}
            <div className={`flex justify-between items-center mb-2 backdrop-blur-sm p-2 rounded-xl border ${getGlassClass()}`}>
               <button 
                 onClick={handleResetGame}
                 className={`text-[10px] transition-colors px-3 py-1.5 border rounded-lg ${theme === 'LIGHT' ? 'text-gray-600 border-gray-300 hover:bg-gray-200' : 'text-gray-500 hover:text-white border-white/5 hover:bg-white/5'}`}
               >
                 EXIT
               </button>
               
               <div className="flex space-x-1">
                 {[
                    {icon: '🍾', action: () => setShowSpinBottle(true)},
                    {icon: '🔫', action: () => setShowRoulette(true)},
                    {icon: '👑', action: () => setShowKingsCup(true)},
                    {icon: '💣', action: () => setShowTimeBomb(true)},
                    {icon: '🎲', action: () => setShowDiceGame(true)},
                 ].map((btn, idx) => (
                    <button 
                        key={idx}
                        onClick={btn.action}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-sm border ${theme === 'LIGHT' ? 'bg-gray-200 hover:bg-gray-300 text-black border-transparent' : 'bg-white/5 hover:bg-white/10 text-white border-white/5'}`}
                    >
                        {btn.icon}
                    </button>
                 ))}
               </div>
            </div>

            {/* Player Info */}
            <div className="text-center mb-2">
                <div className="inline-block relative">
                   <span className={`absolute inset-0 blur-lg opacity-20 rounded-full ${theme === 'LIGHT' ? 'bg-blue-600' : 'bg-blue-500'}`}></span>
                   <h2 className={`relative text-3xl font-black tracking-tight drop-shadow-lg ${getTextColor()}`}>
                     {currentPlayer?.name}
                   </h2>
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mt-1 animate-pulse ${theme === 'LIGHT' ? 'text-blue-600' : 'text-blue-400'}`}>
                  IT'S YOUR TURN
                </p>
            </div>

            {/* The Card Area */}
            <div className="flex-1 flex items-center justify-center perspective-container my-2">
              <Card 
                content={currentContent} 
                isFlipped={isFlipped} 
                isLoading={isLoading} 
              />
            </div>

            {/* Bottom Controls */}
            <div className="mt-auto pb-6 space-y-4">
              {!isFlipped ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleDrawCard('TRUTH')}
                    disabled={isFlipped}
                    className={`group relative overflow-hidden rounded-2xl p-6 border transition-all active:scale-95 shadow-lg ${theme === 'LIGHT' ? 'bg-white border-blue-200 shadow-blue-100' : 'bg-[#0a0a0a] border-blue-900/30 shadow-blue-900/10'}`}
                  >
                    <div className={`absolute inset-0 transition-colors ${theme === 'LIGHT' ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-blue-600/5 group-hover:bg-blue-600/10'}`}></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-4xl mb-2 filter drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">🤫</span>
                      <span className="text-xl font-black text-blue-500 tracking-widest group-hover:text-blue-400 transition-colors">TRUTH</span>
                      <span className={`text-[9px] mt-1 uppercase tracking-wider ${getSubTextColor()}`}>
                        Reveal Secrets
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDrawCard('DARE')}
                    disabled={isFlipped}
                    className={`group relative overflow-hidden rounded-2xl p-6 border transition-all active:scale-95 shadow-lg ${theme === 'LIGHT' ? 'bg-white border-red-200 shadow-red-100' : 'bg-[#0a0a0a] border-red-900/30 shadow-red-900/10'}`}
                  >
                     <div className={`absolute inset-0 transition-colors ${theme === 'LIGHT' ? 'bg-red-50 group-hover:bg-red-100' : 'bg-red-600/5 group-hover:bg-red-600/10'}`}></div>
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-4xl mb-2 filter drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">🔥</span>
                      <span className="text-xl font-black text-red-500 tracking-widest group-hover:text-red-400 transition-colors">DARE</span>
                      <span className={`text-[9px] mt-1 uppercase tracking-wider ${getSubTextColor()}`}>
                        Take Risks
                      </span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex justify-center px-8">
                  <button
                    onClick={handleNextTurn}
                    disabled={isLoading}
                    className={`w-full max-w-sm font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center space-x-3 transition-all transform active:scale-95 ${theme === 'LIGHT' ? 'bg-gray-900 text-white hover:bg-gray-800' : 'text-white bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 hover:border-white/20'}`}
                  >
                    <span className="uppercase tracking-widest text-sm">Next Player</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              )}
              
               <div className={`text-center ${theme === 'LIGHT' ? 'opacity-50 text-black' : 'opacity-30 text-white'}`}>
                  <p className="text-[9px] uppercase tracking-widest">
                    Round {Math.floor(currentPlayerIndex / players.length) + 1}
                  </p>
               </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
