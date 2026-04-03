'use client';

import { motion } from 'framer-motion';
import { DUE_DATE_DISPLAY, EARLIEST_DATE_DISPLAY, LATEST_DATE_DISPLAY } from '@/lib/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const featureItems = [
  {
    icon: '🎯',
    title: 'Adivinhe a Data',
    description: 'Escolha a data que acha que a Anna Clara vai nascer dentro do período permitido'
  },
  {
    icon: '🏆',
    title: 'Quanto Mais Perto, Melhor',
    description: 'Quem acertar a data mais próxima é o vencedor! Em caso de empate, vence quem se registrou primeiro'
  },
  {
    icon: '💝',
    title: 'Apoie o Enxoval',
    description: 'Escolha um item especial ou contribua via PIX para ajudar no enxoval da bebê'
  },
  {
    icon: '🎉',
    title: 'Celebre Junto',
    description: 'Participe desse momento especial com a família e acompanhe todos os palpites'
  }
];

export default function BolaoSection() {
  return (
    <section id="bolao" className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
      {/* Decorative background elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <span className="text-gradient">O Bolão</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          O grande evento! A diversão é adivinhar quando a Anna Clara vai chegar ao mundo. 
          Toda participação, seja um palpite ou um presente, ajuda a preparar tudo para sua chegada!
        </p>
      </motion.div>

      {/* Key Info Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-3xl border-3 border-pink-200 p-8 mb-16 shadow-elegant"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Expected Date */}
          <motion.div
            whileHover={{ y: -5 }}
            className="text-center"
          >
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Data Esperada</h3>
            <p className="text-2xl font-bold text-pink-600">{DUE_DATE_DISPLAY}</p>
          </motion.div>

          {/* Date Range */}
          <motion.div
            whileHover={{ y: -5 }}
            className="text-center border-l-2 border-r-2 border-pink-200 px-4"
          >
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Período de Palpites</h3>
            <p className="text-sm text-gray-700 font-semibold">{EARLIEST_DATE_DISPLAY}</p>
            <p className="text-gray-500 my-1">até</p>
            <p className="text-sm text-gray-700 font-semibold">{LATEST_DATE_DISPLAY}</p>
          </motion.div>

          {/* Prize Info */}
          <motion.div
            whileHover={{ y: -5 }}
            className="text-center"
          >
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">O Prêmio</h3>
            <p className="text-gray-700 font-semibold">Aquele que acertar a data mais próxima do nascimento da Anna Clara!</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {featureItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            
            {/* Card */}
            <div className="relative h-full bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 shadow-elegant hover:shadow-elevated transition-all duration-300 border border-white border-opacity-50">
              <div className="text-6xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* How to Win */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl border-3 border-dashed border-yellow-300 p-8 text-center"
      >
        <h3 className="text-3xl font-bold text-gray-900 mb-4">🏅 Como Ganhar? 🏅</h3>
        <div className="max-w-2xl mx-auto text-lg text-gray-700 space-y-3">
          <p className="font-semibold text-gray-700">
            ✅ Adivinhe corretamente a data de nascimento da Anna Clara
          </p>
          <p className="text-sm text-gray-600">
            Se ninguém acertar a data exata, vence quem estiver mais próximo! <br />
            Em caso de empate (mesma diferença de dias), vence quem se registrou primeiro!
          </p>
        </div>
      </motion.div>
    </section>
  );
}
