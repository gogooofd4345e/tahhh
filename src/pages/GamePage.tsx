import React, { useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Define a type for setTimeout/setInterval
type TimeoutId = ReturnType<typeof setTimeout>;

interface GamePageProps {
  gameSetup: {
    team1Name: string;
    team2Name: string;
    judgeName: string;
  };
  selectedCategories: string[];
  selectedFeatures: {
    timeBonus: boolean;
    powerUps: boolean;
    judgeFunctionality: boolean;
  };
  difficulty: string;
  questionCount: number;
  onReset: () => void;
}

const GamePage: React.FC<GamePageProps> = ({
  gameSetup,
  selectedCategories,
  selectedFeatures,
  difficulty,
  questionCount,
  onReset
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [teams, setTeams] = useState([
    {
      name: gameSetup.team1Name,
      score: 0,
      jokers: 2,
      streak: 0,
      bonusPoints: 0
    },
    {
      name: gameSetup.team2Name,
      score: 0,
      jokers: 2,
      streak: 0,
      bonusPoints: 0
    }
  ]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [gameView, setGameView] = useState<'teams' | 'question' | 'judge'>('teams');
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showPunishmentView, setShowPunishmentView] = useState(false);
  const [losingTeamIndex, setLosingTeamIndex] = useState<number | null>(null);
  const [transitionType, setTransitionType] = useState(0);
  
  // Generate questions when component mounts
  useEffect(() => {
    const generateQuestions = async () => {
      try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real implementation, this would call the questionService
        // For now, we'll use sample questions
        const sampleQuestions = Array(questionCount).fill(null).map((_, index) => ({
          question: `سؤال ${index + 1} في تصنيف ${selectedCategories[index % selectedCategories.length]}`,
          options: [
            `الخيار الأول للسؤال ${index + 1}`,
            `الخيار الثاني للسؤال ${index + 1}`,
            `الخيار الثالث للسؤال ${index + 1}`,
            `الخيار الرابع للسؤال ${index + 1}`
          ],
          correctAnswer: `الخيار ${(index % 4) + 1} للسؤال ${index + 1}`
        }));
        
        setQuestions(sampleQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating questions:', error);
        // Fallback to sample questions
        setQuestions([
          {
            question: 'ما هي عاصمة المملكة العربية السعودية؟',
            options: ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة'],
            correctAnswer: 'الرياض'
          },
          {
            question: 'ما هو أطول نهر في العالم؟',
            options: ['النيل', 'الأمازون', 'المسيسيبي', 'اليانغتسي'],
            correctAnswer: 'النيل'
          }
        ]);
        setIsLoading(false);
      }
    };
    
    generateQuestions();
  }, [selectedCategories, questionCount]);
  
  // Timer effect
  useEffect(() => {
    if (timerActive && timer > 0) {
      let interval: TimeoutId;
      
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    } else if (timer === 0 && timerActive) {
      handleTimeUp();
    }
  }, [timer, timerActive]);
  
  const handleTimeUp = () => {
    setTimerActive(false);
    setShowAnswer(true);
  };
  
  const startTimer = () => {
    setTimer(30);
    setTimerActive(true);
  };
  
  const stopTimer = () => {
    setTimerActive(false);
  };
  
  const calculateTimeBonus = () => {
    if (!selectedFeatures.timeBonus) return 0;
    return Math.floor(timer / 5);
  };
  
  const changeTransitionType = () => {
    setTransitionType(prev => (prev + 1) % 3);
  };
  
  const handleOptionSelect = (optionIndex: number) => {
    if (showAnswer || selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    stopTimer();
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.options[optionIndex] === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      // Update team score
      setTeams(prevTeams => {
        const newTeams = [...prevTeams];
        const timeBonus = calculateTimeBonus();
        
        // Update streak
        newTeams[currentTeam].streak += 1;
        
        // Add points
        newTeams[currentTeam].score += 1;
        
        // Add time bonus if feature is enabled
        if (selectedFeatures.timeBonus) {
          newTeams[currentTeam].bonusPoints += timeBonus;
          newTeams[currentTeam].score += timeBonus;
        }
        
        return newTeams;
      });
    } else {
      // Reset streak
      setTeams(prevTeams => {
        const newTeams = [...prevTeams];
        newTeams[currentTeam].streak = 0;
        return newTeams;
      });
    }
    
    setShowAnswer(true);
  };
  
  const handleJudgeDecision = (isCorrect: boolean) => {
    if (isCorrect) {
      // Update team score
      setTeams(prevTeams => {
        const newTeams = [...prevTeams];
        
        // Add points
        newTeams[currentTeam].score += 1;
        
        return newTeams;
      });
    }
    
    nextQuestion();
  };
  
  const handleJudgeDeductPoints = (points: number, teamIndex?: number) => {
    const targetTeam = teamIndex !== undefined ? teamIndex : currentTeam;
    
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      newTeams[targetTeam].score = Math.max(0, newTeams[targetTeam].score - points);
      return newTeams;
    });
  };
  
  const nextQuestion = () => {
    setShowAnswer(false);
    setSelectedOption(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setCurrentTeam(prevTeam => (prevTeam + 1) % 2);
      setGameView('teams');
    } else {
      // Game over
      endGame();
    }
  };
  
  const useJoker = () => {
    if (teams[currentTeam].jokers <= 0) return;
    
    // Reduce joker count
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      newTeams[currentTeam].jokers -= 1;
      return newTeams;
    });
    
    // Add time if time bonus feature is enabled
    if (selectedFeatures.timeBonus) {
      setTimer((prev) => prev + 30);
    }
  };
  
  const endGame = () => {
    setGameOver(true);
    
    // Determine losing team
    if (teams[0].score > teams[1].score) {
      setLosingTeamIndex(1);
    } else if (teams[1].score > teams[0].score) {
      setLosingTeamIndex(0);
    } else {
      // It's a tie, no losing team
      setLosingTeamIndex(null);
    }
  };
  
  const showPunishment = () => {
    setShowPunishmentView(true);
  };
  
  const resetGame = () => {
    onReset();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient bg-gradient-to-br from-dark-200 to-dark-400">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">جاري تحميل الأسئلة...</h2>
          <p className="text-white/70">يرجى الانتظار قليلاً</p>
        </div>
      </div>
    );
  }
  
  if (gameOver) {
    if (showPunishmentView && losingTeamIndex !== null) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient bg-gradient-to-br from-dark-200 to-dark-400">
          {/* PunishmentView component would be rendered here */}
          <div className="text-center">
            <h2 className="text-3xl font-bold gold-text mb-6">عقاب الفريق الخاسر</h2>
            <p className="text-white mb-4">
              فريق {teams[losingTeamIndex].name} خسر المباراة وعليه تنفيذ العقاب!
            </p>
            <button 
              onClick={resetGame}
              className="gold-button py-3 px-6 glow-effect"
            >
              لعبة جديدة
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient bg-gradient-to-br from-dark-200 to-dark-400">
        {/* ResultsView component would be rendered here */}
        <div className="text-center">
          <h2 className="text-3xl font-bold gold-text mb-6">نتائج المباراة</h2>
          <div className="glass-panel p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              {teams.map((team, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
                  <div className="text-3xl font-bold gold-text">{team.score}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 space-x-reverse">
            {losingTeamIndex !== null && (
              <button 
                onClick={showPunishment}
                className="glass-button py-3 px-6 bg-gradient-to-r from-red-600/30 to-red-400/30"
              >
                عرض العقاب
              </button>
            )}
            
            <button 
              onClick={resetGame}
              className="gold-button py-3 px-6 glow-effect"
            >
              لعبة جديدة
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient bg-gradient-to-br from-dark-200 to-dark-400">
      {gameView === 'teams' && (
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gold-text mb-2">
              تحدي المعرفة
            </h2>
            <p className="text-white/70">
              سؤال {currentQuestionIndex + 1} من {questions.length}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {teams.map((team, index) => (
              <div 
                key={index} 
                className={`glass-panel p-6 relative ${
                  currentTeam === index ? 'border-accent-400/30' : 'border-white/10'
                }`}
              >
                {currentTeam === index && (
                  <div className="absolute -top-3 -right-3 bg-accent-500 text-dark-400 rounded-full px-3 py-1 text-sm font-bold">
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
                  
                  {selectedFeatures.timeBonus && (
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
                startTimer();
              }}
              className="gold-button py-3 px-8"
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
      )}
      
      {gameView === 'question' && (
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white">
              <div className="text-sm opacity-70">الفريق الحالي</div>
              <div className="text-xl font-bold">{teams[currentTeam].name}</div>
            </div>
            
            <div className="relative">
              <svg className="w-20 h-20" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255, 215, 0, 0.8)"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - timer / 30)}
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="55"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {timer}
                </text>
              </svg>
            </div>
            
            <div className="text-white text-right">
              <div className="text-sm opacity-70">السؤال</div>
              <div className="text-xl font-bold">{currentQuestionIndex + 1}/{questions.length}</div>
            </div>
          </div>
          
          <div className="glass-panel p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              {questions[currentQuestionIndex].question}
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showAnswer || selectedOption !== null}
                  className={`p-4 rounded-xl transition-all duration-300 text-right ${
                    showAnswer
                      ? option === questions[currentQuestionIndex].correctAnswer
                        ? 'bg-gradient-to-r from-green-600 to-green-400 text-dark-400 font-bold'
                        : selectedOption === index
                        ? 'bg-gradient-to-r from-red-600 to-red-400 text-dark-400 font-bold'
                        : 'glass-button text-white'
                      : selectedOption === index
                      ? 'bg-gradient-to-r from-accent-600 to-accent-400 text-dark-400 font-bold'
                      : 'glass-button text-white hover:bg-white/10'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            {selectedFeatures.powerUps && (
              <button 
                onClick={useJoker}
                disabled={teams[currentTeam].jokers <= 0 || showAnswer}
                className={`glass-button py-2 px-4 ${
                  teams[currentTeam].jokers <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                استخدام جوكر ({teams[currentTeam].jokers})
              </button>
            )}
            
            {showAnswer && (
              <button 
                onClick={nextQuestion}
                className="gold-button py-2 px-6"
              >
                {currentQuestionIndex < questions.length - 1 ? 'السؤال التالي' : 'إنهاء اللعبة'}
              </button>
            )}
            
            {selectedFeatures.judgeFunctionality && (
              <button 
                onClick={() => {
                  changeTransitionType();
                  setGameView('judge');
                  stopTimer();
                }}
                className="glass-button py-2 px-4 bg-gradient-to-r from-red-600/30 to-red-400/30"
              >
                الحكم
              </button>
            )}
          </div>
        </div>
      )}
      
      {gameView === 'judge' && (
        <div className="w-full max-w-md mx-auto">
          <div className="glass-panel p-6 shadow-lg">
            <h2 className="text-2xl font-bold gold-text mb-6 text-center">
              خصم النقاط
            </h2>
            
            <div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-white mb-1 font-medium">
                    اختر الفريق
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {teams.map((team, index) => (
                      <button
                        key={index}
                        onClick={() => {}}
                        className="p-3 rounded-xl transition-all duration-300 text-center glass-button text-white"
                      >
                        {team.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-1 font-medium">
                    عدد النقاط للخصم: 1
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value="1"
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/70 mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-1 font-medium">
                    سبب الخصم
                  </label>
                  <textarea
                    className="glass-input w-full h-24 resize-none"
                    placeholder="أدخل سبب خصم النقاط..."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => {
                    changeTransitionType();
                    setGameView('question');
                  }}
                  className="glass-button py-2 px-6"
                >
                  إلغاء
                </button>
                
                <button 
                  onClick={() => {
                    handleJudgeDeductPoints(1, 0);
                    changeTransitionType();
                    setGameView('question');
                  }}
                  className="gold-button py-2 px-6 bg-gradient-to-r from-red-600 to-red-400"
                >
                  خصم النقاط
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
