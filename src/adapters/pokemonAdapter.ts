// Adapter to convert PokeAPI data to game format

import type { PokemonAdapter, Move, Element, Stats } from '@/types/game';
import { pokeApi } from '@/services/pokeApi';

export async function adaptPokemon(raw: any): Promise<PokemonAdapter> {
  // Extract stats
  const stats: Stats = {
    hp: raw.stats.find((s: any) => s.stat.name === 'hp')?.base_stat ?? 45,
    atk: raw.stats.find((s: any) => s.stat.name === 'attack')?.base_stat ?? 50,
    def: raw.stats.find((s: any) => s.stat.name === 'defense')?.base_stat ?? 50,
    spAtk: raw.stats.find((s: any) => s.stat.name === 'special-attack')?.base_stat ?? 50,
    spDef: raw.stats.find((s: any) => s.stat.name === 'special-defense')?.base_stat ?? 50,
    speed: raw.stats.find((s: any) => s.stat.name === 'speed')?.base_stat ?? 50,
  };

  // Extract types
  const element: Element[] = raw.types.map((t: any) => t.type.name as Element);

  // Extract moves (limit to 4 moves, prioritizing learned moves)
  const movePromises = raw.moves
    .slice(0, 8) // Get first 8 to have options
    .map(async (m: any) => {
      try {
        const moveData = await pokeApi.fetchMove(m.move.name);
        return {
          id: moveData.name,
          name: formatName(moveData.name),
          element: moveData.type.name as Element,
          basePower: moveData.power ?? 40,
          accuracy: moveData.accuracy ?? 100,
          damageClass: moveData.damage_class.name as 'physical' | 'special' | 'status',
          effect: moveData.effect_entries[0]?.short_effect ?? undefined,
        };
      } catch (e) {
        console.warn(`Failed to fetch move ${m.move.name}:`, e);
        return null;
      }
    });

  const allMoves = (await Promise.all(movePromises)).filter(Boolean) as Move[];
  
  // Prioritize damaging moves and limit to 4
  const moves = allMoves
    .filter(m => m.basePower > 0)
    .slice(0, 4)
    .concat(allMoves.filter(m => m.basePower === 0).slice(0, 1)); // Add one status move if available

  // Get best sprite available
  const sprite = 
    raw.sprites.other?.['official-artwork']?.front_default ??
    raw.sprites.front_default ??
    raw.sprites.other?.dream_world?.front_default ??
    '/placeholder.svg';

  return {
    id: raw.id,
    name: formatName(raw.name),
    element,
    stats,
    moves: moves.slice(0, 4), // Ensure max 4 moves
    sprite,
  };
}

function formatName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Type effectiveness calculator
export function calculateEffectiveness(
  attackType: Element,
  defenderTypes: Element[]
): number {
  // Simplified type chart (can be expanded with full PokeAPI type data)
  const typeChart: Record<Element, { strong: Element[]; weak: Element[]; immune: Element[] }> = {
    normal: { strong: [], weak: ['rock', 'steel'], immune: ['ghost'] },
    fire: { strong: ['grass', 'ice', 'bug', 'steel'], weak: ['fire', 'water', 'rock', 'dragon'], immune: [] },
    water: { strong: ['fire', 'ground', 'rock'], weak: ['water', 'grass', 'dragon'], immune: [] },
    electric: { strong: ['water', 'flying'], weak: ['electric', 'grass', 'dragon'], immune: ['ground'] },
    grass: { strong: ['water', 'ground', 'rock'], weak: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'], immune: [] },
    ice: { strong: ['grass', 'ground', 'flying', 'dragon'], weak: ['fire', 'water', 'ice', 'steel'], immune: [] },
    fighting: { strong: ['normal', 'ice', 'rock', 'dark', 'steel'], weak: ['poison', 'flying', 'psychic', 'bug', 'fairy'], immune: ['ghost'] },
    poison: { strong: ['grass', 'fairy'], weak: ['poison', 'ground', 'rock', 'ghost'], immune: ['steel'] },
    ground: { strong: ['fire', 'electric', 'poison', 'rock', 'steel'], weak: ['grass', 'bug'], immune: ['flying'] },
    flying: { strong: ['grass', 'fighting', 'bug'], weak: ['electric', 'rock', 'steel'], immune: [] },
    psychic: { strong: ['fighting', 'poison'], weak: ['psychic', 'steel'], immune: ['dark'] },
    bug: { strong: ['grass', 'psychic', 'dark'], weak: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'], immune: [] },
    rock: { strong: ['fire', 'ice', 'flying', 'bug'], weak: ['fighting', 'ground', 'steel'], immune: [] },
    ghost: { strong: ['psychic', 'ghost'], weak: ['dark'], immune: ['normal'] },
    dragon: { strong: ['dragon'], weak: ['steel'], immune: ['fairy'] },
    dark: { strong: ['psychic', 'ghost'], weak: ['fighting', 'dark', 'fairy'], immune: [] },
    steel: { strong: ['ice', 'rock', 'fairy'], weak: ['fire', 'water', 'electric', 'steel'], immune: [] },
    fairy: { strong: ['fighting', 'dragon', 'dark'], weak: ['fire', 'poison', 'steel'], immune: [] },
  };

  let effectiveness = 1;
  
  for (const defenderType of defenderTypes) {
    const matchup = typeChart[attackType];
    if (matchup.immune.includes(defenderType)) {
      effectiveness *= 0;
    } else if (matchup.strong.includes(defenderType)) {
      effectiveness *= 2;
    } else if (matchup.weak.includes(defenderType)) {
      effectiveness *= 0.5;
    }
  }

  return effectiveness;
}
