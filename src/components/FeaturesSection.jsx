import { motion } from 'framer-motion';
import { Zap, Target, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate 10+ video ideas in under 60 seconds. No more hours of brainstorming.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Target,
    title: 'Trend-Optimized',
    description: 'AI analyzes current trends to suggest topics that are proven to get views.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Lightbulb,
    title: 'Never Run Out of Ideas',
    description: 'Unlimited fresh content ideas tailored to your niche and audience.',
    color: 'from-purple-500 to-pink-500',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-4 relative">
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
            Perfect for Every Creator
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ 
                y: -10,
                boxShadow: '0 20px 60px rgba(139,92,246,0.3)',
              }}
            >
              {/* Glow effect on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* Icon */}
              <motion.div
                className="relative mb-6"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 relative`}
                  whileHover={{ scale: 1.1 }}
                >
                  <feature.icon className="w-full h-full text-white" />
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(139,92,246,0)',
                        '0 0 20px rgba(139,92,246,0.5)',
                        '0 0 0px rgba(139,92,246,0)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-3 relative z-10">{feature.title}</h3>
              <p className="text-gray-400 relative z-10">{feature.description}</p>

              {/* Hover arrow */}
              <motion.div
                className="mt-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                →
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

