import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'How does IdeaPilot generate ideas?',
    answer: 'IdeaPilot uses advanced AI trained on millions of successful YouTube videos. It analyzes current trends, your niche, competitor performance, and audience behavior to generate ideas with high viral potential.',
  },
  {
    question: 'Can I customize the generated ideas?',
    answer: 'Absolutely! Every idea can be edited and customized to match your style. The AI provides a strong foundation, but you have complete control to make it your own.',
  },
  {
    question: 'What niches does it work for?',
    answer: 'IdeaPilot works for all niches - gaming, tech, lifestyle, education, business, fitness, and more. The AI adapts to your specific content style and audience.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! We offer a 7-day free trial with no credit card required. You can generate up to 5 ideas to see if IdeaPilot is right for you.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time with no penalties or fees. We also offer a 30-day money-back guarantee if you\'re not satisfied.',
  },
  {
    question: 'How accurate are the performance predictions?',
    answer: 'Our AI analyzes hundreds of data points to predict potential performance. While no prediction is 100% accurate, our users report 85%+ correlation between predictions and actual results.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-32 px-4 relative bg-gradient-to-b from-black via-purple-950/5 to-black">
      <div className="max-w-4xl mx-auto">
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
            Frequently Asked Questions
          </motion.h2>
          <p className="text-gray-400 text-xl">
            Everything you need to know about IdeaPilot
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`bg-gradient-to-b from-gray-900 to-black border rounded-2xl overflow-hidden transition-all ${
                  openIndex === index 
                    ? 'border-purple-500/50 shadow-lg shadow-purple-500/20' 
                    : 'border-white/10 hover:border-purple-500/30'
                }`}
                whileHover={{ 
                  scale: openIndex === index ? 1 : 1.02,
                }}
              >
                <button
                  className="w-full p-6 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-lg font-semibold pr-8">{faq.question}</span>
                  
                  <motion.div
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30"
                    animate={{ 
                      rotate: openIndex === index ? 180 : 0,
                      backgroundColor: openIndex === index ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.1)',
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Plus className="w-5 h-5 text-purple-400" />
                    )}
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="px-6 pb-6"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                      >
                        <div className="h-px bg-gradient-to-r from-purple-500 to-transparent mb-4" />
                        <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <motion.button
            className="bg-white/10 hover:bg-purple-500/20 text-white px-8 py-3 rounded-full font-semibold border border-white/10 hover:border-purple-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

