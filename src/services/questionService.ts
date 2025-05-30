import axios from 'axios';
import { toast } from "sonner"; // Assuming sonner is installed for notifications

// Define the Question interface
export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Define the categories (exported as requested by other components)
export const categories = [
  { id: "general", name: "معلومات عامة" },
  { id: "history", name: "تاريخ" },
  { id: "science", name: "علوم" },
  { id: "geography", name: "جغرافيا" },
  { id: "sports", name: "رياضة" },
  { id: "arabculture", name: "ثقافة عربية" },
  { id: "inventions", name: "اختراعات" },
  { id: "literature", name: "أدب" }
];

// Fallback questions for each category
const fallbackQuestions: Record<string, Question[]> = {
  general: [
    { question: "ما هي عاصمة المملكة العربية السعودية؟", options: ["الرياض", "جدة", "مكة", "المدينة"], correctAnswer: "الرياض" },
    { question: "ما هو أطول نهر في العالم؟", options: ["النيل", "الأمازون", "المسيسيبي", "اليانغتسي"], correctAnswer: "النيل" },
  ],
  history: [
    { question: "متى بدأت الحرب العالمية الأولى؟", options: ["1914", "1918", "1939", "1945"], correctAnswer: "1914" },
  ],
  science: [
    { question: "ما هي أصغر وحدة في الكائن الحي؟", options: ["الخلية", "الذرة", "الجزء", "النواة"], correctAnswer: "الخلية" },
  ],
  // Add more fallback questions for other categories as needed
};

// Cache for pre-generated questions
const questionCache: Record<string, Question[]> = {};

// Set to keep track of already used questions to avoid repetition
const usedQuestions = new Set<string>();

// Function to parse text returned from Gemini model into an array of questions.
function parseQuestions(text: string): Question[] {
  const questions: Question[] = [];
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  
  for (const line of lines) {
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length >= 6) {
      if (
        parts[0] && 
        parts[1] && parts[2] && parts[3] && parts[4] && parts[5] &&
        !usedQuestions.has(parts[0]) // Check if question already used
      ) {
        const options = parts.slice(1, 5);
        const correctAnswer = parts[5];
        
        if (options.includes(correctAnswer)) {
          questions.push({
            question: parts[0],
            options: options,
            correctAnswer: correctAnswer,
          });
        }
      }
    }
  }
  
  // Ensure no duplicate questions are returned in this batch
  const uniqueQuestions: Question[] = [];
  const questionTexts = new Set<string>();
  
  for (const q of questions) {
    if (!questionTexts.has(q.question)) {
      questionTexts.add(q.question);
      uniqueQuestions.push(q);
    }
  }
  
  return uniqueQuestions;
}

// Generate questions using Gemini API (or fallback)
// Updated signature to match original usage
export async function generateQuestions(categoryId: string, count: number, difficulty: number = 50, customCategoryName?: string): Promise<Question[]> {
  console.log(`Generating ${count} questions for category ${categoryId} (difficulty: ${difficulty})`);
  
  const cacheKey = customCategoryName 
    ? `custom_${customCategoryName}_${difficulty}`
    : `${categoryId}_${difficulty}`;

  if (questionCache[cacheKey] && questionCache[cacheKey].length > 0) {
    const unusedQuestions = questionCache[cacheKey].filter(q => !usedQuestions.has(q.question));
    if (unusedQuestions.length >= count) {
      console.log(`Using ${count} unused cached questions for ${cacheKey}`);
      const selectedQuestions = unusedQuestions.slice(0, count);
      selectedQuestions.forEach(q => usedQuestions.add(q.question));
      return selectedQuestions;
    }
    console.log("Not enough unused questions in cache, generating new ones for", cacheKey);
  }

  let categoryName: string;
  if (categoryId.startsWith('custom-') && customCategoryName) {
    categoryName = customCategoryName;
  } else {
    const categoryObj = categories.find((cat) => cat.id === categoryId);
    categoryName = categoryObj ? categoryObj.name : "معلومات عامة"; // Fallback category name
  }

  let difficultyText = "متوسطة";
  if (difficulty < 30) difficultyText = "سهلة";
  else if (difficulty > 70) difficultyText = "صعبة";

  const prompt = `أنشئ ${count + 5} أسئلة اختيارات متعددة باللغة العربية الفصحى في فئة "${categoryName}" بمستوى صعوبة "${difficultyText}".\n\nالشروط المهمة:\n1. الأسئلة يجب أن تكون متنوعة وفريدة وغير متكررة تماماً\n2. تجنب الأسئلة البديهية أو المتشابهة في المعنى\n3. لا تستخدم أسئلة تقليدية يمكن توقعها بسهولة\n4. تأكد من أن الخيارات واضحة ومتمايزة ومختلفة عن بعضها\n5. الإجابة الصحيحة يجب أن تكون واحدة فقط من الخيارات وموجودة بنفس الصيغة التي ذكرتها\n6. استخدم علامات الترقيم المناسبة والتدقيق النحوي والإملائي\n\nأخرج النتائج بالتنسيق التالي فقط (قسم كل حقل بعلامة |):\nالسؤال؟ | الخيار الأول | الخيار الثاني | الخيار الثالث | الخيار الرابع | الإجابة الصحيحة`;

  // Replace with your actual API key retrieval method (e.g., environment variable)
  const apiKey = "AIzaSyA9ENzzy5XKee0y19g__eqazFzO7A__Ddg"; // Use the key from the original file for now
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.8, topP: 0.95, topK: 64, maxOutputTokens: 8192 }
  };

  try {
    console.log("Sending request to Gemini API for category:", categoryName);
    // Use axios as in the original file, or keep fetch if preferred
    const response = await axios.post(url, payload);

    const resultText = response.data.candidates[0].content.parts[0].text;
    console.log("Received response from Gemini API");
    
    const parsedQuestions = parseQuestions(resultText);
    console.log(`Parsed ${parsedQuestions.length} valid questions`);
    
    if (parsedQuestions.length === 0) throw new Error("لم يتم توليد أي أسئلة صالحة");
    
    // Update cache
    questionCache[cacheKey] = (questionCache[cacheKey] || []).concat(parsedQuestions)
                                  .filter((q, index, self) => index === self.findIndex((t) => t.question === q.question)); // Keep unique
    
    const selectedQuestions = parsedQuestions.slice(0, count);
    selectedQuestions.forEach(q => usedQuestions.add(q.question));
    
    console.log(`Successfully generated and selected ${selectedQuestions.length} questions for ${cacheKey}`);
    return selectedQuestions;

  } catch (error) {
    console.error("خطأ أثناء توليد الأسئلة:", error);
    toast.error("حدث خطأ أثناء توليد الأسئلة، سيتم استخدام أسئلة افتراضية.");
    
    const fallbackCategory = categoryId.startsWith('custom-') ? 'general' : categoryId;
    const fallbackCategoryQuestions = fallbackQuestions[fallbackCategory] || fallbackQuestions["general"];
    const numFallback = Math.min(count, fallbackCategoryQuestions.length);
    console.log(`Using ${numFallback} fallback questions for ${categoryId}`);
    return fallbackCategoryQuestions.slice(0, numFallback);
  }
}

