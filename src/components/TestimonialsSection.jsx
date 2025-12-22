import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Tech YouTuber',
    avatar: '👩‍💻',
    content: 'IdeaPilot saved me 10+ hours every week. I went from posting once a week to 3x a week. My channel grew 400% in 3 months!',
    rating: 5,
    stats: '400% Growth',
  },
  {
    name: 'Mike Chen',
    role: 'Gaming Creator',
    avatar: '🎮',
    content: 'The AI actually understands gaming trends. Every idea it suggests hits. My average views doubled since I started using it.',
    rating: 5,
    stats: '2x Views',
  },
  {
    name: 'Emma Davis',
    role: 'Lifestyle Vlogger',
    avatar: '✨',
    content: "I was stuck at 10k subs for months. IdeaPilot's trending ideas helped me hit 100k in just 4 months. Game changer!",
    rating: 5,
    stats: '10x Growth',
  },
];

export function TestimonialsSection() {
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
          <motion.div
            className="inline-block mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-6xl">⭐</span>
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Loved By Creators
          </motion.h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Join thousands of creators growing their channels
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className="h-full bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all relative overflow-hidden"
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 20px 60px rgba(139,92,246,0.3)',
                }}
              >
                {/* Quote icon background */}
                <motion.div
                  className="absolute top-4 right-4 opacity-10"
                  animate={{ 
                    rotate: [0, 10, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                >
                  <Quote className="w-20 h-20 text-purple-500" />
                </motion.div>

                {/* Rating stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                      whileHover={{ 
                        scale: 1.3,
                        rotate: 360,
                      }}
                    >
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-6 relative z-10 italic">
                  "{testimonial.content}"
                </p>

                {/* Stats badge */}
                <motion.div
                  className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold border border-green-500/30 mb-6"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(34,197,94,0)',
                      '0 0 20px rgba(34,197,94,0.3)',
                      '0 0 0px rgba(34,197,94,0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  📈 {testimonial.stats}
                </motion.div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-2xl"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 360,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>

                {/* Hover shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          className="mt-20 flex flex-wrap items-center justify-center gap-8 text-gray-400"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          {[
            '10,000+ Happy Creators',
            '1M+ Ideas Generated',
            '4.9/5 Average Rating',
            '95% Satisfaction Rate',
          ].map((item, index) => (
            <motion.div
              key={item}
              className="flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

