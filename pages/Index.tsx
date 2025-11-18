import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BattleScene } from '@/components/BattleScene';
import { pokeApi } from '@/services/pokeApi';
import { adaptPokemon } from '@/adapters/pokemonAdapter';
import type { Character } from '@/types/game';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type GameState = 'menu' | 'loading' | 'battle' | 'victory' | 'defeat';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [player, setPlayer] = useState<Character | null>(null);
  const [opponent, setOpponent] = useState<Character | null>(null);
  const [wins, setWins] = useState(0);

  const initializeBattle = async () => {
    setGameState('loading');
    
    try {
      // Fetch two random Pokémon
      const [playerRaw, opponentRaw] = await Promise.all([
        pokeApi.fetchRandomPokemon(),
        pokeApi.fetchRandomPokemon(),
      ]);

      const playerData = await adaptPokemon(playerRaw);
      const opponentData = await adaptPokemon(opponentRaw);

      // Make sure they have moves
      if (playerData.moves.length === 0 || opponentData.moves.length === 0) {
        toast.error('Failed to load Pokémon moves. Retrying...');
        return initializeBattle();
      }

      const playerChar: Character = {
        ...playerData,
        level: 50,
        currentHp: playerData.stats.hp,
        maxHp: playerData.stats.hp,
      };

      const opponentChar: Character = {
        ...opponentData,
        level: 50,
        currentHp: opponentData.stats.hp,
        maxHp: opponentData.stats.hp,
      };

      setPlayer(playerChar);
      setOpponent(opponentChar);
      setGameState('battle');
      
      toast.success(`Battle started! ${playerChar.name} vs ${opponentChar.name}`);
    } catch (error) {
      console.error('Failed to initialize battle:', error);
      toast.error('Failed to load Pokémon. Please try again.');
      setGameState('menu');
    }
  };

  const handleBattleEnd = (won: boolean) => {
    if (won) {
      setWins(prev => prev + 1);
      setGameState('victory');
      toast.success('Victory! You won the battle!');
    } else {
      setGameState('defeat');
      toast.error('Defeat! Better luck next time!');
    }
  };

  const handleReturnToMenu = () => {
    setGameState('menu');
    setPlayer(null);
    setOpponent(null);
  };

  useEffect(() => {
    // Load wins from localStorage
    const savedWins = localStorage.getItem('pokemon_wins');
    if (savedWins) {
      setWins(parseInt(savedWins, 10));
    }
  }, []);

  useEffect(() => {
    // Save wins to localStorage
    localStorage.setItem('pokemon_wins', wins.toString());
  }, [wins]);

  if (gameState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin mx-auto" />
          <p className="pixel-text text-lg">Loading battle...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'battle' && player && opponent) {
    return <BattleScene player={player} opponent={opponent} onBattleEnd={handleBattleEnd} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Logo/Title */}
        <div className="space-y-2 animate-in zoom-in duration-500">
          <h1 className="pixel-text text-5xl font-bold uppercase tracking-wider">
            Poké
            <br />
            Battle
          </h1>
          <p className="pixel-text text-sm opacity-75">Game Boy Edition</p>
        </div>

        {/* Stats */}
        <div className="gb-screen p-4 animate-in fade-in duration-700">
          <div className="pixel-text text-lg">
            <div className="flex justify-between">
              <span>WINS:</span>
              <span>{wins}</span>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-3 animate-in slide-in-from-bottom duration-700">
          {gameState === 'menu' && (
            <>
              <Button
                onClick={initializeBattle}
                size="lg"
                className="w-full btn-retro pixel-text text-lg uppercase h-14"
              >
                Start Battle
              </Button>
              <Button
                onClick={() => {
                  pokeApi.clearCache();
                  toast.success('Cache cleared!');
                }}
                variant="secondary"
                className="w-full btn-retro pixel-text uppercase"
              >
                Clear Cache
              </Button>
            </>
          )}

          {(gameState === 'victory' || gameState === 'defeat') && (
            <div className="space-y-4">
              <div className="gb-screen p-6">
                <h2 className="pixel-text text-2xl uppercase mb-2">
                  {gameState === 'victory' ? 'You Win!' : 'You Lose!'}
                </h2>
                {player && opponent && (
                  <p className="pixel-text text-sm">
                    {player.name} vs {opponent.name}
                  </p>
                )}
              </div>
              
              <Button
                onClick={initializeBattle}
                size="lg"
                className="w-full btn-retro pixel-text text-lg uppercase h-14"
              >
                New Battle
              </Button>
              
              <Button
                onClick={handleReturnToMenu}
                variant="secondary"
                className="w-full btn-retro pixel-text uppercase"
              >
                Main Menu
              </Button>
            </div>
          )}
        </div>

        {/* Attribution */}
        <p className="pixel-text text-xs opacity-50 animate-in fade-in duration-1000">
          Data from PokeAPI • Pokémon © Nintendo
        </p>
      </div>
    </div>
  );
};

export default Index;
