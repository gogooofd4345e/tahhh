import React, { useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface LoadingScreenProps {
  gameSetup: {
    team1Name: string;
    team2Name: string;
    questionCount: number;
  };
  selectedCategories: string[];
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ gameSetup, selectedCategories }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('جاري تجهيز الأسئلة...');
  const [loadingMessages, setLoadingMessages] = useState<string[]>([]);

  useGSAP(() => {
    // Create loading animation
    const tl = gsap.timeline();
    
    // Animate the loading circle
    tl.to('.loading-circle', {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: 'none',
    });
    
    // Animate the glow effect
    tl.to('.loading-glow', {
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    }, 0);
    
    // Animate the progress bar
    gsap.to('.progress-bar-fill', {
      width: '100%',
      duration: 5,
      ease: 'power1.inOut',
    });
    
    // Animate the loading messages
    gsap.fromTo(
      '.loading-message',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5,
        stagger: 0.8,
        ease: 'power2.out' 
      }
    );
  }, []);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 500);
    
    // Generate loading messages
    const messages = [
      'جاري تجهيز الأسئلة...',
      `تحضير ${gameSetup.questionCount} سؤال من ${selectedCategories.join('، ')}`,
      `إعداد فريق ${gameSetup.team1Name} وفريق ${gameSetup.team2Name}`,
      'تجهيز القوى الخاصة والمكافآت...',
      'جاري تحميل واجهة اللعبة...',
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < messages.length) {
        setLoadingText(messages[messageIndex]);
        setLoadingMessages(prev => [...prev, messages[messageIndex]]);
        messageIndex++;
      } else {
        clearInterval(messageInterval);
      }
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [gameSetup, selectedCategories]);

  return (
    <div className="glass-panel p-6 shadow-lg text-center">
      <h2 className="text-2xl font-bold gold-text mb-6">
        جاري تحميل اللعبة
      </h2>
      
      <div className="flex justify-center mb-8">
        <div className="loading-circle loading-glow w-24 h-24 border-4 border-accent-400 border-t-transparent rounded-full"></div>
      </div>
      
      <div className="mb-6">
        <div className="text-white mb-2">{loadingText}</div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="progress-bar-fill h-full bg-gradient-to-r from-accent-600 to-accent-400"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <div className="text-white/70 text-sm mt-2">
          {Math.round(loadingProgress)}%
        </div>
      </div>
      
      <div className="text-right space-y-2 max-h-40 overflow-y-auto pr-2">
        {loadingMessages.map((message, index) => (
          <div key={index} className="loading-message text-white/60 text-sm">
            <span className="text-accent-400 ml-2">✓</span>
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
