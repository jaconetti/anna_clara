'use client';

import { motion } from 'framer-motion';
import { Heart, Calendar } from 'lucide-react';
import { DUE_DATE_DISPLAY, MOTHER_NAME, EARLIEST_DATE_DISPLAY, LATEST_DATE_DISPLAY } from '@/lib/constants';

// Rainbow animation - enters from left, exits to right
const rainbowVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: 'easeOut'
    }
  }
};

const rainbowColors = [
  'from-pink-400 to-red-400',
  'from-purple-400 to-pink-400',
  'from-blue-400 to-purple-400',
  'from-cyan-400 to-blue-400',
  'from-green-400 to-cyan-400',
  'from-yellow-400 to-green-400',
  'from-orange-400 to-yellow-400'
];

// Baby elements animations
const babyEmojiVariants = {
  hidden: { opacity: 0, scale: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut'
    }
  }),
  float: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

const babyEmojis = ['🧸', '👶', '🎀', '👶', '🧸', '🎀'];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-pastel opacity-40"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"></div>

      {/* Floating baby elements - left side (hidden on mobile) */}
      <motion.div className="hidden lg:block absolute left-0 top-32 space-y-16">
        {babyEmojis.slice(0, 3).map((emoji, i) => (
          <motion.div
            key={`left-${i}`}
            custom={i}
            initial="hidden"
            animate={['visible', 'float']}
            variants={babyEmojiVariants}
            className="text-6xl ml-4"
          >
            {emoji}
          </motion.div>
        ))}
      </motion.div>

      {/* Floating baby elements - right side (hidden on mobile) */}
      <motion.div className="hidden lg:block absolute right-0 top-40 space-y-20">
        {babyEmojis.slice(3, 6).map((emoji, i) => (
          <motion.div
            key={`right-${i}`}
            custom={i + 3}
            initial="hidden"
            animate={['visible', 'float']}
            variants={babyEmojiVariants}
            className="text-6xl mr-4"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {emoji}
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Rainbow Animation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={rainbowVariants}
          className="mb-12 flex h-3 rounded-full overflow-hidden shadow-lg"
        >
          {rainbowColors.map((color, index) => (
            <div
              key={index}
              className={`flex-1 bg-gradient-to-r ${color}`}
            />
          ))}
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-gray-900"
        >
          <span className="block mb-2">Bolão da</span>
          <span className="text-gradient text-5xl sm:text-6xl md:text-8xl">{MOTHER_NAME}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          A Clarinha está chegando! 👶💕 Adivinhe a data de nascimento! Quanto mais perto da data real, maiores as chances de ganhar um lindo prêmio!
        </motion.p>

        {/* Due Date Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-12"
        >
          <div
            className="inline-block w-full sm:w-auto bg-white bg-opacity-80 backdrop-blur-md rounded-2xl px-4 sm:px-8 py-6 shadow-elegant border-2 border-pink-200"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🎯</span>
                <div>
                  <p className="text-sm text-gray-600">Data Provável</p>
                  <p className="text-2xl font-bold text-pink-600">{DUE_DATE_DISPLAY}</p>
                </div>
              </div>
              <div className="hidden md:block text-2xl text-pink-300">|</div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">📅</span>
                <div>
                  <p className="text-sm text-gray-600">Período de Palpites</p>
                  <p className="text-lg font-semibold text-pink-600">{EARLIEST_DATE_DISPLAY}</p>
                  <p className="text-lg font-semibold text-pink-600">até {LATEST_DATE_DISPLAY}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <a
            href="#bolao"
            className="px-8 py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-full shadow-elevated hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300 text-lg inline-block"
          >
            🎰 Faça seu Palpite
          </a>
          <a
            href="#participantes"
            className="px-8 py-4 bg-gradient-to-r from-purple-300 to-blue-300 text-gray-900 font-bold rounded-full shadow-elevated hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300 text-lg inline-block"
          >
            👥 Ver Participantes
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
