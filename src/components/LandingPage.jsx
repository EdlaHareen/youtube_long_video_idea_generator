export default function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">IdeaPilot</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <button onClick={onGetStarted} className="nav-cta">Get Started</button>
        </div>
      </nav>

      <section className="hero-section">
        <h1 className="hero-main-title">
          Generate Viral YouTube Ideas
          <br />
          In Minutes, Not Hours
        </h1>
        <p className="hero-description">
          Your AI co-pilot analyzes 50+ competitor videos to deliver data-driven content ideas
          <br />
          tailored to your unique channel style
        </p>
        <button onClick={onGetStarted} className="hero-cta">
          Get Started Free
        </button>
        <div className="hero-mockup">
          <div className="mockup-placeholder">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="mockup-content">
              <div className="mockup-line"></div>
              <div className="mockup-line short"></div>
              <div className="mockup-line"></div>
              <div className="mockup-grid">
                <div className="mockup-card"></div>
                <div className="mockup-card"></div>
                <div className="mockup-card"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="social-proof">
        <p className="social-proof-text">Trusted by content creators worldwide</p>
        <div className="trust-badges">
          <div className="badge">10K+ Creators</div>
          <div className="badge">50M+ Views Generated</div>
          <div className="badge">98% Satisfaction</div>
        </div>
      </section>

      <section id="features" className="use-cases-section">
        <h2 className="section-title">Perfect For Every Creator</h2>
        <div className="use-cases-grid">
          <div className="use-case-card">
            <div className="use-case-icon">🎬</div>
            <h3>New Creators</h3>
            <p>Starting your channel? Get proven video ideas that work in your niche without months of trial and error.</p>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">📈</div>
            <h3>Growth Stage</h3>
            <p>Scale your content consistently with AI-powered ideas that match your audience's preferences.</p>
          </div>
          <div className="use-case-card">
            <div className="use-case-icon">💡</div>
            <h3>Established Channels</h3>
            <p>Stay ahead of trends and discover untapped content opportunities in your space.</p>
          </div>
        </div>
      </section>

      <section className="pain-points-section">
        <h2 className="section-title">The Content Creation Struggle</h2>
        <div className="pain-points-grid">
          <div className="pain-point-card">
            <div className="pain-icon">⏰</div>
            <h3>Hours of Research</h3>
            <p>Spending days analyzing competitors manually, only to end up with generic ideas.</p>
          </div>
          <div className="pain-point-card">
            <div className="pain-icon">🎲</div>
            <h3>Guessing What Works</h3>
            <p>Creating content based on hunches instead of data, leading to inconsistent views.</p>
          </div>
          <div className="pain-point-card">
            <div className="pain-icon">🔄</div>
            <h3>Creative Burnout</h3>
            <p>Running out of fresh ideas while trying to maintain a consistent upload schedule.</p>
          </div>
        </div>
      </section>

      <section className="why-us-section">
        <h2 className="section-title">Why IdeaPilot Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-number">01</div>
            <h3>Data-Driven Analysis</h3>
            <p>We analyze real video performance metrics across 50+ competitors to identify what actually works.</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">02</div>
            <h3>Personalized To Your Style</h3>
            <p>Ideas are tailored to your unique channel voice and audience, not generic templates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">03</div>
            <h3>Complete Video Outlines</h3>
            <p>Get full scripts with hooks, sections, and CTAs - ready to record immediately.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Enter Your Topic</h3>
              <p>Tell us what niche or keyword you want to create content about.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Add Your Channel Brief</h3>
              <p>Describe your style, audience, and unique angle in a few sentences.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Custom Ideas</h3>
              <p>Receive 10+ video ideas with full outlines tailored to your channel.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <h2 className="section-title">What You Get</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">✨</div>
            <h3>Unique Angles</h3>
            <p>Every idea is customized to stand out from competitors</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📊</div>
            <h3>Performance Data</h3>
            <p>See view counts and engagement metrics from source videos</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📝</div>
            <h3>Full Outlines</h3>
            <p>Complete video scripts with hooks and structure</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3>Instant Results</h3>
            <p>Get ideas in 2-3 minutes, not days of research</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing-section">
        <h2 className="section-title">Simple Pricing</h2>
        <p className="section-subtitle">Start free, upgrade as you grow</p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="plan-name">Free</h3>
            <div className="plan-price">
              <span className="price">$0</span>
              <span className="period">/forever</span>
            </div>
            <ul className="plan-features">
              <li>✓ 3 video ideas per search</li>
              <li>✓ Basic outlines</li>
              <li>✓ View competitor data</li>
            </ul>
            <button onClick={onGetStarted} className="plan-cta">Get Started</button>
          </div>

          <div className="pricing-card featured">
            <div className="popular-badge">Popular</div>
            <h3 className="plan-name">Pro</h3>
            <div className="plan-price">
              <span className="price">$29</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li>✓ Unlimited video ideas</li>
              <li>✓ Full detailed outlines</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
            </ul>
            <button onClick={onGetStarted} className="plan-cta primary">Start Free Trial</button>
          </div>

          <div className="pricing-card">
            <h3 className="plan-name">Agency</h3>
            <div className="plan-price">
              <span className="price">$99</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li>✓ Everything in Pro</li>
              <li>✓ 5 team members</li>
              <li>✓ White-label reports</li>
              <li>✓ Dedicated support</li>
            </ul>
            <button onClick={onGetStarted} className="plan-cta">Contact Sales</button>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2 className="section-title">Loved By Creators</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">
              "IdeaPilot helped me go from 500 to 50K subscribers in 6 months. The ideas are always spot-on and save me hours of research."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SM</div>
              <div className="author-info">
                <div className="author-name">Sarah Martinez</div>
                <div className="author-role">Tech Channel, 50K subs</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">
              "As a full-time creator, consistency is key. This tool gives me a pipeline of proven ideas so I never miss an upload."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">JC</div>
              <div className="author-info">
                <div className="author-name">James Chen</div>
                <div className="author-role">Finance Channel, 120K subs</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">
              "The outlines are incredibly detailed. I literally copy-paste and start recording. Game changer for my workflow."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">ER</div>
              <div className="author-info">
                <div className="author-name">Emma Rodriguez</div>
                <div className="author-role">Lifestyle Channel, 35K subs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">Ready To Create Better Content?</h2>
        <p className="cta-subtitle">Join thousands of creators using IdeaPilot to grow their channels</p>
        <button onClick={onGetStarted} className="cta-button">
          Get Started Free - No Credit Card Required
        </button>
      </section>

      <section id="faq" className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <details className="faq-item">
            <summary>How does IdeaPilot analyze competitor content?</summary>
            <p>We use AI to analyze top-performing videos in your niche, looking at titles, thumbnails, view counts, and engagement metrics to identify patterns and opportunities.</p>
          </details>
          <details className="faq-item">
            <summary>Do I need to provide competitor channel names?</summary>
            <p>No! Just enter your topic or keyword, and our AI will automatically find and analyze the most relevant competitor videos.</p>
          </details>
          <details className="faq-item">
            <summary>How are ideas personalized to my channel?</summary>
            <p>Your channel brief helps our AI understand your unique voice, audience, and style. Every idea is rewritten to match your specific approach.</p>
          </details>
          <details className="faq-item">
            <summary>Can I use the ideas directly without changes?</summary>
            <p>Yes! Our outlines are production-ready with hooks, sections, and CTAs. You can record immediately or customize further.</p>
          </details>
          <details className="faq-item">
            <summary>What makes IdeaPilot different from other tools?</summary>
            <p>Unlike generic idea generators, we analyze real performance data and personalize every idea to your channel's unique style and audience.</p>
          </details>
          <details className="faq-item">
            <summary>Is there a free trial?</summary>
            <p>Yes! Start with our free plan to generate ideas. Upgrade anytime for unlimited searches and advanced features.</p>
          </details>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4 className="footer-brand">IdeaPilot</h4>
            <p className="footer-tagline">Your AI co-pilot for YouTube success</p>
          </div>
          <div className="footer-column">
            <h5>Product</h5>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#how-it-works">How It Works</a>
          </div>
          <div className="footer-column">
            <h5>Company</h5>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
          </div>
          <div className="footer-column">
            <h5>Connect</h5>
            <a href="#twitter">Twitter</a>
            <a href="#youtube">YouTube</a>
            <a href="#discord">Discord</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 IdeaPilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