// Function to pre-generate questions (optional, can be called at app start)
export async function preGenerateQuestions() {
  console.log("Pre-generating questions for all categories...");
  for (const category of categories) {
    try {
      if (!questionCache[`${category.id}_50`] || questionCache[`${category.id}_50`].length < 10) { // Check cache before generating
        await generateQuestions(category.id, 10, 50); // Generate 10 medium questions
      }
    } catch (error) {
      console.error(`Error pre-generating questions for ${category.name}:`, error);
    }
  }
}

// Reset the set of used questions (exported as requested)
export function resetUsedQuestions() {
  usedQuestions.clear();
  console.log("Reset used questions tracking");
}

// Swap the current question with another unused one from the cache or generate a new one (exported as requested)
export async function swapQuestion(categoryId: string, currentQuestion: Question, difficulty: number = 50): Promise<Question | null> {
  console.log(`Swapping question for category ${categoryId}`);
  const cacheKey = `${categoryId}_${difficulty}`;
  
  if (questionCache[cacheKey]) {
    const unusedQuestion = questionCache[cacheKey].find(q => 
      !usedQuestions.has(q.question) && q.question !== currentQuestion.question
    );
    
    if (unusedQuestion) {
      console.log("Found unused question in cache for swap");
      usedQuestions.add(unusedQuestion.question);
      return unusedQuestion;
    }
  }
  
  console.log("No suitable question in cache, generating a new one for swap");
  try {
    const newQuestions = await generateQuestions(categoryId, 1, difficulty);
    if (newQuestions.length > 0 && newQuestions[0].question !== currentQuestion.question) {
      console.log("Successfully generated a new question for swap");
      // usedQuestions.add(newQuestions[0].question); // Already added in generateQuestions
      return newQuestions[0];
    }
  } catch (error) {
    console.error("خطأ أثناء توليد سؤال بديل:", error);
  }
  
  toast.error("لم نتمكن من تبديل السؤال.");
  return null;
}

// Function to generate AI-powered punishment
export const generatePunishment = async (teamName: string): Promise<string> => {
  try {
    const prompt = `اقترح عقاباً مضحكاً ومناسباً لفريق \"${teamName}\" الذي خسر في مسابقة معرفية. يجب أن يكون العقاب مسلياً وغير محرج بشكل مفرط، ومناسباً للتنفيذ في مجموعة من الأصدقاء. قدم العقاب في جملة أو جملتين فقط.`;
    
    // Replace with your actual API key retrieval method
    const apiKey = "AIzaSyA9ENzzy5XKee0y19g__eqazFzO7A__Ddg"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    // Use axios or fetch
    const response = await axios.post(url, payload);
    const generatedPunishment = response.data.candidates[0].content.parts[0].text;
    return generatedPunishment.trim();

  } catch (error) {
    console.error('Error generating punishment:', error);
    // Fallback punishment
    const punishments = [
      `يجب على فريق \"${teamName}\" أن يقوم بتحدي تناول ملعقة كاملة من الليمون أو الخل أمام الجميع.`,
      `يجب على فريق \"${teamName}\" أن يغني أغنية شعبية مع رقصة مضحكة لمدة دقيقة كاملة.`,
      `يجب على فريق \"${teamName}\" أن يؤدي رقصة عفوية على أنغام أغنية يختارها الفريق الفائز.`,
      `يجب على فريق \"${teamName}\" أن يقلد شخصية مشهورة أو حيوان لمدة دقيقة والفريق الآخر يحاول التخمين.`,
    ];
    return punishments[Math.floor(Math.random() * punishments.length)];
  }
};
