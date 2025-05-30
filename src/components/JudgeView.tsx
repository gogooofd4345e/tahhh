import React, { useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface JudgeViewProps {
  gameSetup: {
    judgeName: string;
  };
  handleJudgeDecision: (isCorrect: boolean) => void;
  handleJudgeDeductPoints: (points: number, teamIndex?: number) => void;
  nextQuestion: () => void;
  currentQuestionIndex: number;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
  changeTransitionType: () => void;
  setGameView: (view: 'teams' | 'question' | 'judge') => void;
  teams: {
    name: string;
    score: number;
  }[];
}

const JudgeView: React.FC<JudgeViewProps> = ({
  gameSetup,
  handleJudgeDecision,
  handleJudgeDeductPoints,
  nextQuestion,
  currentQuestionIndex,
  questions,
  changeTransitionType,
  setGameView,
  teams
}) => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [deductPoints, setDeductPoints] = useState(1);
  const [reason, setReason] = useState('');
  const [view, setView] = useState<'decision' | 'deduct'>('deduct');

  useGSAP(() => {
    // Animate panel appearance
    gsap.fromTo(
      '.judge-panel',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    // Animate title
    gsap.fromTo(
      '.judge-title',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    // Animate form elements
    gsap.fromTo(
      '.form-item',
      { opacity: 0, x: -20 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: 'power2.out' 
      }
    );
    
    // Animate buttons
    gsap.fromTo(
      '.judge-btn',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        delay: 0.5,
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
  }, [view]);

  const handleDeduct = () => {
    if (selectedTeam !== null && deductPoints > 0) {
      handleJudgeDeductPoints(deductPoints, selectedTeam);
      changeTransitionType();
      setGameView('question');
    } else {
      // Show error animation
      gsap.to('.required-field', {
        x: 0,
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
    }
  };

  const handleCancel = () => {
    changeTransitionType();
    setGameView('question');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="judge-panel glass-panel p-6 shadow-lg">
        <h2 className="judge-title text-2xl font-bold gold-text mb-6 text-center">
          {view === 'decision' ? 'قرار الحكم' : 'خصم النقاط'}
        </h2>
        
        {view === 'decision' ? (
          <div>
            <div className="mb-6">
              <p className="text-white text-center mb-4">
                هل إجابة الفريق صحيحة؟
              </p>
              
              <div className="flex justify-center space-x-4 space-x-reverse">
                <button 
                  onClick={() => handleJudgeDecision(true)}
                  className="judge-btn glass-button py-2 px-6 bg-gradient-to-r from-green-600/30 to-green-400/30 hover:from-green-600/40 hover:to-green-400/40"
                >
                  نعم
                </button>
                
                <button 
                  onClick={() => handleJudgeDecision(false)}
                  className="judge-btn glass-button py-2 px-6 bg-gradient-to-r from-red-600/30 to-red-400/30 hover:from-red-600/40 hover:to-red-400/40"
                >
                  لا
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={nextQuestion}
                className="judge-btn gold-button py-2 px-6 glow-effect"
              >
                السؤال التالي
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-4 mb-6">
              <div className="form-item">
                <label className="block text-white mb-1 font-medium">
                  اختر الفريق
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {teams.map((team, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTeam(index)}
                      className={`p-3 rounded-xl transition-all duration-300 text-center required-field ${
                        selectedTeam === index
                          ? 'bg-gradient-to-r from-red-600 to-red-400 text-dark-400 font-bold'
                          : 'glass-button text-white'
                      }`}
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-item">
                <label className="block text-white mb-1 font-medium">
                  عدد النقاط للخصم: {deductPoints}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={deductPoints}
                  onChange={(e) => setDeductPoints(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer required-field"
                />
                <div className="flex justify-between text-xs text-white/70 mt-1">
                  <span>1</span>
                  <span>5</span>
                </div>
              </div>
              
              <div className="form-item">
                <label className="block text-white mb-1 font-medium">
                  سبب الخصم
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="glass-input w-full h-24 resize-none"
                  placeholder="أدخل سبب خصم النقاط..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={handleCancel}
                className="judge-btn glass-button py-2 px-6"
              >
                إلغاء
              </button>
              
              <button 
                onClick={handleDeduct}
                className="judge-btn gold-button py-2 px-6 glow-effect bg-gradient-to-r from-red-600 to-red-400"
              >
                خصم النقاط
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgeView;
