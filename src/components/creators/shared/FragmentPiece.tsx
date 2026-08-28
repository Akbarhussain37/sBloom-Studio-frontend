import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

interface FragmentPieceProps {
  style?: CSSProperties;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export default function FragmentPiece({ style, delay = 0, children, className = '' }: FragmentPieceProps) {
  return (
    <motion.div
      className={`c-fragment ${className}`}
      style={style}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
