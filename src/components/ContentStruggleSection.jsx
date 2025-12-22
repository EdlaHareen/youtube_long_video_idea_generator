import { motion } from 'framer-motion';
import { X, Clock, TrendingDown, AlertCircle, Frown } from 'lucide-react';

const struggles = [
  {
    icon: Clock,
    title: 'Hours Wasted Brainstorming',
    description: 'Staring at a blank screen, desperately trying to come up with your next video idea.',
  },
  {
    icon: TrendingDown,
    title: 'Falling Behind Trends',
    description: 'By the time you think of an idea, the trend has already passed and views are gone.',
  },
  {
    icon: Frown,
    title: 'Burnout from Planning',
    description: 'Spending more time planning than actually creating content is exhausting.',
  },
];

export function ContentStruggleSection() {
  return (
    <section className="py-32 px-4 relative bg-gradient-to-b from-black via-red-950/10 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            The Content Creation Struggle
          </motion.h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Sound familiar? You're not alone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {struggles.map((struggle, index) => (
            <motion.div
              key={struggle.title}
              className="group relative bg-gradient-to-b from-red-950/30 to-black border border-red-500/20 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 60px rgba(239,68,68,0.2)',
              }}
            >
              {/* X mark in corner */}
              <motion.div
                className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.div>

              {/* Icon */}
              <motion.div
                className="mb-6"
                whileHover={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-red-500/20 p-4 border border-red-500/30">
                  <struggle.icon className="w-full h-full text-red-400" />
                </div>
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3">{struggle.title}</h3>
              <p className="text-gray-400">{struggle.description}</p>

              {/* Animated underline */}
              <motion.div
                className="h-1 bg-gradient-to-r from-red-500 to-transparent mt-6 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <motion.p 
            className="text-2xl md:text-3xl font-bold text-purple-400"
            animate={{
              textShadow: [
                '0 0 20px rgba(139,92,246,0.5)',
                '0 0 40px rgba(139,92,246,0.8)',
                '0 0 20px rgba(139,92,246,0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            There's a Better Way →
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

