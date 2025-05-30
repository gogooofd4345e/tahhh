import React, { useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface CategorySelectorProps {
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  maxCategories?: number;
  onComplete?: (categories: string[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  maxCategories = 3,
  onComplete
}) => {
  const [error, setError] = useState<string | null>(null);
  
  useGSAP(() => {
    // Animate categories appearance
    gsap.fromTo(
      '.category-item',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1,
        ease: 'power2.out' 
      }
    );
    
    // Animate selected categories
    gsap.fromTo(
      '.selected-category',
      { scale: 0.9, opacity: 0.8 },
      { 
        scale: 1, 
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)' 
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
  }, [selectedCategories]);

  const toggleCategory = (category: string) => {
    setError(null);
    
    if (selectedCategories.includes(category)) {
      // Remove category if already selected
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      // Add category if not at max
      if (selectedCategories.length < maxCategories) {
        setSelectedCategories([...selectedCategories, category]);
      } else {
        setError(`يمكنك اختيار ${maxCategories} تصنيفات كحد أقصى`);
        
        // Shake error message
        gsap.to('.error-message', {
          keyframes: [
            { x: 0 },
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
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold gold-text mb-6 text-center">
        اختر تصنيفات الأسئلة
      </h2>
      
      {error && (
        <div className="error-message bg-red-500/20 text-white p-3 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => toggleCategory(category)}
            className={`category-item p-4 rounded-xl transition-all duration-300 text-center ${
              selectedCategories.includes(category)
                ? 'selected-category bg-gradient-to-r from-accent-600 to-accent-400 text-dark-400 font-bold'
                : 'glass-button text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="text-center text-white/70 text-sm">
        اختر {maxCategories} تصنيفات كحد أقصى ({selectedCategories.length}/{maxCategories})
      </div>
      
      {onComplete && (
        <div className="mt-6 text-center">
          <button
            onClick={() => onComplete(selectedCategories)}
            className="gold-button py-2 px-6 glow-effect"
            disabled={selectedCategories.length === 0}
          >
            متابعة
          </button>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
