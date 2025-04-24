"use client";
import { motion } from 'framer-motion';

export default function FloatingShapes() {
  const shapes = [
    { id: 1, size: 120, x: 10, y: 20, duration: 20 },
    { id: 2, size: 80, x: 80, y: 60, duration: 25 },
    { id: 3, size: 150, x: 30, y: 70, duration: 30 },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            x: [0, 50, 0, -30, 0],
            y: [0, -40, 30, 0, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}