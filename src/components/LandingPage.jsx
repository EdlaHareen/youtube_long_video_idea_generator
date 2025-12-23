import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Twitter, Youtube, Instagram, Linkedin } from 'lucide-react';
import { FeaturesSection } from './FeaturesSection';
import { ContentStruggleSection } from './ContentStruggleSection';
import { WhatYouGetSection } from './WhatYouGetSection';
import { PricingSection } from './PricingSection';
import { TestimonialsSection } from './TestimonialsSection';
import { CTASection } from './CTASection';
import { FAQSection } from './FAQSection';
import { FooterSection } from './FooterSection';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage({ onGetStarted, onFavoritesClick, onSettingsClick, onAdminClick }) {
  const [isHovering, setIsHovering] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();

  // Close modal and navigate when user successfully authenticates
  useEffect(() => {
    if (isAuthenticated && showAuthModal) {
      setShowAuthModal(false);
      // Small delay to let UI update, then navigate to form
      const timer = setTimeout(() => {
        onGetStarted();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, showAuthModal, onGetStarted]);

  const handleSignInClick = () => {
    if (isAuthenticated) {
      // If already authenticated, just go to the form
      onGetStarted();
    } else {
      // Show auth modal
      setShowAuthModal(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Hero Section with Nav */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Navigation */}
        <motion.nav 
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-6 h-6 text-purple-500" />
              <span className="font-bold text-xl">IdeaPilot</span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Pricing', 'How It Works', 'FAQ'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-400 hover:text-white transition-colors relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            {isAuthenticated ? (
              <UserMenu 
                onFavoritesClick={onFavoritesClick}
                onSettingsClick={onSettingsClick}
                onAdminClick={onAdminClick}
              />
            ) : (
              <motion.button 
                onClick={handleSignInClick}
                className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-purple-500 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            )}
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6"
              animate={{ 
                boxShadow: ['0 0 20px rgba(139,92,246,0.3)', '0 0 40px rgba(139,92,246,0.5)', '0 0 20px rgba(139,92,246,0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="bg-purple-500/20 text-purple-300 px-6 py-2 rounded-full text-sm border border-purple-500/30">
                ✨ AI-Powered Content Creation
              </span>
            </motion.div>

            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Generate Viral YouTube Ideas
            </motion.h1>

            <motion.p 
              className="text-3xl md:text-4xl font-bold mb-4 text-purple-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              In Minutes, Not Hours
            </motion.p>

            <motion.p 
              className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Stop staring at blank screens. Get AI-generated video ideas, scripts, and thumbnails in seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
            >
              <motion.button 
                onClick={handleSignInClick}
                className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 transition-all relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-300"
                  initial={{ x: '-100%' }}
                  animate={{ x: isHovering ? '0%' : '-100%' }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <motion.span
                    animate={{ x: isHovering ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>

            <motion.p 
              className="text-gray-500 text-sm mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              No credit card required • 7-day free trial
            </motion.p>
          </motion.div>

          {/* Video Demo Mockup */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent" />
              <div className="h-[400px] flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                    rotate: [0, 1, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Sparkles className="w-20 h-20 text-purple-500/50" />
                </motion.div>
              </div>
            </div>
            
            {/* Floating cards */}
            <motion.div
              className="absolute -left-10 top-10 bg-gray-900 border border-white/10 rounded-lg p-4 shadow-xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <p className="text-green-400 text-sm">✓ Idea Generated</p>
            </motion.div>

            <motion.div
              className="absolute -right-10 bottom-10 bg-gray-900 border border-white/10 rounded-lg p-4 shadow-xl"
              animate={{ 
                y: [0, 10, 0],
                rotate: [2, -2, 2],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <p className="text-purple-400 text-sm">✓ Script Ready</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* Content Struggle Section */}
      <ContentStruggleSection />

      {/* What You Get Section */}
      <WhatYouGetSection />

      {/* Pricing Section */}
      <PricingSection onGetStarted={handleSignInClick} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection onGetStarted={handleSignInClick} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer Section */}
      <FooterSection />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

