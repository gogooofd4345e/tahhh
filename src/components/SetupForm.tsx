import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface SetupFormProps {
  gameSetup: {
    team1Name: string;
    team2Name: string;
    judgeName: string;
  };
  setGameSetup: React.Dispatch<React.SetStateAction<{
    team1Name: string;
    team2Name: string;
    judgeName: string;
  }>>;
  onSubmit?: () => void;
  initialData?: any;
  onComplete?: (setupData: any) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({
  gameSetup,
  setGameSetup,
  onSubmit,
  initialData,
  onComplete
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameSetup(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!gameSetup.team1Name || !gameSetup.team2Name || !gameSetup.judgeName) {
      // Show error animation for empty fields
      gsap.to('.required-input:invalid', {
        keyframes: [
          { x: -5 },
          { x: 5 },
          { x: -5 },
          { x: 5 },
          { x: 0 }
        ],
        duration: 0.4,
        ease: 'power2.inOut',
      });
      return;
    }
    
    if (onSubmit) onSubmit();
    if (onComplete) onComplete(gameSetup);
  };
  
  useGSAP(() => {
    // Animate form appearance
    gsap.fromTo(
      '.setup-form',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    // Animate form items
    gsap.fromTo(
      '.form-item',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        delay: 0.3,
        ease: 'power2.out' 
      }
    );
    
    // Animate the submit button
    gsap.fromTo(
      '.submit-btn',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        delay: 0.6,
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

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="setup-form glass-panel p-6 shadow-lg">
        <h2 className="text-2xl font-bold gold-text mb-6 text-center">
          إعداد اللعبة
        </h2>
        
        <div className="space-y-4">
          <div className="form-item">
            <label className="block text-white mb-1 font-medium">
              اسم الفريق الأول
            </label>
            <input
              type="text"
              name="team1Name"
              value={gameSetup.team1Name}
              onChange={handleChange}
              className="glass-input w-full required-input"
              placeholder="أدخل اسم الفريق الأول"
              required
            />
          </div>
          
          <div className="form-item">
            <label className="block text-white mb-1 font-medium">
              اسم الفريق الثاني
            </label>
            <input
              type="text"
              name="team2Name"
              value={gameSetup.team2Name}
              onChange={handleChange}
              className="glass-input w-full required-input"
              placeholder="أدخل اسم الفريق الثاني"
              required
            />
          </div>
          
          <div className="form-item">
            <label className="block text-white mb-1 font-medium">
              اسم الحكم
            </label>
            <input
              type="text"
              name="judgeName"
              value={gameSetup.judgeName}
              onChange={handleChange}
              className="glass-input w-full required-input"
              placeholder="أدخل اسم الحكم"
              required
            />
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            type="submit"
            className="submit-btn gold-button w-full py-3 glow-effect"
          >
            بدء اللعبة
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupForm;
