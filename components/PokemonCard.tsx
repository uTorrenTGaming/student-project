import { Card } from '@/components/ui/card';
import type { Character } from '@/types/game';
import { Progress } from '@/components/ui/progress';

interface PokemonCardProps {
  pokemon: Character;
  isPlayer?: boolean;
  isAttacking?: boolean;
  isTakingDamage?: boolean;
  isFainted?: boolean;
  isActive?: boolean;
}

export function PokemonCard({ 
  pokemon, 
  isPlayer = false,
  isAttacking = false,
  isTakingDamage = false,
  isFainted = false,
  isActive = false
}: PokemonCardProps) {
  const hpPercentage = (pokemon.currentHp / pokemon.maxHp) * 100;
  
  // Determine HP color class
  const getHpColorClass = () => {
    if (hpPercentage <= 10) return 'hp-critical';
    if (hpPercentage <= 20) return 'hp-low';
    if (hpPercentage <= 50) return 'hp-medium';
    return 'hp-high';
  };

  // Build animation classes for sprite
  const spriteClasses = [
    'object-contain transition-all duration-300',
    isAttacking && (isPlayer ? 'slide-attack-player' : 'slide-attack-opponent'),
    isTakingDamage && 'shake-damage flash-hit',
    isFainted && 'fade-faint',
  ].filter(Boolean).join(' ');

  return (
    <Card className={`gb-screen p-4 space-y-3 transition-all ${isActive ? 'pulse-turn' : ''}`}>
      <div className="flex items-start justify-between relative">
        <div className="space-y-1">
          <h3 className="pixel-text text-lg uppercase">{pokemon.name}</h3>
          <div className="flex gap-2">
            {pokemon.element.map((type) => (
              <span 
                key={type}
                className="pixel-text text-xs px-2 py-0.5 bg-primary text-primary-foreground uppercase"
              >
                {type}
              </span>
            ))}
          </div>
          <p className="pixel-text text-sm">LV.{pokemon.level}</p>
        </div>
        
        {!isPlayer && (
          <div className="relative">
            <img 
              src={pokemon.sprite}
              alt={pokemon.name}
              className={`w-20 h-20 ${spriteClasses}`}
              style={{ imageRendering: 'pixelated' }}
            />
            {isActive && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
            )}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between pixel-text text-sm">
          <span>HP</span>
          <span>{pokemon.currentHp}/{pokemon.maxHp}</span>
        </div>
        <Progress 
          value={hpPercentage} 
          className={`h-3 bg-gb-dark ${getHpColorClass()}`}
        />
      </div>

      {isPlayer && (
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <img 
            src={pokemon.sprite}
            alt={pokemon.name}
            className={`w-24 h-24 ${spriteClasses}`}
            style={{ imageRendering: 'pixelated' }}
          />
          {isActive && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary animate-pulse" />
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 pixel-text text-xs">
        <div className="text-center">
          <div className="text-muted-foreground">ATK</div>
          <div>{pokemon.stats.atk}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">DEF</div>
          <div>{pokemon.stats.def}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">SPD</div>
          <div>{pokemon.stats.speed}</div>
        </div>
      </div>
    </Card>
  );
}
