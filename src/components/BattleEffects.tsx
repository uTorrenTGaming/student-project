import { useEffect } from 'react';
import type { Element } from '@/types/game';
import { getElementEffectClass } from '@/constants/elementEffects';

interface BattleEffectsProps {
  effect: Element | 'impact' | null;
  position: 'player' | 'opponent';
  show: boolean;
  onComplete?: () => void;
}

export function BattleEffects({ effect, position, show, onComplete }: BattleEffectsProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show || !effect) return null;

  const effectClass = effect === 'impact' ? '' : getElementEffectClass(effect);
  const positionClass = position === 'player' ? 'bottom-1/3' : 'top-1/3';

  return (
    <div 
      className={`absolute ${positionClass} left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none z-20`}
    >
      {/* Main Effect Circle */}
      <div 
        className={`w-full h-full rounded-full ${effectClass} opacity-80`}
        style={{
          background: `radial-gradient(circle, ${getElementColor(effect)} 0%, transparent 70%)`
        }}
      />
      
      {/* Particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
          style={{
            background: getElementColor(effect),
            transform: `rotate(${i * 45}deg) translateX(${30 + Math.random() * 20}px)`,
            animation: `float-up 0.6s ease-out ${i * 0.05}s forwards`,
            opacity: 0.8
          }}
        />
      ))}
    </div>
  );
}

function getElementColor(effect: Element | 'impact'): string {
  const colors: Record<Element | 'impact', string> = {
    fire: 'hsl(0 70% 50%)',
    water: 'hsl(210 80% 50%)',
    electric: 'hsl(50 100% 50%)',
    grass: 'hsl(120 60% 40%)',
    ice: 'hsl(180 70% 60%)',
    fighting: 'hsl(10 60% 40%)',
    poison: 'hsl(280 50% 50%)',
    ground: 'hsl(30 50% 40%)',
    flying: 'hsl(220 60% 60%)',
    psychic: 'hsl(300 60% 50%)',
    bug: 'hsl(70 50% 40%)',
    rock: 'hsl(35 40% 35%)',
    ghost: 'hsl(270 40% 40%)',
    dragon: 'hsl(250 60% 50%)',
    dark: 'hsl(0 0% 20%)',
    steel: 'hsl(220 20% 60%)',
    fairy: 'hsl(320 60% 70%)',
    normal: 'hsl(40 20% 50%)',
    impact: 'hsl(var(--gb-darkest))'
  };
  
  return colors[effect] || colors.normal;
}
