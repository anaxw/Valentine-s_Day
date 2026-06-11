import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart: Heart = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        size: Math.random() * 30 + 20,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 2,
      };
      setHearts(prev => [...prev, newHeart]);
      
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, newHeart.duration * 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ y: '100vh', x: heart.x, opacity: 1, scale: 0 }}
            animate={{ y: '-10vh', opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: heart.duration, delay: heart.delay, ease: 'linear' }}
            style={{ position: 'absolute', left: heart.x }}
            className="text-red-400"
          >
            <div style={{ fontSize: heart.size }}>❤️</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingHearts;