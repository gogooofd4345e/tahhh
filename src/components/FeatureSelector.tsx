import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { GameFeatures } from '@/hooks/useGameState'; // Import GameFeatures type

interface FeatureSelectorProps {
  features: GameFeatures; // Use the imported type, make it required
  toggleFeature: (feature: keyof GameFeatures) => void; // Expect toggleFeature prop
  onComplete?: () => void; // onComplete doesn't need features argument
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({
  features,
  toggleFeature,
  onComplete
}) => {
  
  useGSAP(() => {
    // Animate features appearance
    gsap.fromTo(
      '.feature-item',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: 'power2.out' 
      }
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

  // Use the passed toggleFeature function directly
  const handleToggle = (feature: keyof GameFeatures) => {
    toggleFeature(feature);
  };
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete(); // Call without arguments
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold gold-text mb-6 text-center">
        اختر ميزات اللعبة
      </h2>
      
      <div className="space-y-4 mb-8">
        {/* Time Bonus Feature */}
        <div className="feature-item glass-panel p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">نقاط الوقت الإضافية</h3>
            <p className="text-white/70 text-sm">
              احصل على نقاط إضافية عند الإجابة بسرعة
            </p>
          </div>
          <button 
            onClick={() => handleToggle('timeBonus')}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
              features.timeBonus ? 'bg-accent-500' : 'bg-white/20'
            }`}
          >
            <span 
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                features.timeBonus ? 'right-1 transform' : 'right-7'
              }`}
            ></span>
          </button>
        </div>
        
        {/* Power Ups Feature */}
        <div className="feature-item glass-panel p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">الجوكر والمساعدات</h3>
            <p className="text-white/70 text-sm">
              تفعيل مساعدات مثل الوقت الإضافي وتخطي السؤال
            </p>
          </div>
          <button 
            onClick={() => handleToggle('powerUps')}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
              features.powerUps ? 'bg-accent-500' : 'bg-white/20'
            }`}
          >
            <span 
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                features.powerUps ? 'right-1 transform' : 'right-7'
              }`}
            ></span>
          </button>
        </div>
        
        {/* Judge Functionality Feature */}
        <div className="feature-item glass-panel p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">وظيفة الحكم</h3>
            <p className="text-white/70 text-sm">
              تمكين الحكم من خصم النقاط عند سوء السلوك
            </p>
          </div>
          <button 
            onClick={() => handleToggle('judgeFunctionality')}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
              features.judgeFunctionality ? 'bg-accent-500' : 'bg-white/20'
            }`}
          >
            <span 
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                features.judgeFunctionality ? 'right-1 transform' : 'right-7'
              }`}
            ></span>
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={handleComplete}
          className="gold-button py-2 px-6 glow-effect"
        >
          بدء اللعبة
        </button>
      </div>
    </div>
  );
};

export default FeatureSelector;

