@tailwind base;
@tailwind components;
@tailwind utilities;

/* Definition of the design system. All colors, gradients, fonts, etc should be defined here. 
All colors MUST be HSL.
*/

@layer base {
  :root {
    /* Game Boy Color Palette */
    --gb-light: 88 70% 71%;     /* #9BBC0F - lightest green */
    --gb-medium: 88 62% 62%;    /* #8BAC0F - medium green */
    --gb-dark: 98 55% 28%;      /* #306230 - dark green */
    --gb-darkest: 135 62% 14%;  /* #0F380F - darkest green/black */
    
    --background: 88 70% 71%;
    --foreground: 135 62% 14%;

    --card: 88 70% 71%;
    --card-foreground: 135 62% 14%;

    --popover: 88 70% 71%;
    --popover-foreground: 135 62% 14%;

    --primary: 98 55% 28%;
    --primary-foreground: 88 70% 71%;

    --secondary: 88 62% 62%;
    --secondary-foreground: 135 62% 14%;

    --muted: 88 62% 62%;
    --muted-foreground: 98 55% 28%;

    --accent: 135 62% 14%;
    --accent-foreground: 88 70% 71%;

    --destructive: 0 70% 40%;
    --destructive-foreground: 88 70% 71%;

    --border: 98 55% 28%;
    --input: 88 62% 62%;
    --ring: 98 55% 28%;

    --radius: 0rem;

    /* Pixel art shadows */
    --shadow-pixel: 4px 4px 0 hsl(var(--gb-darkest));
    --shadow-pixel-sm: 2px 2px 0 hsl(var(--gb-darkest));
    
    /* Transitions */
    --transition-retro: all 0.1s steps(3);
  }

  .dark {
    --background: 135 62% 14%;
    --foreground: 88 70% 71%;

    --card: 135 62% 14%;
    --card-foreground: 88 70% 71%;

    --popover: 135 62% 14%;
    --popover-foreground: 88 70% 71%;

    --primary: 88 70% 71%;
    --primary-foreground: 135 62% 14%;

    --secondary: 98 55% 28%;
    --secondary-foreground: 88 70% 71%;

    --muted: 98 55% 28%;
    --muted-foreground: 88 62% 62%;

    --accent: 88 70% 71%;
    --accent-foreground: 135 62% 14%;

    --destructive: 0 70% 40%;
    --destructive-foreground: 88 70% 71%;

    --border: 98 55% 28%;
    --input: 98 55% 28%;
    --ring: 88 70% 71%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: 'Courier New', monospace;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }

  /* Pixel art text */
  .pixel-text {
    font-family: 'Courier New', monospace;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-rendering: optimizeSpeed;
  }

  /* Game Boy screen effect */
  .gb-screen {
    background: hsl(var(--background));
    border: 4px solid hsl(var(--gb-darkest));
    box-shadow: 
      inset -2px -2px 0 hsl(var(--gb-dark)),
      inset 2px 2px 0 hsl(var(--gb-medium));
  }

  /* Retro button styles */
  .btn-retro {
    border: 3px solid hsl(var(--gb-darkest));
    box-shadow: 
      3px 3px 0 hsl(var(--gb-darkest)),
      inset -1px -1px 0 hsl(var(--gb-dark)),
      inset 1px 1px 0 hsl(var(--gb-light));
    transition: var(--transition-retro);
  }

  .btn-retro:active {
    transform: translate(2px, 2px);
    box-shadow: 
      1px 1px 0 hsl(var(--gb-darkest)),
      inset -1px -1px 0 hsl(var(--gb-dark)),
      inset 1px 1px 0 hsl(var(--gb-light));
  }

  /* Combat Animations */
  @keyframes shake-damage {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    50% { transform: translateX(8px); }
    75% { transform: translateX(-4px); }
  }

  @keyframes bounce-attack {
    0%, 100% { transform: translateY(0) scale(1); }
    30% { transform: translateY(-15px) scale(1.1); }
    50% { transform: translateY(-20px) scale(1.15); }
    70% { transform: translateY(-10px) scale(1.05); }
  }

  @keyframes slide-attack-player {
    0% { transform: translateX(0) translateY(0); }
    50% { transform: translateX(40px) translateY(-20px) scale(1.1); }
    100% { transform: translateX(0) translateY(0) scale(1); }
  }

  @keyframes slide-attack-opponent {
    0% { transform: translateX(0) translateY(0); }
    50% { transform: translateX(-40px) translateY(20px) scale(1.1); }
    100% { transform: translateX(0) translateY(0) scale(1); }
  }

  @keyframes flash-hit {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(2); }
  }

  @keyframes fade-faint {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.8); }
  }

  @keyframes pulse-turn {
    0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.7); }
    50% { box-shadow: 0 0 0 8px hsl(var(--primary) / 0); }
  }

  @keyframes screen-shake {
    0%, 100% { transform: translate(0, 0); }
    10%, 30%, 50%, 70%, 90% { transform: translate(-3px, 3px); }
    20%, 40%, 60%, 80% { transform: translate(3px, -3px); }
  }

  @keyframes float-up {
    0% { 
      transform: translateY(0) scale(0.8);
      opacity: 1;
    }
    100% { 
      transform: translateY(-80px) scale(1.2);
      opacity: 0;
    }
  }

  @keyframes hp-decrease {
    0% { width: var(--start-width); }
    100% { width: var(--end-width); }
  }

  /* Element Effect Animations */
  @keyframes fire-effect {
    0%, 100% { 
      box-shadow: 0 0 20px hsl(0 70% 50% / 0.5);
      filter: brightness(1);
    }
    50% { 
      box-shadow: 0 0 40px hsl(0 70% 50% / 0.8);
      filter: brightness(1.3);
    }
  }

  @keyframes water-effect {
    0%, 100% { 
      box-shadow: 0 0 20px hsl(210 80% 50% / 0.5);
    }
    50% { 
      box-shadow: 0 0 40px hsl(210 80% 50% / 0.8);
    }
  }

  @keyframes electric-effect {
    0%, 100% { 
      box-shadow: 0 0 20px hsl(50 100% 50% / 0.7);
      filter: brightness(1);
    }
    50% { 
      box-shadow: 0 0 40px hsl(50 100% 50% / 1);
      filter: brightness(1.5);
    }
  }

  @keyframes grass-effect {
    0%, 100% { 
      box-shadow: 0 0 20px hsl(120 60% 40% / 0.5);
    }
    50% { 
      box-shadow: 0 0 40px hsl(120 60% 40% / 0.8);
    }
  }

  /* Combat Animation Classes */
  .shake-damage {
    animation: shake-damage 0.4s ease-in-out;
  }

  .bounce-attack {
    animation: bounce-attack 0.6s ease-out;
  }

  .slide-attack-player {
    animation: slide-attack-player 0.8s ease-in-out;
  }

  .slide-attack-opponent {
    animation: slide-attack-opponent 0.8s ease-in-out;
  }

  .flash-hit {
    animation: flash-hit 0.3s ease-in-out 3;
  }

  .fade-faint {
    animation: fade-faint 1s ease-out forwards;
  }

  .pulse-turn {
    animation: pulse-turn 2s ease-in-out infinite;
  }

  .screen-shake {
    animation: screen-shake 0.5s ease-in-out;
  }

  .float-damage {
    animation: float-up 1.5s ease-out forwards;
  }

  .fire-effect {
    animation: fire-effect 0.5s ease-in-out;
  }

  .water-effect {
    animation: water-effect 0.5s ease-in-out;
  }

  .electric-effect {
    animation: electric-effect 0.3s ease-in-out;
  }

  .grass-effect {
    animation: grass-effect 0.5s ease-in-out;
  }

  /* HP Bar Colors */
  .hp-high {
    background: hsl(120 60% 40%);
  }

  .hp-medium {
    background: hsl(45 100% 50%);
  }

  .hp-low {
    background: hsl(0 70% 50%);
  }

  .hp-critical {
    background: hsl(0 70% 50%);
    animation: flash-hit 0.5s ease-in-out infinite;
  }
}
