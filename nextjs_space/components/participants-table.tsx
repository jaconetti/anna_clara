'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader, Trophy } from 'lucide-react';
import { Participant } from '@/lib/types';
import { ACTUAL_BIRTH_DATE } from '@/lib/constants';

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

function getWinnerId(participants: Participant[], actualDate: string): string | null {
  if (!actualDate || participants.length === 0) return null;
  const actual = new Date(actualDate).getTime();
  let winnerId: string | null = null;
  let minDiff = Infinity;
  // participants are sorted by createdAt asc (tie-break: first registered wins)
  for (const p of participants) {
    const guess = new Date(p.estimatedBirthDate).getTime();
    const diff = Math.abs(guess - actual);
    if (diff < minDiff) {
      minDiff = diff;
      winnerId = p.id;
    }
  }
  return winnerId;
}

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

  const winnerId = ACTUAL_BIRTH_DATE ? getWinnerId(participants, ACTUAL_BIRTH_DATE) : null;

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
          <span>Participantes</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {participants.length === 0 
            ? "Ninguém confirmou a participação ainda. 😢" 
            : participants.length === 1 
            ? "1 pessoa confirmou a participação! 🎉" 
            : `${participants.length} pessoas confirmaram a participação! 🎉`}
        </p>
        {ACTUAL_BIRTH_DATE && winnerId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full shadow-elevated"
          >
            <Trophy className="w-5 h-5 text-yellow-800" />
            <span className="font-bold text-yellow-900">
              Anna Clara nasceu em {new Date(ACTUAL_BIRTH_DATE).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}! 🎉
            </span>
          </motion.div>
        )}
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
        <>
          {/* Mobile: cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {participants.map((participant, index) => {
              const isWinner = winnerId === participant.id;
              return (
                <motion.div
                  key={participant?.id ?? `card-${index}`}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className={`backdrop-blur-sm rounded-2xl shadow-elegant p-4 space-y-3 border ${
                    isWinner
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 ring-2 ring-yellow-400'
                      : 'bg-white bg-opacity-70 border-white border-opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isWinner ? (
                      <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <span className="text-sm font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                    <div>
                      <p className={`font-bold ${isWinner ? 'text-yellow-800' : 'text-gray-900'}`}>
                        {participant?.name ?? 'N/A'}
                        {isWinner && <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">🏆 Vencedor!</span>}
                      </p>
                      <p className="text-xs text-gray-500">📱 {participant?.whatsapp ?? 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {participant?.estimatedBirthDate && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        isWinner
                          ? 'bg-yellow-200 text-yellow-900'
                          : 'bg-gradient-to-r from-purple-200 to-purple-300 text-purple-900'
                      }`}>
                        🎯 {new Date(participant.estimatedBirthDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </span>
                    )}
                    {participant?.itemName ? (
                      <span className="px-3 py-1 bg-gradient-to-r from-pink-200 to-pink-300 text-pink-900 rounded-full text-xs font-bold shadow-sm">
                        🎀 {participant.itemName}
                      </span>
                    ) : participant?.pixValue ? (
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 rounded-full text-xs font-bold shadow-sm">
                        💳 PIX Doado
                      </span>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block overflow-x-auto">
            <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-3xl shadow-elegant border border-white border-opacity-50 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">🎉</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">👤 Nome</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">🎯 Seu Palpite</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">🎁 Presente / Contribuição</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant, index) => {
                    const isWinner = winnerId === participant.id;
                    return (
                      <motion.tr
                        key={participant?.id ?? `row-${index}`}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        className={`border-b transition-colors ${
                          isWinner
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                            : 'border-gray-100 hover:bg-pink-50'
                        }`}
                      >
                        <td className="px-6 py-4 text-lg">
                          {isWinner ? (
                            <Trophy className="w-6 h-6 text-yellow-500" />
                          ) : (
                            <span className="font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className={`font-bold text-lg ${isWinner ? 'text-yellow-800' : 'text-gray-900'}`}>
                            {participant?.name ?? 'N/A'}
                            {isWinner && (
                              <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full align-middle">🏆 Vencedor!</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">📱 {participant?.whatsapp ?? 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          {participant?.estimatedBirthDate ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className={`inline-block px-3 py-1 rounded-full text-sm font-bold shadow-md ${
                                isWinner
                                  ? 'bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-900'
                                  : 'bg-gradient-to-r from-purple-200 to-purple-300 text-purple-900'
                              }`}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

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
          <span>Participantes</span>
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
        <>
          {/* Mobile: cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {participants.map((participant, index) => (
              <motion.div
                key={participant?.id ?? `card-${index}`}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl shadow-elegant border border-white border-opacity-50 p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">{participant?.name ?? 'N/A'}</p>
                    <p className="text-xs text-gray-500">📱 {participant?.whatsapp ?? 'N/A'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {participant?.estimatedBirthDate && (
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-200 to-purple-300 text-purple-900 rounded-full text-xs font-bold shadow-sm">
                      🎯 {new Date(participant.estimatedBirthDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </span>
                  )}
                  {participant?.itemName ? (
                    <span className="px-3 py-1 bg-gradient-to-r from-pink-200 to-pink-300 text-pink-900 rounded-full text-xs font-bold shadow-sm">
                      🎀 {participant.itemName}
                    </span>
                  ) : participant?.pixValue ? (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 rounded-full text-xs font-bold shadow-sm">
                      💳 PIX Doado
                    </span>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block overflow-x-auto">
            <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-3xl shadow-elegant border border-white border-opacity-50 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">🎉</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">👤 Nome</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">🎯 Seu Palpite</th>
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
        </>
      )}
    </motion.div>
  );
}
