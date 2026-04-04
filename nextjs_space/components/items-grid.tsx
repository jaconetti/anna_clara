'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { ITEMS, COLOR_PALETTE } from '@/lib/constants';

interface ItemsGridProps {
  selectedItem: string | null;
  onItemSelect: (item: string) => void;
}

export default function ItemsGrid({ selectedItem, onItemSelect }: ItemsGridProps) {
  const [chosenItems, setChosenItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChosenItems();
    const interval = setInterval(fetchChosenItems, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchChosenItems = async () => {
    try {
      const response = await fetch('/api/chosen-items');
      if (response.ok) {
        const data = await response.json();
        setChosenItems(data?.chosenItems ?? []);
      }
    } catch (error) {
      console.error('Error fetching chosen items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Itens do Enxoval</h3>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {ITEMS.map((item, index) => {
          const isChosen = chosenItems.includes(item.name);
          const isSelected = selectedItem === item.name;
          const colorClass = COLOR_PALETTE[index % COLOR_PALETTE.length];

          return (
            <motion.button
              key={item.name}
              type="button"
              variants={itemVariants}
              onClick={() => !isChosen && onItemSelect(item.name)}
              disabled={isChosen && !isSelected}
              whileHover={!isChosen ? { y: -4 } : {}}
              whileTap={!isChosen ? { scale: 0.95 } : {}}
              className={`relative p-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-3 group ${
                isSelected
                  ? 'ring-2 ring-pink-500 shadow-elevated'
                  : isChosen
                  ? 'opacity-40 cursor-not-allowed'
                  : `${colorClass} shadow-elegant hover:shadow-elevated cursor-pointer`
              }`}
            >
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-200 to-pink-100 opacity-30"
                  layoutId="selectedItemBg"
                />
              )}
              <Gift className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
              <span className="text-sm font-semibold text-gray-900 text-center leading-tight">
                {item.name}
              </span>
              <span className="text-xs text-gray-500 text-center">
                Em torno de {item.price}
              </span>
              {isChosen && !isSelected && (
                <span className="text-xs text-gray-600 font-medium">Já escolhido</span>
              )}
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs font-bold text-pink-600"
                >
                  ✓ Selecionado
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
