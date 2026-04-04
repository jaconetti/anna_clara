'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    emoji: '🧸',
    number: '1',
    title: "Escolha um Presente",
    description: "Navegue pela lista de 24 itens incríveis do enxoval e escolha aquele que você deseja presentear! 🎁",
    gradient: 'from-pink-300 to-pink-200'
  },
  {
    emoji: '💳',
    number: '2',
    title: "Ou Contribua com PIX",
    description: "Prefere contribuir monetariamente? Escolha um valor e envie o comprovante. Cada valor ajuda! 💰",
    gradient: 'from-blue-300 to-blue-200'
  },
  {
    emoji: '✍️',
    number: '3',
    title: "Registre seus Dados",
    description: "Informe seu nome e WhatsApp para completar o registro. Rápido e fácil! 🎀",
    gradient: 'from-yellow-300 to-yellow-200'
  },
  {
    emoji: '✨',
    number: '4',
    title: "Pronto!",
    description: "Seu presente está reservado! Você aparecerá na lista e fará parte dessa festa. Que legal! 🎉",
    gradient: 'from-green-300 to-green-200'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
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

const emojiVariants = {
  hidden: { rotate: -20, scale: 0 },
  visible: {
    rotate: 0,
    scale: 1,
    transition: { duration: 0.6, type: 'spring', stiffness: 100 }
  },
  bounce: {
    y: [0, -15, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
};

const numberVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { delay: 0.2, duration: 0.5, type: 'spring' }
  }
};

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          🌈 Como <span className="text-gradient">Funciona</span> 🌈
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Quatro passos simples e divertidos para você fazer parte dessa festa!
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -12, scale: 1.02 }}
            className="group relative"
          >
            {/* Decorative background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
            
            {/* Card */}
            <div className="relative h-full bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-elegant hover:shadow-elevated transition-all duration-300 border border-white border-opacity-50">
              {/* Number badge */}
              <motion.div
                variants={numberVariants}
                className={`absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center font-bold text-2xl text-gray-800 shadow-elegant`}
              >
                {step.number}
              </motion.div>

              {/* Emoji */}
              <motion.div
                initial="hidden"
                animate={['visible', 'bounce']}
                variants={emojiVariants}
                className="text-5xl mb-4 text-center"
              >
                {step.emoji}
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{step.title}</h3>
              <p className="text-gray-600 text-center leading-relaxed">{step.description}</p>

              {/* Decorative line */}
              <motion.div
                className={`mt-6 h-1 bg-gradient-to-r ${step.gradient} rounded-full w-0 group-hover:w-full transition-all duration-500`}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Celebration line at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mt-16 text-2xl"
      >
        <p className="text-gray-700 font-semibold">
          Pronto para celebrar? 🎉 Bora lá! 👇
        </p>
      </motion.div>
    </section>
  );
}
