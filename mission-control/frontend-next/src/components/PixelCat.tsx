'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PixelCatProps {
  onMeow?: () => void;
}

export function PixelCat({ onMeow }: PixelCatProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [position, setPosition] = useState(0);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  const messages = [
    "Meow! 🐱",
    "Mission Control ready!",
    "Scanning for intel...",
    "All agents accounted for!",
    "Systems nominal!",
    "*purrs*",
    "Awaiting orders!"
  ];

  useEffect(() => {
    // Auto-run every 30 seconds
    const interval = setInterval(() => {
      if (!isRunning && Math.random() > 0.7) {
        triggerRun();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const triggerRun = () => {
    setIsRunning(true);
    setDirection(prev => prev * -1); // Alternate direction
    
    // Show random message
    const msg = messages[Math.floor(Math.random() * messages.length)];
    setShowMessage(msg);
    
    if (onMeow) onMeow();
    
    // Reset after animation
    setTimeout(() => {
      setIsRunning(false);
      setTimeout(() => setShowMessage(null), 2000);
    }, 3000);
  };

  const handleClick = () => {
    triggerRun();
  };

  // Pixel art cat frames
  const catFrames = {
    idle: [
      "    /\\_/\\   ",
      "   ( o.o )   ",
      "    > ^ <    ",
      "   /|   |\\  ",
      "  (_|   |_)  "
    ],
    running: [
      [
        "    /\\_/\\   ",
        "   ( >.< )   ",
        "    > ^ <    ",
        "    |   |\\  ",
        "   /     \\  "
      ],
      [
        "    /\\_/\\   ",
        "   ( >.< )   ",
        "    > ^ <    ",
        "   /|   |    ",
        "    \\   \\   "
      ]
    ]
  };

  return (
    <div 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 cursor-pointer select-none"
      onClick={handleClick}
    >
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-gray-800 border border-teal-500/50 rounded-lg px-3 py-1.5 text-sm text-teal-400 shadow-lg">
              {showMessage}
            </div>
            <div className="w-2 h-2 bg-gray-800 border-r border-b border-teal-500/50 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          x: isRunning ? direction * 200 : 0,
          scaleX: direction,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: isRunning ? 3 : 0.3
        }}
        className="relative"
      >
        <motion.div
          animate={{
            y: isRunning ? [0, -4, 0] : [0, -2, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: isRunning ? 0.2 : 2,
            ease: "easeInOut"
          }}
          className="text-green-400 font-mono text-xs leading-none whitespace-pre"
          style={{ 
            textShadow: '0 0 10px rgba(0, 212, 170, 0.5)',
            imageRendering: 'pixelated'
          }}
        >
          {isRunning ? (
            <RunningCat />
          ) : (
            <pre className="m-0">{catFrames.idle.join('\n')}</pre>
          )}
        </motion.div>

        {/* Glow effect */}
        <div 
          className="absolute inset-0 -z-10 blur-xl opacity-50"
          style={{ 
            background: 'radial-gradient(circle, rgba(0, 212, 170, 0.3) 0%, transparent 70%)'
          }}
        />
      </motion.div>

      <div className="text-center mt-1">
        <span className="text-[10px] text-gray-500">Click me!</span>
      </div>
    </div>
  );
}

function RunningCat() {
  const [frame, setFrame] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % 2);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const frames = [
    "    /\\_/\\   \n   ( >.< )   \n    > ^ <    \n    |   |\\  \n   /     \\  ",
    "    /\\_/\\   \n   ( >.< )   \n    > ^ <    \n   /|   |    \n    \\   \\   "
  ];

  return <pre className="m-0">{frames[frame]}</pre>;
}

// Animated pixel cat that follows mouse
export function FollowingPixelCat() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [catPos, setCatPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Smooth follow
    const interval = setInterval(() => {
      setCatPos(prev => ({
        x: prev.x + (mousePos.x - prev.x) * 0.05,
        y: prev.y + (mousePos.y - prev.y) * 0.05
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [mousePos]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-40"
      animate={{
        x: catPos.x - 40,
        y: catPos.y - 40
      }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    >
      <div 
        className="text-teal-400 font-mono text-xs leading-none whitespace-pre opacity-30"
        style={{ textShadow: '0 0 20px rgba(0, 212, 170, 0.8)' }}
      >
{`    /\\_/\\   
   ( o.o )   
    > ^ <    
   /|   |\\  
  (_|   |_)  `}
      </div>
    </motion.div>
  );
}
