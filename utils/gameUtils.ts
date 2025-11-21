
import { Player } from '../types';

// Shuffle an array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Process content by replacing placeholders with actual player names
export function processContent(
  content: string,
  allPlayers: Player[],
  currentPlayerIndex: number
): string {
  if (allPlayers.length === 0) return content;

  const currentPlayer = allPlayers[currentPlayerIndex];
  const otherPlayers = allPlayers.filter(p => p.id !== currentPlayer.id);
  
  let processed = content;

  // Replace {target} with a random OTHER player
  if (processed.includes('{target}')) {
    const target = otherPlayers.length > 0 
      ? otherPlayers[Math.floor(Math.random() * otherPlayers.length)].name 
      : "เพื่อนในจินตนาการ";
    // Replace ALL occurrences
    processed = processed.split('{target}').join(target);
  }

  // Replace {left} (Previous index)
  if (processed.includes('{left}')) {
    const leftIndex = (currentPlayerIndex - 1 + allPlayers.length) % allPlayers.length;
    const leftPlayer = allPlayers[leftIndex].name;
    processed = processed.split('{left}').join(leftPlayer);
  }

  // Replace {right} (Next index)
  if (processed.includes('{right}')) {
    const rightIndex = (currentPlayerIndex + 1) % allPlayers.length;
    const rightPlayer = allPlayers[rightIndex].name;
    processed = processed.split('{right}').join(rightPlayer);
  }

  // Optional: Replace {player} with current player name (rarely used in prompt but good to have)
  if (processed.includes('{player}')) {
    processed = processed.split('{player}').join(currentPlayer.name);
  }

  return processed;
}
