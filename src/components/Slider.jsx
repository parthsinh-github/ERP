// src/components/Slider.jsx
import React, { useEffect, useState, useRef } from 'react';

import LocalImage from '../assets/istockphoto-1143715422-612x612.webp';
import LocalImage1 from '../assets/istockphoto-1633281467-612x612.webp';
import LocalImage2 from '../assets/istockphoto-493958679-612x612-2.webp';
import LocalImage3 from '../assets/pexels-rdne-8124374_11zon.jpg';
import LocalImage4 from '../assets/pexels-greta-hoffman-7859092_11zon.jpg';
import LocalImage5 from '../assets/photo-1591123120675-6f7f1aae0e5b.webp';
import LocalImage6 from '../assets/photo-1707202951207-ac2f8510e102.webp';
import LocalImage7 from '../assets/premium_photo-1680807868955-805266ef99f0.webp';
import LocalImage8 from '../assets/pexels-cottonbro-8371715_11zon.jpg';

const images = [
  { src: LocalImage, alt: "Audience at the conference hall", category: "Events" },
  { src: LocalImage1, alt: "Business people talking during coffee break", category: "Business" },
  { src: LocalImage2, alt: "Cake cutting ceremony at event", category: "Celebrations" },
  { src: LocalImage3, alt: "Students sitting in classroom", category: "Education" },
  { src: LocalImage4, alt: "School corridor with students", category: "Campus" },
  { src: LocalImage5, alt: "College event celebration", category: "Festivities" },
  { src: LocalImage6, alt: "Speaker at college seminar", category: "Seminars" },
  { src: LocalImage7, alt: "Students cheering at fest", category: "Culture" },
  { src: LocalImage8, alt: "Students cheering at fest", category: "Spirit" },
];

const Slider = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const sliderRef = useRef(null);

  // Customizable dimensions
  const imageConfig = {
    width: 280,
    height: 380,
    gap: 24,
    borderRadius: 20
  };

  useEffect(() => {
    const totalWidth = images.length * (imageConfig.width + imageConfig.gap);
    
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes infiniteScroll {
        from { 
          transform: translateX(0); 
        }
        to { 
          transform: translateX(-${totalWidth}px); 
        }
      }
      
      @keyframes pulseGlow {
        0%, 100% { 
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        50% { 
          box-shadow: 
            0 12px 48px rgba(102, 126, 234, 0.4),
            0 8px 24px rgba(102, 126, 234, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
      }
      
      @keyframes floatUp {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes categoryFade {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [imageConfig]);

  const handleImageClick = (image, index) => {
    setSelectedImage({ ...image, index });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <style>{`
        .modern-slider-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          max-width: 100vw;
          margin: 0 auto;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%);
          padding: clamp(2rem, 5vw, 4rem) 0;
          border-radius: 32px;
          position: relative;
          isolation: isolate;
        }

        .modern-slider-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
          border-radius: 32px;
          pointer-events: none;
        }

        .slider-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 2;
        }

        .slider-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .slider-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: #94a3b8;
          font-weight: 400;
          max-width: 600px;
          margin: 0 auto;
        }

        .modern-slider {
          position: relative;
          z-index: 2;
        }

        .slider-track {
          display: flex;
          gap: ${imageConfig.gap}px;
          animation: infiniteScroll 25s linear infinite;
          animation-play-state: ${isHovered ? 'paused' : 'running'};
          will-change: transform;
        }

        .slider-track:hover {
          animation-play-state: paused;
        }

        .modern-image-container {
          position: relative;
          width: ${imageConfig.width}px;
          height: ${imageConfig.height}px;
          flex-shrink: 0;
          cursor: pointer;
          border-radius: ${imageConfig.borderRadius}px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modern-image-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
          z-index: 2;
        }

        .modern-image-container:hover::before {
          transform: translateX(100%);
        }

        .modern-image-container:hover {
          transform: translateY(-16px) scale(1.05);
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.4),
            0 16px 32px rgba(102, 126, 234, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .modern-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
        }

        .modern-image-container:hover .modern-image {
          transform: scale(1.1);
          filter: brightness(1.1) contrast(1.1);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 0, 0, 0.3) 70%,
            rgba(0, 0, 0, 0.8) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 3;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.5rem;
        }

        .modern-image-container:hover .image-overlay {
          opacity: 1;
        }

        .image-category {
          background: rgba(102, 126, 234, 0.9);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          width: fit-content;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: categoryFade 0.3s ease;
        }

        .image-description {
          color: white;
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.4;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .slider-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          position: relative;
          z-index: 2;
        }

        .control-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .control-btn:hover {
          background: rgba(102, 126, 234, 0.2);
          border-color: rgba(102, 126, 234, 0.4);
          transform: translateY(-2px);
        }

        .image-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(20px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-image {
          width: 100%;
          height: auto;
          max-height: 80vh;
          object-fit: cover;
        }

        .modal-info {
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.8);
          color: white;
        }

        .modal-category {
          background: rgba(102, 126, 234, 0.9);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
          width: fit-content;
        }

        .modal-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .close-btn:hover {
          background: rgba(255, 0, 0, 0.7);
          transform: scale(1.1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modern-slider-container {
            padding: 2rem 1rem;
          }
          
          .modern-image-container {
            width: ${imageConfig.width * 0.8}px;
            height: ${imageConfig.height * 0.8}px;
          }
          
          .slider-track {
            gap: ${imageConfig.gap * 0.8}px;
          }
          
          .image-overlay {
            padding: 1rem;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .slider-track {
            animation: none;
          }
          
          .modern-image-container {
            transition: none;
          }
        }
      `}</style>

      <div className="modern-slider-container">
        <div className="slider-header">
          <h2 className="slider-title">Gallery Showcase</h2>
          <p className="slider-subtitle">Discover moments that inspire and memories that last</p>
        </div>

        <div 
          className="modern-slider"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="slider-track" ref={sliderRef}>
            {images.concat(images).map((img, index) => (
              <div
                key={index}
                className="modern-image-container"
                onClick={() => handleImageClick(img, index)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="modern-image"
                />
                <div className="image-overlay">
                  <div className="image-category">{img.category}</div>
                  <div className="image-description">{img.alt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="slider-controls">
          <button 
            className="control-btn"
            onClick={() => setIsHovered(!isHovered)}
          >
            {isHovered ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button 
            className="control-btn"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="modal-image"
            />
            <div className="modal-info">
              <div className="modal-category">{selectedImage.category}</div>
              <div className="modal-description">{selectedImage.alt}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Slider;