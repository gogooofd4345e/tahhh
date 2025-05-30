import React, { useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface QuestionViewProps {
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
  currentQuestionIndex: number;
  teams: {
    name: string;
    score: number;
    jokers: number;
    streak: number;
    bonusPoints: number;
  }[];
  currentTeam: number;
  timer: number;
  timerActive: boolean;
  showAnswer: boolean;
  excludedOptions: number[];
  gameSetup: {
    timePerQuestion: number;
  };
  gameFeatures: {
    timeBonus: boolean;
    powerUps: boolean;
    judgeFunctionality: boolean;
  };
  powerUpsAvailable: {
    extraTime: [number, number];
    doublePoints: [number, number];
    skipQuestion: [number, number];
  };
  handleAnswerSelect: (option: string) => void;
  handleStartTimer: () => void;
  nextQuestion: () => void;
  usePowerUp: (powerUp: 'extraTime' | 'doublePoints' | 'skipQuestion') => void;
  useJoker: () => void;
  calculateTimeBonus: () => number;
  changeTransitionType: () => void;
  setGameView: (view: 'teams' | 'question' | 'judge') => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  questions,
  currentQuestionIndex,
  teams,
  currentTeam,
  timer,
  timerActive,
  showAnswer,
  excludedOptions,
  gameSetup,
  gameFeatures,
  powerUpsAvailable,
  handleAnswerSelect,
  handleStartTimer,
  nextQuestion,
  usePowerUp,
  useJoker,
  calculateTimeBonus,
  changeTransitionType,
  setGameView
}) => {
  const [timerRadius, setTimerRadius] = useState(40);
  const [timerCircumference, setTimerCircumference] = useState(0);
  const [timerOffset, setTimerOffset] = useState(0);
  
  useEffect(() => {
    setTimerCircumference(2 * Math.PI * timerRadius);
    setTimerOffset(timerCircumference);
  }, [timerRadius, timerCircumference]);
  
  useEffect(() => {
    if (timerActive) {
      const maxTime = gameSetup.timePerQuestion;
      const percentage = timer / maxTime;
      const offset = timerCircumference - (percentage * timerCircumference);
      setTimerOffset(offset);
    }
  }, [timer, timerActive, timerCircumference, gameSetup.timePerQuestion]);
  
  useGSAP(() => {
    // Animate question appearance
    gsap.fromTo(
      '.question-text',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
    
    // Animate options
    gsap.fromTo(
      '.option-btn',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: 'power2.out' 
      }
    );
    
    // Animate timer
    gsap.fromTo(
      '.timer-container',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
    );
    
    // Animate power-ups
    gsap.fromTo(
      '.power-up-btn',
      { opacity: 0, scale: 0.9 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.5, 
        stagger: 0.1,
        ease: 'back.out(1.7)' 
      }
    );
    
    // Animate the glow effect on buttons
    gsap.to('.glow-effect', {
      boxShadow: '0 0 15px rgba(255, 215, 0, 0.7)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    
    // If showing answer, animate the correct answer
    if (showAnswer) {
      gsap.to('.correct-answer', {
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.7)',
        scale: 1.03,
        duration: 0.5,
        repeat: 3,
        yoyo: true,
        ease: 'power2.inOut',
      });
      
      gsap.to('.wrong-answer', {
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.7)',
        duration: 0.5,
        repeat: 1,
        yoyo: true,
        ease: 'power2.inOut',
      });
      
      gsap.fromTo(
        '.next-btn',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
      );
    }
  }, [showAnswer, currentQuestionIndex]);
  
  if (!questions || questions.length === 0 || currentQuestionIndex >= questions.length) {
    return (
      <div className="glass-panel p-6 shadow-lg text-center">
        <div className="text-xl text-red-400 font-bold">
          لم يتم العثور على أسئلة
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => {
            changeTransitionType();
            setGameView('teams');
          }} 
          className="glass-button px-3 py-1.5 text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          العودة
        </button>
        
        <div className="glass-panel px-4 py-1.5 rounded-full">
          <span className="text-xs text-accent-300 ml-1">دور</span>
          <span className="text-sm font-medium text-white">{teams[currentTeam].name}</span>
        </div>
        
        <div className="glass-panel px-3 py-1.5 rounded-full">
          <span className="text-xs text-accent-300 ml-1">سؤال</span>
          <span className="text-sm font-medium text-white">{currentQuestionIndex + 1}/{questions.length}</span>
        </div>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="timer-container relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${timerRadius * 2 + 10} ${timerRadius * 2 + 10}`}>
            <circle
              className="text-white/10"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r={timerRadius}
              cx={timerRadius + 5}
              cy={timerRadius + 5}
            />
            <circle
              className="text-accent-400 transition-all duration-1000 ease-linear"
              strokeWidth="4"
              strokeDasharray={timerCircumference}
              strokeDashoffset={timerOffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={timerRadius}
              cx={timerRadius + 5}
              cy={timerRadius + 5}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{timer}</div>
              <div className="text-xs text-white/70">ثانية</div>
            </div>
          </div>
        </div>
      </div>
      
      {!timerActive && !showAnswer && (
        <div className="flex justify-center mb-6">
          <button 
            onClick={handleStartTimer}
            className="gold-button py-2 px-6 glow-effect"
          >
            ابدأ الآن
          </button>
        </div>
      )}
      
      {gameFeatures.powerUps && (
        <div className="flex justify-center space-x-4 space-x-reverse mb-6">
          <button 
            onClick={() => usePowerUp('extraTime')}
            disabled={powerUpsAvailable.extraTime[currentTeam] <= 0 || showAnswer}
            className={`power-up-btn glass-button p-2 rounded-full ${
              powerUpsAvailable.extraTime[currentTeam] <= 0 || showAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'
            }`}
            title="وقت إضافي"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-accent-500 text-dark-400 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
              {powerUpsAvailable.extraTime[currentTeam]}
            </span>
          </button>
          
          <button 
            onClick={() => usePowerUp('doublePoints')}
            disabled={powerUpsAvailable.doublePoints[currentTeam] <= 0 || showAnswer}
            className={`power-up-btn glass-button p-2 rounded-full ${
              powerUpsAvailable.doublePoints[currentTeam] <= 0 || showAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'
            }`}
            title="نقاط مضاعفة"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-accent-500 text-dark-400 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
              {powerUpsAvailable.doublePoints[currentTeam]}
            </span>
          </button>
          
          <button 
            onClick={() => usePowerUp('skipQuestion')}
            disabled={powerUpsAvailable.skipQuestion[currentTeam] <= 0 || showAnswer}
            className={`power-up-btn glass-button p-2 rounded-full ${
              powerUpsAvailable.skipQuestion[currentTeam] <= 0 || showAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'
            }`}
            title="تخطي السؤال"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-accent-500 text-dark-400 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
              {powerUpsAvailable.skipQuestion[currentTeam]}
            </span>
          </button>
          
          <button 
            onClick={useJoker}
            disabled={teams[currentTeam].jokers <= 0 || showAnswer || excludedOptions.length > 0}
            className={`power-up-btn glass-button p-2 rounded-full ${
              teams[currentTeam].jokers <= 0 || showAnswer || excludedOptions.length > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'
            }`}
            title="استخدام الجوكر"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-accent-500 text-dark-400 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
              {teams[currentTeam].jokers}
            </span>
          </button>
        </div>
      )}
      
      {gameFeatures.judgeFunctionality && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => {
              changeTransitionType();
              setGameView('judge');
            }}
            className="glass-button px-3 py-1.5 text-sm flex items-center bg-gradient-to-r from-red-600/30 to-red-400/30 hover:from-red-600/40 hover:to-red-400/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            خصم نقاط
          </button>
        </div>
      )}
      
      <div className="glass-panel p-6 shadow-lg mb-6">
        <h3 className="question-text text-xl font-bold text-white text-center mb-8 font-cairo">
          {currentQuestion.question}
        </h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={showAnswer || excludedOptions.includes(index) || !timerActive}
              className={`option-btn w-full text-right py-3 px-4 rounded-xl transition-all duration-300 ${
                excludedOptions.includes(index) 
                  ? 'opacity-40 glass-button cursor-not-allowed' 
                : showAnswer && option === currentQuestion.correctAnswer
                  ? 'bg-gradient-to-r from-green-600 to-green-400 text-dark-400 font-bold correct-answer'
                : showAnswer
                  ? 'bg-gradient-to-r from-red-600 to-red-400 text-dark-400 font-bold wrong-answer'
                : 'glass-button hover:bg-white/30'
              }`}
            >
              <span className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center ml-3 text-sm">
                  {['أ', 'ب', 'ج', 'د'][index]}
                </span>
                <span className="flex-1 text-lg">{option}</span>
                {showAnswer && option === currentQuestion.correctAnswer && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {showAnswer && (
        <div className="flex justify-center">
          <button 
            onClick={nextQuestion}
            className="gold-button py-3 px-8 next-btn glow-effect"
          >
            {currentQuestionIndex >= questions.length - 1 ? (
              'عرض النتائج'
            ) : (
              <span className="flex items-center">
                السؤال التالي
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionView;
