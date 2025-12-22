import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function InputForm({ onSubmit, isLoading }) {
  const [keyword, setKeyword] = useState('');
  const [channelBrief, setChannelBrief] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!keyword.trim()) {
      newErrors.keyword = 'Please enter a keyword or topic';
    }
    if (!channelBrief.trim()) {
      newErrors.channelBrief = 'Please provide your channel brief';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(keyword, channelBrief);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="input-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="form-group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label htmlFor="keyword">
          Keyword or Topic <span className="required">*</span>
        </label>
        <input
          type="text"
          id="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='e.g., "Gemini 3", "AI automation", "productivity hacks"'
          disabled={isLoading}
          className={errors.keyword ? 'error' : ''}
          aria-required="true"
          aria-invalid={errors.keyword ? 'true' : 'false'}
        />
        {errors.keyword && (
          <motion.span 
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errors.keyword}
          </motion.span>
        )}
      </motion.div>

      <motion.div 
        className="form-group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="channelBrief">
          Channel Brief <span className="required">*</span>
        </label>
        <textarea
          id="channelBrief"
          value={channelBrief}
          onChange={(e) => setChannelBrief(e.target.value)}
          placeholder="Describe your content style, target audience, and unique perspective..."
          rows="5"
          disabled={isLoading}
          className={errors.channelBrief ? 'error' : ''}
          aria-required="true"
          aria-invalid={errors.channelBrief ? 'true' : 'false'}
        />
        <span className="helper-text">
          Tell us about your channel's style and audience to get personalized video ideas
        </span>
        {errors.channelBrief && (
          <motion.span 
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errors.channelBrief}
          </motion.span>
        )}
      </motion.div>

      <motion.button
        type="submit"
        className="submit-button"
        disabled={isLoading}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? 'Analyzing...' : (
          <>
            Generate Ideas <ArrowRight size={18} />
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
