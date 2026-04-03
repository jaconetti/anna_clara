'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function PixCounter() {
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    fetchTotal();
    const interval = setInterval(fetchTotal, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animation = animate(count, total / 100, {
      duration: 1.5,
      ease: 'easeOut'
    });

    return () => animation.stop();
  }, [total, count]);

  const fetchTotal = async () => {
    try {
      const response = await fetch('/api/pix-total');
      if (response.ok) {
        const data = await response.json();
        setTotal(data?.total ?? 0);
      }
    } catch (error) {
      console.error('Error fetching PIX total:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <TrendingUp className="w-8 h-8" />
          <span>Total Arrecadado</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Acompanhe quanto já foi arrecadado via PIX para o enxoval da Anna Clara
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 shadow-elegant border border-white border-opacity-50 text-center"
        >
          <div className="inline-flex items-center justify-center">
            <span className="text-6xl md:text-7xl font-bold text-gradient">R$</span>
            <motion.span className="text-6xl md:text-7xl font-bold text-gray-900 ml-2">
              {rounded}
            </motion.span>
            <span className="text-3xl md:text-4xl font-bold text-gray-900 ml-2">,00</span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mt-4"
          >
            Muito obrigado a todos que estão contribuindo! 💝
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}
