import React, { useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface ResultsViewProps {
  teams: {
    name: string;
    score: number;
    jokers: number;
    streak: number;
    bonusPoints: number;
  }[];
  losingTeamIndex: number | null;
  showPunishment: () => void;
  resetGame: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  teams,
  losingTeamIndex,
  showPunishment,
  resetGame
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  
  useEffect(() => {
    // Determine winner
    if (teams[0].score > teams[1].score) {
      setWinnerIndex(0);
    } else if (teams[1].score > teams[0].score) {
      setWinnerIndex(1);
    } else {
      setWinnerIndex(null); // Tie
    }
    
    // Show confetti after a delay
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [teams]);
  
  useGSAP(() => {
    // Animate title
    gsap.fromTo(
      '.results-title',
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );
    
    // Animate trophy
    gsap.fromTo(
      '.trophy',
      { opacity: 0, scale: 0.5, rotation: -10 },
      { 
        opacity: 1, 
        scale: 1, 
        rotation: 0,
        duration: 1.2, 
        delay: 0.5,
        ease: 'elastic.out(1, 0.5)' 
      }
    );
    
    // Animate team scores
    gsap.fromTo(
      '.team-result',
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.2,
        delay: 1,
        ease: 'power2.out' 
      }
    );
    
    // Animate buttons
    gsap.fromTo(
      '.result-btn',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        delay: 1.5,
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
    
    // Animate the winner
    if (winnerIndex !== null) {
      gsap.to(`.team-result-${winnerIndex}`, {
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
    
    // Animate confetti
    if (showConfetti && winnerIndex !== null) {
      const confettiElements = document.querySelectorAll('.confetti');
      confettiElements.forEach((element, index) => {
        const delay = index * 0.1;
        const duration = 0.5 + Math.random() * 1;
        const x = (Math.random() - 0.5) * window.innerWidth * 0.8;
        const y = -window.innerHeight * 0.7 - Math.random() * 100;
        const rotation = Math.random() * 360;
        
        gsap.fromTo(
          element,
          { 
            opacity: 0,
            x: 0,
            y: 0,
            rotation: 0
          },
          { 
            opacity: 1,
            x: x,
            y: y,
            rotation: rotation,
            duration: duration,
            delay: delay,
            ease: 'power1.out'
          }
        );
      });
    }
  }, [winnerIndex, showConfetti]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-panel p-8 shadow-lg text-center relative overflow-hidden">
        {showConfetti && winnerIndex !== null && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, index) => (
              <div
                key={index}
                className="confetti absolute top-0 left-1/2 w-3 h-3 rounded-full"
                style={{
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
                  transformOrigin: 'center',
                }}
              ></div>
            ))}
          </div>
        )}
        
        <h2 className="results-title text-3xl font-bold gold-text mb-8">
          نتائج الاختبار
        </h2>
        
        {winnerIndex !== null ? (
          <div className="trophy mb-8 flex justify-center">
            <div className="w-24 h-24 relative">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M12 17C15.866 17 19 13.866 19 10V5H5V10C5 13.866 8.13401 17 12 17Z" fill="url(#paint0_linear)" />
                <path d="M12 17V21M8 21H16" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19 5H20C20.5523 5 21 5.44772 21 6V7C21 8.65685 19.6569 10 18 10" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 5H4C3.44772 5 3 5.44772 3 6V7C3 8.65685 4.34315 10 6 10" stroke="url(#paint3_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="paint0_linear" x1="5" y1="5" x2="19" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFD700" />
                    <stop offset="1" stopColor="#FFA500" />
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="8" y1="17" x2="16" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFD700" />
                    <stop offset="1" stopColor="#FFA500" />
                  </linearGradient>
                  <linearGradient id="paint2_linear" x1="18" y1="5" x2="21" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFD700" />
                    <stop offset="1" stopColor="#FFA500" />
                  </linearGradient>
                  <linearGradient id="paint3_linear" x1="3" y1="5" x2="6" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFD700" />
                    <stop offset="1" stopColor="#FFA500" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        ) : (
          <div className="mb-8 text-white text-xl">
            تعادل!
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {teams.map((team, index) => (
            <div 
              key={index} 
              className={`team-result team-result-${index} glass-panel p-6 relative ${
                winnerIndex === index ? 'border-accent-400/30' : 'border-white/10'
              }`}
            >
              {winnerIndex === index && (
                <div className="absolute -top-3 -right-3 bg-accent-500 text-dark-400 rounded-full px-3 py-1 text-sm font-bold">
                  الفائز
                </div>
              )}
              
              <h3 className="text-xl font-bold text-white mb-4">
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
            </div>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 md:space-x-reverse">
          {losingTeamIndex !== null && (
            <button 
              onClick={showPunishment}
              className="result-btn glass-button py-3 px-6 bg-gradient-to-r from-red-600/30 to-red-400/30 hover:from-red-600/40 hover:to-red-400/40"
            >
              عرض العقاب
            </button>
          )}
          
          <button 
            onClick={resetGame}
            className="result-btn gold-button py-3 px-6 glow-effect"
          >
            لعبة جديدة
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
