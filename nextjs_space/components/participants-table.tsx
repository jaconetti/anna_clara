'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader } from 'lucide-react';
import { Participant } from '@/lib/types';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4
    }
  })
};

export default function ParticipantsTable() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchParticipants();
    const interval = setInterval(fetchParticipants, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/participants');
      if (response.ok) {
        const data = await response.json();
        setParticipants(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Users className="w-8 h-8" />
          <span>👥 Participantes</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {participants.length === 0 
            ? "Ninguém confirmou a participação ainda. 😢" 
            : participants.length === 1 
            ? "1 pessoa confirmou a participação! 🎉" 
            : `${participants.length} pessoas confirmaram a participação! 🎉`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-pink-500" />
        </div>
      ) : participants.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl border-2 border-dashed border-pink-200">
          <p className="text-2xl text-gray-600 font-semibold">Ninguém se registrou ainda... 👀</p>
          <p className="text-lg text-gray-500 mt-2">Mas você pode ser o primeiro! 🎁✨</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-3xl shadow-elegant border border-white border-opacity-50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">🎉</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">👤 Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">🎰 Seu Palpite</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">🎁 Presente / Contribuição</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <motion.tr
                    key={participant?.id ?? `row-${index}`}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ backgroundColor: 'rgba(255, 179, 217, 0.2)' }}
                    className="border-b border-gray-100 hover:shadow-sm transition-colors"
                  >
                    <td className="px-6 py-4 text-lg font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{participant?.name ?? 'N/A'}</p>
                        <p className="text-sm text-gray-500">📱 {participant?.whatsapp ?? 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {participant?.estimatedBirthDate ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="inline-block px-3 py-1 bg-gradient-to-r from-purple-200 to-purple-300 text-purple-900 rounded-full text-sm font-bold shadow-md"
                        >
                          {new Date(participant.estimatedBirthDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </motion.div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {participant?.itemName ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="inline-block px-4 py-2 bg-gradient-to-r from-pink-200 to-pink-300 text-pink-900 rounded-full text-sm font-bold shadow-md"
                        >
                          🎀 {participant.itemName}
                        </motion.span>
                      ) : participant?.pixValue ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="inline-block px-4 py-2 bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 rounded-full text-sm font-bold shadow-md"
                        >
                          💳 PIX Doado
                        </motion.span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
