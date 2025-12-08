import { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="input-form">
      <div className="form-group">
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
        {errors.keyword && <span className="error-message">{errors.keyword}</span>}
      </div>

      <div className="form-group">
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
        {errors.channelBrief && <span className="error-message">{errors.channelBrief}</span>}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : '🚀 Generate Ideas'}
      </button>
    </form>
  );
}
