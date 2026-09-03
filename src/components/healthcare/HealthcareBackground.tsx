import React from 'react';
import { motion } from 'framer-motion';

export default function HealthcareBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#F0EEEA]">
      
      {/* 1. Base Gradient (Animating Angle) */}
      {/* To animate the angle, we rotate an oversized element */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[200vw] h-[200vh] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'linear-gradient(90deg, #ECE9E4 0%, #F4F2EE 100%)'
        }}
        initial={{ rotate: 128 }}
        animate={{ rotate: [128, 132, 128] }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: [0.25, 0.1, 0.4, 1]
        }}
      />

      {/* 2. Vignette (Static) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.08) 120%)'
        }}
      />
      
      {/* 3. Light Streaks (Screen Blend Mode) */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen">
        
        {/* Streak C (Background) - 10% opacity, 28s traverse */}
        <motion.div
          initial={{ x: '-40vw', y: '20vh', opacity: 0.1 }}
          animate={{ x: '110vw', y: '-30vh' }}
          transition={{
            duration: 28,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: [0.25, 0.1, 0.4, 1]
          }}
          className="absolute w-[80vw] h-[25vh] bg-white rounded-full blur-[200px] rotate-[-20deg]"
        >
          {/* Micro-flicker */}
          <motion.div 
            className="w-full h-full bg-white rounded-full"
            animate={{ opacity: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Streak B (Mid) - 15% opacity, 20s traverse */}
        <motion.div
          initial={{ x: '-30vw', y: '60vh', opacity: 0.15 }}
          animate={{ x: '100vw', y: '-10vh' }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: [0.25, 0.1, 0.4, 1]
          }}
          className="absolute w-[90vw] h-[30vh] bg-white rounded-full blur-[200px] rotate-[-25deg]"
        >
          {/* Micro-flicker */}
          <motion.div 
            className="w-full h-full bg-white rounded-full"
            animate={{ opacity: [0.85, 1.15, 0.85] }}
            transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Streak A (Foreground) - 22% opacity, 14s traverse */}
        <motion.div
          initial={{ x: '-10vw', y: '100vh', opacity: 0.22 }}
          animate={{ x: '90vw', y: '-20vh' }}
          transition={{
            duration: 14,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: [0.25, 0.1, 0.4, 1]
          }}
          className="absolute w-[100vw] h-[35vh] bg-white rounded-full blur-[200px] rotate-[-30deg]"
        >
          {/* Micro-flicker */}
          <motion.div 
            className="w-full h-full bg-white rounded-full"
            animate={{ opacity: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      {/* 5. Text-Safe Zone Mask (Breathing) */}
      <motion.div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[60vw] h-[80vh]"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(240, 238, 234, 0.5) 0%, transparent 60%)',
          mixBlendMode: 'normal'
        }}
      />

      {/* 4. Film Grain (4% HLS noise equivalent) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'multiply'
        }}
      />
    </div>
  );
}
