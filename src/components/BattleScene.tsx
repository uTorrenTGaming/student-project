import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PokemonCard } from './PokemonCard';
import { BattleEffects } from './BattleEffects';
import { FloatingDamage } from './FloatingDamage';
import type { Character, Move, Element } from '@/types/game';
import { calculateEffectiveness } from '@/adapters/pokemonAdapter';
import { toast } from 'sonner';

interface AnimationState {
  playerAttacking: boolean;
  opponentAttacking: boolean;
  playerDamaged: boolean;
  opponentDamaged: boolean;
  showEffect: boolean;
  effectElement: Element | null;
  effectPosition: 'player' | 'opponent' | null;
  showDamage: boolean;
  damageAmount: number;
  damageEffectiveness: number;
  damagePosition: 'player' | 'opponent' | null;
  screenShake: boolean;
}

interface BattleSceneProps {
  player: Character;
  opponent: Character;
  onBattleEnd: (won: boolean) => void;
}

export function BattleScene({ player: initialPlayer, opponent: initialOpponent, onBattleEnd }: BattleSceneProps) {
  const [player, setPlayer] = useState(initialPlayer);
  const [opponent, setOpponent] = useState(initialOpponent);
  const [turn, setTurn] = useState<'player' | 'opponent'>('player');
  const [log, setLog] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [animationState, setAnimationState] = useState<AnimationState>({
    playerAttacking: false,
    opponentAttacking: false,
    playerDamaged: false,
    opponentDamaged: false,
    showEffect: false,
    effectElement: null,
    effectPosition: null,
    showDamage: false,
    damageAmount: 0,
    damageEffectiveness: 1,
    damagePosition: null,
    screenShake: false,
  });

  const addLog = (message: string) => {
    setLog(prev => [...prev.slice(-3), message]);
  };

  const calculateDamage = (attacker: Character, defender: Character, move: Move): number => {
    const effectiveness = calculateEffectiveness(move.element, defender.element);
    
    const attackStat = move.damageClass === 'physical' ? attacker.stats.atk : attacker.stats.spAtk;
    const defenseStat = move.damageClass === 'physical' ? defender.stats.def : defender.stats.spDef;
    
    const baseDamage = Math.floor(
      ((2 * attacker.level / 5 + 2) * move.basePower * attackStat / defenseStat / 50) + 2
    );
    
    const randomFactor = 0.85 + Math.random() * 0.15;
    const damage = Math.floor(baseDamage * effectiveness * randomFactor);
    
    return Math.max(1, damage);
  };

  const executeMove = async (attacker: Character, defender: Character, move: Move, isPlayer: boolean) => {
    setAnimating(true);
    
    // Check accuracy
    const hitRoll = Math.random() * 100;
    if (hitRoll > move.accuracy) {
      addLog(`${attacker.name}'s ${move.name} missed!`);
      toast.error(`${move.name} missed!`);
      setAnimating(false);
      return defender;
    }

    const damage = calculateDamage(attacker, defender, move);
    const newHp = Math.max(0, defender.currentHp - damage);
    const effectiveness = calculateEffectiveness(move.element, defender.element);
    
    let effectText = '';
    if (effectiveness > 1) effectText = "It's super effective!";
    else if (effectiveness < 1) effectText = "It's not very effective...";
    
    addLog(`${attacker.name} used ${move.name}!`);
    
    // Animation Sequence
    // 1. Attacker moves forward
    setAnimationState(prev => ({
      ...prev,
      playerAttacking: isPlayer,
      opponentAttacking: !isPlayer,
    }));
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 2. Show effect at defender position
    setAnimationState(prev => ({
      ...prev,
      showEffect: true,
      effectElement: move.element,
      effectPosition: isPlayer ? 'opponent' : 'player',
    }));
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 3. Defender takes damage (shake + flash)
    setAnimationState(prev => ({
      ...prev,
      playerDamaged: !isPlayer,
      opponentDamaged: isPlayer,
      showEffect: false,
    }));
    
    if (effectText) addLog(effectText);
    addLog(`${defender.name} took ${damage} damage!`);
    
    // 4. Show floating damage numbers
    setAnimationState(prev => ({
      ...prev,
      showDamage: true,
      damageAmount: damage,
      damageEffectiveness: effectiveness,
      damagePosition: isPlayer ? 'opponent' : 'player',
    }));
    
    // 5. Update HP with smooth transition
    const updatedDefender = { ...defender, currentHp: newHp };
    if (isPlayer) {
      setOpponent(updatedDefender);
    } else {
      setPlayer(updatedDefender);
    }
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 6. Screen shake if super effective
    if (effectiveness > 1) {
      setAnimationState(prev => ({ ...prev, screenShake: true }));
      if (containerRef.current) {
        containerRef.current.classList.add('screen-shake');
      }
      toast.success(effectText);
      await new Promise(resolve => setTimeout(resolve, 500));
      if (containerRef.current) {
        containerRef.current.classList.remove('screen-shake');
      }
    } else if (effectiveness < 1) {
      toast.warning(effectText);
    }
    
    // 7. Reset attacker position
    setAnimationState(prev => ({
      ...prev,
      playerAttacking: false,
      opponentAttacking: false,
      playerDamaged: false,
      opponentDamaged: false,
      screenShake: false,
    }));
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setAnimating(false);

    // 8. Handle fainting
    if (newHp <= 0) {
      addLog(`${defender.name} fainted!`);
      setTimeout(() => {
        onBattleEnd(isPlayer);
      }, 1500);
    }

    return updatedDefender;
  };

  const handlePlayerMove = async (move: Move) => {
    if (animating || turn !== 'player') return;
    
    const updatedOpponent = await executeMove(player, opponent, move, true);
    
    if (updatedOpponent.currentHp > 0) {
      setTurn('opponent');
      
      // Opponent's turn
      setTimeout(async () => {
        const opponentMove = opponent.moves[Math.floor(Math.random() * opponent.moves.length)];
        await executeMove(opponent, player, opponentMove, false);
        setTurn('player');
      }, 1500);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-screen max-w-4xl mx-auto p-4 space-y-4 relative"
    >
      {/* Battle Effects */}
      <BattleEffects
        effect={animationState.effectElement}
        position={animationState.effectPosition || 'player'}
        show={animationState.showEffect}
      />
      
      {/* Floating Damage */}
      <FloatingDamage
        damage={animationState.damageAmount}
        effectiveness={animationState.damageEffectiveness}
        position={animationState.damagePosition || 'player'}
        show={animationState.showDamage}
        onComplete={() => setAnimationState(prev => ({ ...prev, showDamage: false }))}
      />
      
      {/* Opponent Pokemon */}
      <div className="animate-in slide-in-from-top duration-500">
        <PokemonCard 
          pokemon={opponent}
          isAttacking={animationState.opponentAttacking}
          isTakingDamage={animationState.opponentDamaged}
          isFainted={opponent.currentHp <= 0}
          isActive={turn === 'opponent' && !animating}
        />
      </div>

      {/* Battle Log */}
      <div className="flex-1 gb-screen p-4 overflow-y-auto">
        <div className="space-y-1 pixel-text text-sm">
          {log.map((entry, i) => (
            <div key={i} className="animate-in fade-in duration-200">
              {entry}
            </div>
          ))}
        </div>
      </div>

      {/* Player Pokemon */}
      <div className="animate-in slide-in-from-bottom duration-500">
        <PokemonCard 
          pokemon={player} 
          isPlayer
          isAttacking={animationState.playerAttacking}
          isTakingDamage={animationState.playerDamaged}
          isFainted={player.currentHp <= 0}
          isActive={turn === 'player' && !animating}
        />
      </div>

      {/* Move Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {player.moves.map((move) => (
          <Button
            key={move.id}
            onClick={() => handlePlayerMove(move)}
            disabled={animating || turn !== 'player' || player.currentHp <= 0}
            variant="default"
            className="btn-retro pixel-text h-auto py-3 flex flex-col items-start gap-1"
          >
            <span className="uppercase font-bold">{move.name}</span>
            <span className="text-xs opacity-75">
              {move.element.toUpperCase()} • PWR {move.basePower}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
