// Core game types and interfaces

export type Element = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice' 
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' 
  | 'bug' | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface Stats {
  hp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
  speed: number;
}

export interface Move {
  id: string;
  name: string;
  element: Element;
  basePower: number;
  accuracy: number;
  damageClass: 'physical' | 'special' | 'status';
  effect?: string;
}

export interface Character {
  id: number;
  name: string;
  element: Element[];
  stats: Stats;
  moves: Move[];
  sprite: string;
  level: number;
  currentHp: number;
  maxHp: number;
}

export interface PokemonAdapter {
  id: number;
  name: string;
  element: Element[];
  stats: Stats;
  moves: Move[];
  sprite: string;
}

export interface TypeEffectiveness {
  [key: string]: {
    doubleDamageTo: Element[];
    halfDamageFrom: Element[];
    noDamageTo: Element[];
  };
}

export interface BattleState {
  player: Character;
  opponent: Character;
  turn: 'player' | 'opponent';
  log: string[];
  isActive: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}
