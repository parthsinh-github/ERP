// src/components/Slider.jsx
import React, { useEffect } from 'react';

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
  { src: LocalImage, alt: "Audience at the conference hall" },
  { src: LocalImage1, alt: "Business people talking during coffee break" },
  { src: LocalImage2, alt: "Cake cutting ceremony at event" },
  { src: LocalImage3, alt: "Students sitting in classroom" },
  { src: LocalImage4, alt: "School corridor with students" },
  { src: LocalImage5, alt: "College event celebration" },
  { src: LocalImage6, alt: "Speaker at college seminar" },
  { src: LocalImage7, alt: "Students cheering at fest" },
  { src: LocalImage8, alt: "Students cheering at fest" },
];

const Slider = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-${images.length * 220}px); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.sliderContainer}>
      <div style={styles.slider}>
        {images.concat(images).map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            loading="lazy"
            width={200}
            height={300}
            style={styles.image}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  sliderContainer: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '130%',
    maxWidth: '1450px',
    margin: '0 auto',
    background: '#f8f8f8',
    padding: '20px 0',
  },
  slider: {
    display: 'flex',
    gap: '20px',
    animation: 'scroll 15s linear infinite',
  },
  image: {
    width: '200px',
    height: '300px',
    borderRadius: '10px',
    objectFit: 'cover',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
  },
};

export default Slider;
