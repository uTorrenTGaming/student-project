import type { Element } from '@/types/game';

export function getElementEffectClass(element: Element): string {
  const effectMap: Partial<Record<Element, string>> = {
    fire: 'fire-effect',
    water: 'water-effect',
    electric: 'electric-effect',
    grass: 'grass-effect',
  };
  
  return effectMap[element] || '';
}

export function getElementParticleCount(element: Element): number {
  const countMap: Partial<Record<Element, number>> = {
    fire: 12,
    water: 10,
    electric: 8,
    grass: 10,
    ice: 10,
    normal: 6,
  };
  
  return countMap[element] || 8;
}
