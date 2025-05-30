import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SetupForm from '../components/SetupForm';
import CategorySelector from '../components/CategorySelector';
import FeatureSelector from '../components/FeatureSelector';
import { GameFeatures } from '@/hooks/useGameState'; // Import GameFeatures type

interface HomePageProps {
  onGameSetup?: (config: any) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGameSetup }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [gameSetup, setGameSetup] = useState({
    team1Name: '',
    team2Name: '',
    judgeName: '',
    questionCount: 10,
    difficulty: 'متوسط', // Assuming difficulty is handled differently now
    timePerQuestion: 30
  });
  
  const [categories] = useState([
    'معلومات عامة',
    'تاريخ',
    'جغرافيا',
    'علوم',
    'رياضة',
    'فن وثقافة',
    'تكنولوجيا',
    'دين',
    'أدب',
    'ترفيه'
  ]);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Initialize features state with all properties from GameFeatures
  const [features, setFeatures] = useState<GameFeatures>({
    streakBonus: true, // Added missing property
    timeBonus: true,
    confettiEffects: false, // Added missing property
    judgeFunctionality: true,
    powerUps: true
  });

  // Implement toggleFeature function for HomePage context
  const toggleFeature = (feature: keyof GameFeatures) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };
  
  useGSAP(() => {
    // GSAP animations...
    gsap.fromTo(
      '.title',
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.subtitle',
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.content-panel',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.7, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.bg-element',
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 0.2, 
        scale: 1, 
        duration: 2, 
        stagger: 0.2,
        ease: 'power3.out' 
      }
    );
    gsap.to('.glow-effect', {
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.7)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);
  
  const handleSetupComplete = (setupData: any) => {
    setGameSetup(setupData);
    setStep(2);
  };
  
  const handleCategoriesComplete = (categories: string[]) => {
    setSelectedCategories(categories);
    setStep(3);
  };
  
  // onComplete for FeatureSelector doesn't pass features anymore
  const handleFeaturesComplete = () => { 
    // Prepare final game configuration using the state
    const gameConfig = {
      gameSetup,
      selectedCategories,
      selectedFeatures: features, // Use the state variable
      difficulty: gameSetup.difficulty, // Assuming difficulty is still part of setup
      questionCount: gameSetup.questionCount
    };
    
    if (onGameSetup) {
      onGameSetup(gameConfig);
    }
    
    // Navigate to game page (or pass config)
    // For standalone HomePage, maybe navigate with state
    navigate('/game', { state: gameConfig }); 
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-element absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-accent-500/10 blur-xl"></div>
        <div className="bg-element absolute top-[40%] right-[10%] w-40 h-40 rounded-full bg-accent-300/10 blur-xl"></div>
        <div className="bg-element absolute bottom-[15%] left-[15%] w-36 h-36 rounded-full bg-accent-400/10 blur-xl"></div>
      </div>
      
      <div className="text-center mb-8 z-10">
        <h1 className="title text-4xl md:text-5xl font-bold gold-text mb-2">
          تحدي المعرفة
        </h1>
        <p className="subtitle text-white/70 text-lg">
          اختبر معلوماتك وتحدى أصدقاءك في مسابقة ثقافية ممتعة
        </p>
      </div>
      
      <div className="content-panel glass-panel p-6 md:p-8 w-full max-w-2xl z-10">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold gold-text mb-6 text-center">
              إعداد اللعبة
            </h2>
            <SetupForm 
              gameSetup={gameSetup} 
              setGameSetup={setGameSetup} 
              onSubmit={() => {}} 
              onComplete={handleSetupComplete} 
            />
          </div>
        )}
        
        {step === 2 && (
          <div>
            <CategorySelector 
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              maxCategories={3} // Example max categories
              onComplete={handleCategoriesComplete}
            />
          </div>
        )}
        
        {step === 3 && (
          <div>
            {/* Pass the complete features object and the toggle function */}
            <FeatureSelector 
              features={features}
              toggleFeature={toggleFeature} 
              onComplete={handleFeaturesComplete} // Corrected onComplete signature
            />
          </div>
        )}
      </div>
      
      <div className="mt-8 text-white/50 text-sm z-10">
        تم التطوير بواسطة فريق تحدي المعرفة &copy; 2025
      </div>
    </div>
  );
};

export default HomePage;

