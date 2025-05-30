import React, { useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface PunishmentViewProps {
  teamName: string;
  resetGame: () => void;
}

const PunishmentView: React.FC<PunishmentViewProps> = ({ teamName, resetGame }) => {
  const [punishment, setPunishment] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState(-1);
  
  const punishmentCategories = [
    'تحدي',
    'غناء',
    'رقص',
    'تقليد',
    'سؤال',
    'اعتراف',
    'تمثيل',
    'عقاب'
  ];
  
  useGSAP(() => {
    // Animate title
    gsap.fromTo(
      '.punishment-title',
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );
    
    // Animate wheel
    gsap.fromTo(
      '.wheel',
      { opacity: 0, scale: 0.8, rotation: 0 },
      { 
        opacity: 1, 
        scale: 1, 
        rotation: 0,
        duration: 1, 
        delay: 0.5,
        ease: 'power2.out' 
      }
    );
    
    // Animate buttons
    gsap.fromTo(
      '.punishment-btn',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
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
    
    // Animate the punishment text
    if (punishment) {
      gsap.fromTo(
        '.punishment-text',
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: 'power2.out' 
        }
      );
    }
  }, [punishment]);
  
  useEffect(() => {
    if (isGenerating) {
      // Simulate AI generating punishment
      const timer = setTimeout(() => {
        generatePunishment();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isGenerating]);
  
  const spinWheel = () => {
    // Reset
    setIsGenerating(true);
    setPunishment('');
    
    // Random rotation between 2 and 5 full rotations plus a segment
    const segments = punishmentCategories.length;
    const segmentAngle = 360 / segments;
    const randomSegment = Math.floor(Math.random() * segments);
    const randomOffset = Math.random() * segmentAngle;
    const totalRotation = 720 + 1080 * Math.random() + (randomSegment * segmentAngle) + randomOffset;
    
    // Animate wheel spin
    gsap.to('.wheel', {
      rotation: totalRotation,
      duration: 3,
      ease: 'power4.out',
      onComplete: () => {
        setWheelRotation(totalRotation);
        setSelectedSegment(randomSegment);
        setIsGenerating(true);
      }
    });
  };
  
  const generatePunishment = () => {
    // Simulate AI generating a punishment based on the selected category
    const category = selectedSegment >= 0 ? punishmentCategories[selectedSegment] : punishmentCategories[0];
    
    let generatedPunishment = '';
    
    switch (category) {
      case 'تحدي':
        generatedPunishment = `يجب على فريق "${teamName}" أن يقوم بتحدي تناول ملعقة كاملة من الليمون أو الخل أمام الجميع.`;
        break;
      case 'غناء':
        generatedPunishment = `يجب على فريق "${teamName}" أن يغني أغنية شعبية مع رقصة مضحكة لمدة دقيقة كاملة.`;
        break;
      case 'رقص':
        generatedPunishment = `يجب على فريق "${teamName}" أن يؤدي رقصة عفوية على أنغام أغنية يختارها الفريق الفائز.`;
        break;
      case 'تقليد':
        generatedPunishment = `يجب على فريق "${teamName}" أن يقلد شخصية مشهورة أو حيوان لمدة دقيقة والفريق الآخر يحاول التخمين.`;
        break;
      case 'سؤال':
        generatedPunishment = `يجب على فريق "${teamName}" الإجابة بصدق على سؤال محرج يطرحه الفريق الفائز.`;
        break;
      case 'اعتراف':
        generatedPunishment = `يجب على كل عضو في فريق "${teamName}" الاعتراف بموقف محرج حدث له في الماضي.`;
        break;
      case 'تمثيل':
        generatedPunishment = `يجب على فريق "${teamName}" تمثيل مشهد صامت من فيلم شهير والفريق الآخر يحاول التخمين.`;
        break;
      case 'عقاب':
        generatedPunishment = `يجب على فريق "${teamName}" تقديم وجبة خفيفة أو مشروبات للفريق الفائز في اللقاء القادم.`;
        break;
      default:
        generatedPunishment = `يجب على فريق "${teamName}" أداء تحدي يختاره الفريق الفائز.`;
    }
    
    setPunishment(generatedPunishment);
    setIsGenerating(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-panel p-8 shadow-lg text-center">
        <h2 className="punishment-title text-3xl font-bold gold-text mb-6">
          عجلة العقاب
        </h2>
        
        <p className="text-white mb-6">
          فريق {teamName} خسر المباراة وعليه تنفيذ العقاب!
        </p>
        
        <div className="wheel-container relative mb-8 flex justify-center">
          <div className="wheel relative w-64 h-64">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {punishmentCategories.map((category, index) => {
                const segments = punishmentCategories.length;
                const angle = 360 / segments;
                const startAngle = index * angle;
                const endAngle = (index + 1) * angle;
                
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                
                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                // Calculate text position
                const textAngle = (startAngle + endAngle) / 2;
                const textRad = (textAngle * Math.PI) / 180;
                const textX = 50 + 30 * Math.cos(textRad);
                const textY = 50 + 30 * Math.sin(textRad);
                
                // Calculate rotation for text
                const textRotation = textAngle + 90;
                
                return (
                  <g key={index}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={`hsl(${index * 45}, 70%, ${selectedSegment === index ? '50%' : '30%'})`}
                      stroke="#FFD700"
                      strokeWidth="0.5"
                    />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="4"
                      fontWeight={selectedSegment === index ? 'bold' : 'normal'}
                      transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    >
                      {category}
                    </text>
                  </g>
                );
              })}
              <circle cx="50" cy="50" r="5" fill="#FFD700" />
            </svg>
            
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="#FFD700" />
              </svg>
            </div>
          </div>
        </div>
        
        {punishment ? (
          <div className="mb-8">
            <div className="glass-panel p-4 punishment-text">
              <h3 className="text-xl font-bold text-accent-400 mb-2">
                العقاب:
              </h3>
              <p className="text-white text-lg">
                {punishment}
              </p>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="mb-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-accent-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="mr-3 text-white">جاري توليد العقاب...</span>
          </div>
        ) : null}
        
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 md:space-x-reverse">
          <button 
            onClick={spinWheel}
            className="punishment-btn glass-button py-3 px-6"
            disabled={isGenerating}
          >
            تدوير العجلة
          </button>
          
          <button 
            onClick={resetGame}
            className="punishment-btn gold-button py-3 px-6 glow-effect"
          >
            لعبة جديدة
          </button>
        </div>
      </div>
    </div>
  );
};

export default PunishmentView;
