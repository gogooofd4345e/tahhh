import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface NotFoundPageProps {}

const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  useGSAP(() => {
    // Animate the 404 text
    gsap.fromTo(
      '.not-found-title',
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }
    );
    
    // Animate the message
    gsap.fromTo(
      '.not-found-message',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, delay: 0.5, ease: 'power2.out' }
    );
    
    // Animate the button
    gsap.fromTo(
      '.not-found-btn',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.8, ease: 'power2.out' }
    );
    
    // Animate the glow effect
    gsap.to('.glow-effect', {
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.7)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient bg-gradient-to-br from-dark-200 to-dark-400">
      <div className="glass-panel p-8 shadow-lg text-center max-w-md">
        <h1 className="not-found-title text-6xl font-bold gold-text mb-6">404</h1>
        
        <p className="not-found-message text-white text-xl mb-8">
          الصفحة التي تبحث عنها غير موجودة
        </p>
        
        <a 
          href="/"
          className="not-found-btn gold-button py-3 px-8 inline-block glow-effect"
        >
          العودة للصفحة الرئيسية
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
