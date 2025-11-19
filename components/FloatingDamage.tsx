import { useEffect } from 'react';

interface FloatingDamageProps {
  damage: number;
  effectiveness: number;
  position: 'player' | 'opponent';
  show: boolean;
  onComplete: () => void;
}

export function FloatingDamage({ damage, effectiveness, position, show, onComplete }: FloatingDamageProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  const sizeClass = effectiveness > 1 ? 'text-4xl' : effectiveness < 1 ? 'text-2xl' : 'text-3xl';
  const colorClass = effectiveness > 1 ? 'text-destructive' : effectiveness < 1 ? 'text-muted-foreground' : 'text-foreground';
  const positionClass = position === 'player' ? 'bottom-1/3' : 'top-1/3';

  return (
    <div 
      className={`absolute ${positionClass} left-1/2 -translate-x-1/2 pointer-events-none z-30 float-damage`}
    >
      <div 
        className={`pixel-text font-bold ${sizeClass} ${colorClass}`}
        style={{
          textShadow: '2px 2px 0 hsl(var(--gb-darkest)), -1px -1px 0 hsl(var(--gb-darkest))',
          filter: 'drop-shadow(0 0 8px currentColor)'
        }}
      >
        -{damage}
      </div>
      {effectiveness > 1 && (
        <div className="text-center pixel-text text-sm text-destructive mt-1">
          SUPER EFFECTIVE!
        </div>
      )}
      {effectiveness < 1 && (
        <div className="text-center pixel-text text-xs text-muted-foreground mt-1">
          Not very effective...
        </div>
      )}
    </div>
  );
}
