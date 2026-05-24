import React from 'react';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-wellness-bg">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex flex-col items-center"
      >
        <Leaf className="w-16 h-16 text-wellness-sage mb-6" />
        <span className="font-serif text-2xl tracking-[0.2em] text-wellness-olive">LEVELING UP...</span>
      </motion.div>
    </div>
  );
}
