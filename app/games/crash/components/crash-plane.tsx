'use client';

import { type MotionValue, motion, useTransform } from 'framer-motion';
import type { GameState } from '../hooks/use-crash-game';

type CrashPlaneProps = {
  planeProgress: MotionValue<number>;
  planeY: MotionValue<number>;
  planeRotation: number;
  gameState: GameState;
};

export function CrashPlane({
  planeProgress,
  planeY,
  planeRotation,
  gameState,
}: CrashPlaneProps) {
  const top = useTransform(planeY, (v) => `${v}%`);
  // Responsive positioning: ensures the plane stays within the viewport.
  // Starts at 20px from the left, ends at 60px from the right.
  const left = useTransform(
    planeProgress,
    (p) => `calc(${p * 100}% + ${20 - p * 80}px)`,
  );
  return (
    <motion.div
      className='absolute'
      style={{
        top,
        left,
        transform: 'translate(-50%, -50%)',
        filter:
          gameState === 'running'
            ? 'drop-shadow(0 0 15px rgba(255, 50, 50, 0.8))'
            : 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
      }}
      animate={{
        rotate: planeRotation,
        scale: gameState === 'running' ? 1.2 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
    >
      {/* Rocket SVG */}
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: this is fine */}
      <svg
        width='80'
        height='80'
        viewBox='0 0 100 100'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        transform='rotate(90)'
      >
        <path
          d='M50 10 L70 40 L60 40 L60 70 L40 70 L40 40 L30 40 L50 10Z'
          fill='#E5E7EB'
        />
        <path d='M50 10 L30 40 L40 40 L50 25 Z' fill='#F3F4F6' />
        <path d='M70 40 L60 40 L60 70 L70 80 Z' fill='#D1D5DB' />
        <path d='M20 80 L30 70 L30 50 L20 50 Z' fill='#EF4444' />
        <path d='M80 80 L70 70 L70 50 L80 50 Z' fill='#EF4444' />
        {/* Animated Flame */}
        <motion.g
          animate={{
            scale: gameState === 'running' ? [1, 1.5, 1.2] : 0,
            opacity: gameState === 'running' ? 1 : 0,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'mirror',
          }}
          style={{ transformOrigin: '50% 100%' }}
        >
          <path d='M40 70 L60 70 L50 95 Z' fill='#F97316' />
          <path d='M45 70 L55 70 L50 85 Z' fill='#FBBF24' />
        </motion.g>
      </svg>
    </motion.div>
  );
}
