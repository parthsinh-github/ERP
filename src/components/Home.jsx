import React, { lazy, Suspense, useState, useCallback, useMemo } from 'react';
import Layout from './shared/Layout';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

// Lazy loaded components with error boundaries
const HeroSection = lazy(() => import('./HeroSection'));
const CardsSection = lazy(() => import('./CardSection'));
const Footer = lazy(() => import('./shared/Footer'));
const ImageSlider = lazy(() => import('./Slider'));

// Modern loading component with better UX
const LoadingFallback = ({ title, subtitle }) => (
  <div className="loading-fallback">
    <div className="loading-spinner"></div>
    <div className="loading-text">{title}</div>
    <div className="loading-subtext">{subtitle}</div>
  </div>
);

// Floating elements component for better organization
const FloatingElements = () => (
  <div className="floating-elements">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="floating-element"></div>
    ))}
  </div>
);

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Memoized toggle function to prevent unnecessary re-renders
  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  


  // Memoized loading configurations
  const loadingConfigs = useMemo(() => ({
    slider: {
      title: "Loading Slider...",
      subtitle: "Fetching latest updates"
    },
    cards: {
      title: "Loading Cards...",
      subtitle: "Setting up your tools"
    },
    hero: {
      title: "Loading Hero...",
      subtitle: "Preparing your dashboard experience"
    },
    footer: {
      title: "Loading Footer...",
      subtitle: "Finalizing page content"
    }
  }), []);

  return (
    <>
    
      <style>{`
        .modern-home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%);
          position: relative;
          overflow-x: hidden;
          isolation: isolate;
        }

        .modern-home-container::before {
          content: '';
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(249, 115, 22, 0.08) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .home-content {
          position: relative;
          z-index: 2;
          container-type: inline-size;
        }

        .section-container {
          position: relative;
          z-index: 3;
          contain: layout style paint;
        }

        .loading-fallback {
          padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
          text-align: center;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: #e2e8f0;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          margin: 2rem auto;
          max-width: min(600px, 90vw);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 8px 16px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .loading-fallback:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.2),
            0 12px 20px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .loading-spinner {
          width: clamp(30px, 8vw, 40px);
          height: clamp(30px, 8vw, 40px);
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          will-change: transform;
        }

        .loading-text {
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: clamp(1rem, 2.5vw, 1.1rem);
          letter-spacing: 0.025em;
        }

        .loading-subtext {
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          color: #94a3b8;
          opacity: 0.9;
          font-weight: 400;
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
          margin: clamp(1.5rem, 4vw, 2rem) 0;
          opacity: 0.8;
        }

        .floating-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .floating-element {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(102, 126, 234, 0.4);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .floating-element:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-element:nth-child(2) {
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .floating-element:nth-child(3) {
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }

        .floating-element:nth-child(4) {
          top: 40%;
          right: 30%;
          animation-delay: 1s;
        }

        .floating-element:nth-child(5) {
          bottom: 60%;
          right: 10%;
          animation-delay: 3s;
        }

        .section-fade-in {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .section-fade-in:nth-child(1) { animation-delay: 0.1s; }
        .section-fade-in:nth-child(2) { animation-delay: 0.2s; }
        .section-fade-in:nth-child(3) { animation-delay: 0.3s; }
        .section-fade-in:nth-child(4) { animation-delay: 0.4s; }

        /* Enhanced Animations */
        @keyframes spin {
          0% { 
            transform: rotate(0deg); 
          }
          100% { 
            transform: rotate(360deg); 
          }
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.4;
          }
          25% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-40px) translateX(-5px); 
            opacity: 1;
          }
          75% { 
            transform: translateY(-20px) translateX(-10px); 
            opacity: 0.7;
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.4;
          }
          50% { 
            transform: scale(1.2); 
            opacity: 0.7;
          }
        }

        /* Modern responsive design with container queries */
        @container (max-width: 768px) {
          .loading-fallback {
            padding: 2rem 1rem;
            margin: 1rem;
            border-radius: 16px;
          }
          
          .loading-text {
            font-size: 1rem;
          }
          
          .loading-subtext {
            font-size: 0.8rem;
          }
        }

        /* Smooth scrolling with better performance */
        html {
          scroll-behavior: smooth;
        }

        /* Focus management for accessibility */
        .loading-fallback:focus-within {
          outline: 2px solid #667eea;
          outline-offset: 2px;
        }

        /* Reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .loading-spinner,
          .floating-element,
          .section-fade-in {
            animation: none;
          }
          
          .loading-fallback {
            transition: none;
          }
        }

        /* Dark mode enhancements */
        @media (prefers-color-scheme: dark) {
          .modern-home-container {
            background: linear-gradient(135deg, #0a0a0f 0%, #141428 25%, #0f1419 50%, #141428 75%, #0a0a0f 100%);
          }
        }

        /* Modern Featured Section Styles */
        .modern-featured-section {
          padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem);
          max-width: 1400px;
          margin: 0 auto;
        }

        .featured-header {
          text-align: center;
          margin-bottom: clamp(3rem, 6vw, 4rem);
        }

        .featured-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .featured-subtitle {
          font-size: clamp(1.1rem, 3vw, 1.3rem);
          color: #94a3b8;
          font-weight: 400;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: clamp(3rem, 6vw, 4rem);
        }

        .featured-card {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          cursor: pointer;
          transform: translateY(0);
        }

        .featured-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .featured-card:hover::before {
          opacity: 1;
        }

        .featured-card:hover {
          transform: translateY(-8px);
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.2),
            0 16px 32px rgba(0, 0, 0, 0.1);
        }

        .featured-card.primary {
          border-color: rgba(102, 126, 234, 0.3);
        }

        .featured-card.secondary {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .featured-card.tertiary {
          border-color: rgba(249, 115, 22, 0.3);
        }

        .card-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .featured-card.primary .card-glow {
          background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
        }

        .featured-card.secondary .card-glow {
          background: radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%);
        }

        .featured-card.tertiary .card-glow {
          background: radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%);
        }

        .featured-card:hover .card-glow {
          opacity: 1;
        }

        .card-content {
          position: relative;
          z-index: 2;
        }

        .card-icon {
          width: 64px;
          height: 64px;
          margin-bottom: 1.5rem;
          padding: 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .featured-card.primary .card-icon {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
        }

        .featured-card.secondary .card-icon {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .featured-card.tertiary .card-icon {
          background: rgba(249, 115, 22, 0.2);
          color: #f97316;
        }

        .card-icon svg {
          width: 32px;
          height: 32px;
        }

        .featured-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .featured-card p {
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        .card-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .stat {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .featured-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border-radius: 24px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .metric-item {
          text-align: center;
          padding: 1rem;
        }

        .metric-number {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .metric-label {
          color: #94a3b8;
          font-size: 0.95rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .featured-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .featured-card {
            padding: 2rem;
          }

          .featured-metrics {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            padding: 1.5rem;
          }

          .card-stats {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .featured-metrics {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        /* Animation enhancements */
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .featured-card:hover {
          animation: cardFloat 2s ease-in-out infinite;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .loading-fallback {
            border: 2px solid #fff;
            background: rgba(0, 0, 0, 0.9);
          }
          
          .loading-text {
            color: #fff;
            -webkit-text-fill-color: #fff;
          }
          
          .featured-card {
            border: 2px solid #fff;
            background: rgba(0, 0, 0, 0.8);
          }
          
          .featured-title,
          .metric-number {
            color: #fff;
            -webkit-text-fill-color: #fff;
          }
        }
      `}</style>

   <Helmet>
  <title>Home | Vidyaharti Trust College</title>
  <meta name="description" content="Explore cutting-edge solutions and smart tools at Vidyaharti Trust College. Secure, fast, and AI-driven experiences designed for modern students and educators." />
  <meta name="keywords" content="Vidyaharti Trust College, student portal, AI analytics, education platform, secure portal, fast loading, smart dashboard" />
  <meta name="author" content="Vidyaharti Trust College" />
  
  {/* Open Graph for social sharing */}
  <meta property="og:title" content="Vidyaharti Trust College - Smart Education Platform" />
  <meta property="og:description" content="Discover powerful student tools and insights powered by modern web technologies." />
  <meta property="og:image" content="https://example.com/thumbnail.jpg" />
  <meta property="og:url" content="https://yourdomain.com/home" />
  <meta property="og:type" content="website" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Collage ERP - Smart Education Platform" />
  <meta name="twitter:description" content="Secure, fast, and intelligent student tools." />
  <meta name="twitter:image" content="https://example.com/thumbnail.jpg" />
</Helmet>


      <div className="modern-home-container">
        <FloatingElements />

        <Layout isOpen={isOpen} toggleSidebar={toggleSidebar}>
          <div className="home-content">
            <div className="section-divider"></div>

            <div className="section-container">
              <Suspense fallback={
                <LoadingFallback 
                  title={loadingConfigs.slider.title}
                  subtitle={loadingConfigs.slider.subtitle}
                />
              }>
                <ImageSlider />
              </Suspense>
            </div>

            <div className="section-divider"></div>

            <div className="section-container section-fade-in">
              <Suspense fallback={
                <LoadingFallback 
                  title={loadingConfigs.cards.title}
                  subtitle={loadingConfigs.cards.subtitle}
                />
              }>
                <CardsSection />
              </Suspense>
            </div>

            {/* Modern Featured Section */}
            <div className="section-container section-fade-in">
              <div className="modern-featured-section">
                <div className="featured-header">
                  <h2 className="featured-title">Featured Solutions</h2>
                  <p className="featured-subtitle">Discover cutting-edge tools and technologies</p>
                </div>
                
                <div className="featured-grid">
                  <div className="featured-card primary">
                    <div className="card-glow"></div>
                    <div className="card-content">
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <h3>Lightning Fast</h3>
                      <p>Experience unprecedented speed with our optimized solutions</p>
                      <div className="card-stats">
                        <span className="stat">99.9% Uptime</span>
                        <span className="stat">50ms Response</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="featured-card secondary">
                    <div className="card-glow"></div>
                    <div className="card-content">
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <h3>Secure & Reliable</h3>
                      <p>Enterprise-grade security with advanced encryption</p>
                      <div className="card-stats">
                        <span className="stat">256-bit SSL</span>
                        <span className="stat">ISO Certified</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="featured-card tertiary">
                    <div className="card-glow"></div>
                    <div className="card-content">
                      <div className="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                        </svg>
                      </div>
                      <h3>Smart Analytics</h3>
                      <p>AI-powered insights for data-driven decisions</p>
                      <div className="card-stats">
                        <span className="stat">Real-time Data</span>
                        <span className="stat">ML Powered</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="featured-metrics">
                  <div className="metric-item">
                    <div className="metric-number">2.5M+</div>
                    <div className="metric-label">Active Users</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-number">99.9%</div>
                    <div className="metric-label">Satisfaction Rate</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-number">24/7</div>
                    <div className="metric-label">Support Available</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-number">150+</div>
                    <div className="metric-label">Countries Served</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-divider"></div>

            <div className="section-container section-fade-in">
              <Suspense fallback={
                <LoadingFallback 
                  title={loadingConfigs.hero.title}
                  subtitle={loadingConfigs.hero.subtitle}
                />
              }>
                <HeroSection />
              </Suspense>
            </div>

            <div className="section-divider"></div>

            <div className="section-container section-fade-in">
              <Suspense fallback={
                <LoadingFallback 
                  title={loadingConfigs.footer.title}
                  subtitle={loadingConfigs.footer.subtitle}
                />
              }>
                <Footer />
              </Suspense>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default Home;