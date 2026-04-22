'use client';

import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { ITEMS, COLOR_PALETTE } from '@/lib/constants';

interface ItemsGridProps {
  selectedItem: string | null;
  onItemSelect: (item: string) => void;
}

export default function ItemsGrid({ selectedItem, onItemSelect }: ItemsGridProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Presente</h3>
      <div className="flex flex-col gap-3">
        {ITEMS.map((item, index) => {
          const isSelected = selectedItem === item.name;
          const colorClass = COLOR_PALETTE[index % COLOR_PALETTE.length];

          return (
            <motion.button
              key={item.name}
              type="button"
              onClick={() => onItemSelect(item.name)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-5 rounded-xl transition-all duration-300 flex items-center gap-4 group ${
                isSelected
                  ? 'ring-2 ring-pink-500 shadow-elevated bg-pink-50'
                  : `${colorClass} shadow-elegant hover:shadow-elevated cursor-pointer`
              }`}
            >
              <Gift className="w-8 h-8 text-gray-700 group-hover:text-gray-900 transition-colors flex-shrink-0" />
              <div className="flex-1 text-left">
                <span className="text-base font-bold text-gray-900 block">
                  🎁 {item.name}
                </span>
                <span className="text-sm text-gray-500">
                  Escolha um presente surpresa para a Clarinha!
                </span>
              </div>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-sm font-bold text-pink-600 flex-shrink-0"
                >
                  ✓ Selecionado
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
