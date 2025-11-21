export type CardType = 'TRUTH' | 'DARE';
export type GameMode = 'SOFT' | 'HARD';

export interface GameContent {
  type: CardType;
  title: string;
  description: string;
  penalty: string;
}

export interface Player {
  id: string;
  name: string;
}

export enum GameState {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING'
}