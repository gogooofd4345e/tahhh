import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface TeamsViewProps {
  teams: {
    name: string;
    score: number;
    jokers: number;
    streak: number;
    bonusPoints: number;
  }[];
  currentTeam: number;
  gameFeatures: {
    timeBonus: boolean;
    powerUps: boolean;
    judgeFunctionality: boolean;
  };
  showAnswer: boolean;
  changeTransitionType: () => void;
  setGameView: (view: 'teams' | 'question' | 'judge') => void;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  currentTeam,
  gameFeatures,
  showAnswer,
  changeTransitionType,
  setGameView,
  currentQuestionIndex,
  totalQuestions
}) => {
  useGSAP(() => {
    // Animate team cards
    gsap.fromTo(
      '.team-card',
      { opacity: 0, y: 30, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.8, 
        stagger: 0.2,
        ease: 'power2.out' 
      }
    );
    
    // Animate the current team indicator
    gsap.fromTo(
      '.current-team-indicator',
      { opacity: 0, scale: 0 },
      { 
        opacity: 1, 
        scale: 1,
        duration: 0.6, 
        delay: 0.8,
        ease: 'back.out(1.7)' 
      }
    );
    
    // Animate the continue button
    gsap.fromTo(
      '.continue-btn',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0,
        duration: 0.6, 
        delay: 1,
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
    
    // Animate the active team card
    gsap.to(`.team-card-${currentTeam}`, {
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, [currentTeam]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gold-text mb-2">
          تحدي المعرفة
        </h2>
        <p className="text-white/70">
          سؤال {currentQuestionIndex + 1} من {totalQuestions}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {teams.map((team, index) => (
          <div 
            key={index} 
            className={`team-card team-card-${index} glass-panel p-6 relative ${
              currentTeam === index ? 'border-accent-400/30' : 'border-white/10'
            }`}
          >
            {currentTeam === index && (
              <div className="current-team-indicator absolute -top-3 -right-3 bg-accent-500 text-dark-400 rounded-full px-3 py-1 text-sm font-bold">
                الدور الحالي
              </div>
            )}
            
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              {team.name}
            </h3>
            
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 rounded-full px-6 py-2 text-center">
                <div className="text-3xl font-bold gold-text">
                  {team.score}
                </div>
                <div className="text-xs text-white/70">
                  النقاط
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-lg font-medium text-white">
                  {team.jokers}
                </div>
                <div className="text-xs text-white/70">
                  جوكر
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <div className="text-lg font-medium text-white">
                  {team.streak}
                </div>
                <div className="text-xs text-white/70">
                  سلسلة
                </div>
              </div>
              
              {gameFeatures.timeBonus && (
                <div className="bg-white/10 rounded-lg p-2 text-center col-span-2">
                  <div className="text-lg font-medium text-accent-300">
                    +{team.bonusPoints}
                  </div>
                  <div className="text-xs text-white/70">
                    نقاط إضافية
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={() => {
            changeTransitionType();
            setGameView('question');
          }}
          className="gold-button py-3 px-8 continue-btn glow-effect"
          disabled={showAnswer}
        >
          <span className="flex items-center">
            بدء السؤال
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default TeamsView;
