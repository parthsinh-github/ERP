import React, { lazy, Suspense, useState } from 'react';
import Layout from './shared/Layout';
import { useParams } from 'react-router-dom';

const HeroSection = lazy(() => import('./HeroSection'));
const CardsSection = lazy(() => import('./CardSection'));
const Footer = lazy(() => import('./shared/Footer'));
const ImageSlider = lazy(() => import('./Slider')); // ✅ Lazy load added here

const Home = () => {

  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <style>{`
        .modern-home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%);
          position: relative;
          overflow-x: hidden;
        }

        .modern-home-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(249, 115, 22, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
        }

        .home-content {
          position: relative;
          z-index: 2;
        }

        .section-container {
          position: relative;
          z-index: 3;
        }

        .loading-fallback {
          padding: 4rem 2rem;
          text-align: center;
          font-size: 1.2rem;
          color: #e2e8f0;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          margin: 2rem auto;
          max-width: 600px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 1.1rem;
        }

        .loading-subtext {
          font-size: 0.9rem;
          color: #94a3b8;
          opacity: 0.8;
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
          margin: 2rem 0;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .floating-element {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(102, 126, 234, 0.3);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
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
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .section-fade-in:nth-child(1) {
          animation-delay: 0.1s;
        }

        .section-fade-in:nth-child(2) {
          animation-delay: 0.2s;
        }

        .section-fade-in:nth-child(3) {
          animation-delay: 0.3s;
        }

        .section-fade-in:nth-child(4) {
          animation-delay: 0.4s;
        }

        /* Animations */
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
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-40px) translateX(-5px); 
            opacity: 0.9;
          }
          75% { 
            transform: translateY(-20px) translateX(-10px); 
            opacity: 0.6;
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
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.2); 
            opacity: 0.6;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .loading-fallback {
            padding: 2rem 1rem;
            margin: 1rem;
            font-size: 1rem;
          }
          
          .loading-spinner {
            width: 30px;
            height: 30px;
          }
          
          .loading-text {
            font-size: 1rem;
          }
          
          .loading-subtext {
            font-size: 0.8rem;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="modern-home-container">
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        <Layout isOpen={isOpen} toggleSidebar={toggleSidebar}>
          <div className="home-content">


            <div className="section-divider"></div>

            <div className="section-container ">
              <Suspense fallback={
                <div className="loading-fallback">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Loading Slider...</div>
                  <div className="loading-subtext">Fetching latest updates</div>
                </div>
              }>
                <ImageSlider />
              </Suspense>
            </div>

            <div className="section-divider"></div>

            <div className="section-container section-fade-in">
              <Suspense fallback={
                <div className="loading-fallback">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Loading Cards...</div>
                  <div className="loading-subtext">Setting up your tools</div>
                </div>
              }>
                <CardsSection />
              </Suspense>
            </div>

            <div className="section-container section-fade-in">
              <Suspense fallback={
                <div className="loading-fallback">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Loading Hero...</div>
                  <div className="loading-subtext">Preparing your dashboard experience</div>
                </div>
              }>
                <HeroSection />
              </Suspense>
            </div>
            <div className="section-divider"></div>

            <div className="section-container section-fade-in">
              <Suspense fallback={
                <div className="loading-fallback">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Loading Footer...</div>
                  <div className="loading-subtext">Finalizing page content</div>
                </div>

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