'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { ITEMS, PIX_VALUES, EARLIEST_DATE, LATEST_DATE } from '@/lib/constants';
import ItemsGrid from './items-grid';
import PixModule from './pix-module';

export default function ItemForm() {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [estimatedBirthDate, setEstimatedBirthDate] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [pixValue, setPixValue] = useState<number | null>(null);
  const [receiptPath, setReceiptPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isFormValid = name.trim() && whatsapp.trim() && estimatedBirthDate && (selectedItem || (pixValue && receiptPath));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setMessage({ type: 'error', text: 'Preencha todos os campos obrigatórios' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          whatsapp,
          estimatedBirthDate,
          itemName: selectedItem,
          pixValue,
          receiptPath
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao registrar');
      }

      setMessage({ type: 'success', text: 'Registrado com sucesso! Obrigado por participar! 🎉' });
      setName('');
      setWhatsapp('');
      setEstimatedBirthDate('');
      setSelectedItem(null);
      setPixValue(null);
      setReceiptPath(null);

      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao registrar'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemSelect = (item: string) => {
    setSelectedItem(selectedItem === item ? null : item);
    if (selectedItem === item) {
      setPixValue(null);
      setReceiptPath(null);
    }
  };

  const handlePixSelect = (value: number) => {
    setPixValue(pixValue === value ? null : value);
    if (pixValue === value) {
      setSelectedItem(null);
      setReceiptPath(null);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Faça seu <span className="text-gradient">Palpite</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Adivinhe a data de nascimento da Anna Clara, escolha um item especial ou contribua via PIX!
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-elegant border border-white border-opacity-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none transition-colors bg-white focus:ring-2 focus:ring-pink-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                WhatsApp *
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none transition-colors bg-white focus:ring-2 focus:ring-pink-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Seu Palpite - Data de Nascimento 🎰 *
              </label>
              <input
                type="date"
                value={estimatedBirthDate}
                onChange={(e) => setEstimatedBirthDate(e.target.value)}
                min={EARLIEST_DATE}
                max={LATEST_DATE}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none transition-colors bg-white focus:ring-2 focus:ring-pink-200"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Entre {EARLIEST_DATE} e {LATEST_DATE}
              </p>
            </div>
          </div>
        </motion.div>

        <ItemsGrid
          selectedItem={selectedItem}
          onItemSelect={handleItemSelect}
        />

        {(!selectedItem || pixValue) && (
          <PixModule
            selectedValue={pixValue}
            onValueSelect={handlePixSelect}
            receiptPath={receiptPath}
            onReceiptUpload={setReceiptPath}
          />
        )}

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-100 border border-green-300 text-green-800'
                  : 'bg-red-100 border border-red-300 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={!isFormValid || isLoading}
          whileHover={{ scale: isFormValid && !isLoading ? 1.05 : 1 }}
          whileTap={{ scale: isFormValid && !isLoading ? 0.95 : 1 }}
          className="w-full py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold rounded-lg shadow-elegant hover:shadow-elevated disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Registrar Presente
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
