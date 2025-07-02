import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface TransactionAnimationProps {
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'under_review';
  amount: number;
  onComplete?: () => void;
}

export function TransactionAnimation({ status, amount, onComplete }: TransactionAnimationProps) {
  useEffect(() => {
    let interval: any;
    if (status === 'approved' || status === 'rejected') {
      // Trigger confetti animation
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999,
        colors: status === 'approved' ? ['#22c55e', '#bbf7d0', '#bef264', '#facc15'] : ['#ef4444', '#f87171', '#fca5a5', '#7f1d1d']
      };
      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }
      interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          if (onComplete) setTimeout(onComplete, 500);
          return;
        }
        const particleCount = 40 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [status, onComplete]);

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'flagged':
        return 'text-orange-500';
      case 'under_review':
        return 'text-blue-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return '✓';
      case 'rejected':
        return '✕';
      case 'flagged':
        return '⚠';
      case 'under_review':
        return '⟳';
      default:
        return '⋯';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white rounded-lg p-8 shadow-xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className={`text-6xl mb-4 ${getStatusColor()}`}
        >
          {getStatusIcon()}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-2"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600"
        >
          ${amount.toFixed(2)}
        </motion.p>
      </motion.div>
    </motion.div>
  );
} 