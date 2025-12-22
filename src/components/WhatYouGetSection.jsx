import { motion } from 'framer-motion';
import { Video, FileText, Image, BarChart } from 'lucide-react';

const benefits = [
  {
    icon: Video,
    title: '10+ Video Ideas',
    description: 'Fresh, trending ideas generated in seconds based on your niche.',
  },
  {
    icon: FileText,
    title: 'Full Scripts',
    description: 'Complete video scripts with hooks, main content, and CTAs included.',
  },
  {
    icon: Image,
    title: 'Thumbnail Concepts',
    description: 'AI-generated thumbnail ideas that get clicks and boost CTR.',
  },
  {
    icon: BarChart,
    title: 'Performance Predictions',
    description: 'See estimated view potential before you even hit record.',
  },
];

export function WhatYouGetSection() {
  return (
    <section className="py-32 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            What You Get
          </motion.h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Everything you need to create viral content
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl p-6 hover:border-green-500/50 transition-all relative overflow-hidden"
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 60px rgba(34,197,94,0.2)',
                }}
              >
                {/* Hover gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                />

                {/* Checkmark badge */}
                <motion.div
                  className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                  whileHover={{ rotate: 360 }}
                >
                  <span className="text-white text-xs">✓</span>
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="mb-4 relative"
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-green-400 p-3 relative"
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(34,197,94,0)',
                        '0 0 20px rgba(34,197,94,0.5)',
                        '0 0 0px rgba(34,197,94,0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  >
                    <benefit.icon className="w-full h-full text-white" />
                  </motion.div>
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 relative z-10">{benefit.title}</h3>
                <p className="text-gray-400 text-sm relative z-10">{benefit.description}</p>

                {/* Animated underline */}
                <motion.div
                  className="mt-4 h-1 bg-gradient-to-r from-green-500 to-transparent rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          {[
            { value: '10k+', label: 'Creators' },
            { value: '1M+', label: 'Ideas Generated' },
            { value: '95%', label: 'Satisfaction' },
            { value: '24/7', label: 'AI Available' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

