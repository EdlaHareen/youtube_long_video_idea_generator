import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, Rocket } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out IdeaPilot',
    icon: Zap,
    features: [
      '5 video ideas per month',
      'Basic script templates',
      'Community support',
      'Standard generation speed',
    ],
    highlighted: false,
    color: 'from-gray-600 to-gray-500',
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For serious content creators',
    icon: Crown,
    features: [
      'Unlimited video ideas',
      'Full scripts & thumbnails',
      'Priority support',
      'Advanced AI models',
      'Trend analysis',
      'Performance predictions',
    ],
    highlighted: true,
    color: 'from-purple-600 to-purple-400',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: 'per month',
    description: 'For teams and agencies',
    icon: Rocket,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom AI training',
      'API access',
      'Dedicated account manager',
      'White-label options',
    ],
    highlighted: false,
    color: 'from-green-600 to-green-400',
  },
];

export function PricingSection({ onGetStarted }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section id="pricing" className="py-32 px-4 relative bg-gradient-to-b from-black via-purple-950/5 to-black">
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
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="bg-green-500/20 text-green-300 px-6 py-2 rounded-full text-sm border border-green-500/30">
              💎 Simple Pricing
            </span>
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Choose Your Plan
          </motion.h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Start free, upgrade when you're ready
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              {/* Popular badge */}
              {plan.badge && (
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                  initial={{ y: -10, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {plan.badge}
                  </span>
                </motion.div>
              )}

              <motion.div
                className={`relative h-full bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 transition-all ${
                  plan.highlighted 
                    ? 'border-2 border-purple-500 shadow-2xl shadow-purple-500/20' 
                    : 'border border-white/10'
                }`}
                whileHover={{ 
                  y: plan.highlighted ? -20 : -10,
                  boxShadow: plan.highlighted 
                    ? '0 30px 80px rgba(139,92,246,0.4)'
                    : '0 20px 60px rgba(139,92,246,0.2)',
                }}
                animate={{
                  scale: plan.highlighted && hoveredIndex === null ? 1.05 : 1,
                }}
              >
                {/* Glow effect */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${plan.color} opacity-10`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon */}
                <motion.div
                  className="mb-6"
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} p-4 relative`}>
                    <plan.icon className="w-full h-full text-white" />
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(139,92,246,0)',
                          '0 0 30px rgba(139,92,246,0.5)',
                          '0 0 0px rgba(139,92,246,0)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.4,
                      }}
                    />
                  </div>
                </motion.div>

                {/* Plan name and price */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/ {plan.period}</span>
                </div>
                <p className="text-gray-400 mb-8">{plan.description}</p>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + featureIndex * 0.1 }}
                    >
                      <motion.div
                        className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mt-0.5`}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                      <span className="text-gray-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  onClick={onGetStarted}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {plan.price === '$0' ? 'Start Free' : 'Get Started'}
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <motion.p 
            className="text-green-400 text-lg font-semibold"
            animate={{
              textShadow: [
                '0 0 20px rgba(34,197,94,0.5)',
                '0 0 40px rgba(34,197,94,0.8)',
                '0 0 20px rgba(34,197,94,0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✓ 30-Day Money-Back Guarantee • No Questions Asked
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

