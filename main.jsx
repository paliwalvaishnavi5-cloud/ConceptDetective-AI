import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Award,
  Target,
  User,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
  GraduationCap,
  School,
  Eye,
  Info
} from 'lucide-react';

// --- DATA & CONTENT ---

const EDUCATION_LEVELS = [
  { id: 'school', name: 'School', icon: <School className="w-6 h-6" />, desc: "Core foundational concepts" },
  { id: 'college', name: 'College / Undergraduate', icon: <BookOpen className="w-6 h-6" />, desc: "Intermediate principles" },
  { id: 'graduation', name: 'Graduation', icon: <GraduationCap className="w-6 h-6" />, desc: "Advanced theoretical concepts" },
];

const TOPICS = [
  { id: 'cs', name: 'Computer Science', icon: <Activity className="w-6 h-6" />, color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { id: 'biology', name: 'Biology', icon: <Zap className="w-6 h-6" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { id: 'math', name: 'Mathematics', icon: <Target className="w-6 h-6" />, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { id: 'physics', name: 'Physics', icon: <Eye className="w-6 h-6" />, color: 'text-violet-600 bg-violet-50 border-violet-100' },
];

// Fallback question bank organized by level and subject with smart evaluation criteria
const QUESTION_BANK = {
  school: {
    biology: {
      question: "Why do plants need sunlight?",
      hint: "Think about how plants obtain their food compared to humans.",
      correctKeywords: ["photosynthesis", "make food", "produce food", "energy", "glucose", "sugar"],
      misconceptionKeywords: ["vitamin", "warm", "grow big", "sunscreen", "breathe", "water"],
      evaluations: {
        correct: { status: 'correct', score: 95, understood: ["Plants use sunlight for energy.", "Sunlight drives photosynthesis to create food."], misconception: null, missingConcept: null, simpleExplanation: "Excellent! You understand that sunlight isn't just for warmth, it's the fundamental energy source for photosynthesis, allowing plants to synthesize their own food." },
        partial: { status: 'partial', score: 60, understood: ["Sunlight is important for plant survival."], misconception: "Incomplete mechanism.", missingConcept: "Photosynthesis and energy conversion.", simpleExplanation: "You know sunlight is essential, but remember the specific process: Photosynthesis. Plants use sunlight as energy to convert water and carbon dioxide into food." },
        incorrect: { status: 'incorrect', score: 35, understood: ["Sunlight affects plants."], misconception: "Viewing sunlight merely as a 'vitamin' or 'warmth' source rather than the primary energy source for creating food.", missingConcept: "Photosynthesis: The process where plants convert light energy into chemical energy.", simpleExplanation: "Unlike humans who eat food, plants *make* their own food. Sunlight isn't just a vitamin for them; it's the energy that powers their 'food factory' (photosynthesis)." }
      }
    },
    physics: {
      question: "Why does a heavier object not fall faster than a lighter object in a vacuum?",
      hint: "Think about the relationship between gravity and mass.",
      correctKeywords: ["acceleration", "constant", "inertia", "cancel", "ratio", "same rate"],
      misconceptionKeywords: ["heavier", "weight makes it fast", "pulls harder", "air resistance"],
      evaluations: {
        correct: { status: 'correct', score: 90, understood: ["Gravity accelerates all objects equally in a vacuum.", "Mass and gravitational pull cancel out."], misconception: null, missingConcept: null, simpleExplanation: "Spot on! The larger gravitational force on a heavier object is perfectly offset by its greater inertia (resistance to moving). Thus, they accelerate at the exact same rate." },
        partial: { status: 'partial', score: 55, understood: ["They fall at the same speed in a vacuum."], misconception: "Unable to explain the 'why' behind the phenomenon.", missingConcept: "The interplay between gravitational force and inertia.", simpleExplanation: "You got the result right! But the reason *why* is that while gravity pulls harder on a heavy object, that heavy object also requires more force to move (inertia). These two factors perfectly balance out." },
        incorrect: { status: 'incorrect', score: 30, understood: ["Recognizes gravity is involved."], misconception: "Believing heavier objects should fall faster due to greater weight.", missingConcept: "Acceleration due to gravity is constant for all objects, regardless of mass.", simpleExplanation: "It feels intuitive that heavy things fall faster, but in a vacuum (no air), they don't! Gravity pulls a bowling ball harder, but the bowling ball is also much harder to get moving (inertia). They perfectly cancel out." }
      }
    },
    cs: {
      question: "What is a computer algorithm?",
      hint: "Think about instructions or recipes.",
      correctKeywords: ["step-by-step", "instructions", "recipe", "solve", "process", "rules"],
      misconceptionKeywords: ["code", "programming language", "python", "java", "machine"],
      evaluations: {
        correct: { status: 'correct', score: 90, understood: ["An algorithm is a sequence of steps.", "It is independent of code."], misconception: null, missingConcept: null, simpleExplanation: "Perfect. An algorithm is just a clear set of step-by-step instructions to solve a problem, much like a recipe for baking a cake." },
        partial: { status: 'partial', score: 60, understood: ["It's related to how computers work."], misconception: "Slight confusion between algorithm and implementation.", missingConcept: "Algorithms are conceptual and language-agnostic.", simpleExplanation: "You're close! An algorithm is the *idea* or the *steps* to solve a problem. It's not the code itself, but the logic you figure out before you write the code." },
        incorrect: { status: 'incorrect', score: 35, understood: ["It's something a computer does."], misconception: "Confusing an algorithm directly with code or a specific programming language.", missingConcept: "An algorithm is a step-by-step set of instructions independent of any language.", simpleExplanation: "An algorithm isn't code (like Python or Java). It is like a recipe for baking a cake. It's the steps you take. The programming language is just the specific language you use to write that recipe down for the computer." }
      }
    },
    math: {
      question: "Why is any non-zero number to the power of 0 equal to 1?",
      hint: "Think about patterns when you divide exponents.",
      correctKeywords: ["divide", "pattern", "subtract", "rule", "fraction"],
      misconceptionKeywords: ["zero", "nothing", "multiply by zero", "empty"],
      evaluations: {
        correct: { status: 'correct', score: 95, understood: ["Understands exponent rules.", "Recognizes the division pattern."], misconception: null, missingConcept: null, simpleExplanation: "Exactly! As you decrease the exponent by 1 (e.g., 2^3, 2^2, 2^1), you divide by the base. So 2^1 / 2 = 2^0, which is 2/2 = 1." },
        partial: { status: 'partial', score: 50, understood: ["Knows the rule x^0 = 1."], misconception: "Relying on memorization rather than mathematical logic.", missingConcept: "The pattern of exponentiation based on division.", simpleExplanation: "You memorized the rule correctly! But to understand *why*: think of exponents as dividing by the base as you go down. 2^2=4. Divide by 2 to get 2^1=2. Divide by 2 again to get 2^0=1." },
        incorrect: { status: 'incorrect', score: 20, understood: ["Attempted to apply multiplication rules."], misconception: "Thinking 'power of 0' means multiplying the base by zero.", missingConcept: "Exponents represent repeated multiplication/division, not multiplying by the exponent itself.", simpleExplanation: "It's a common trap to think 5^0 means 5 * 0. But exponents are about patterns of division. 5^2 is 25. 5^1 is 5 (divided by 5). So 5^0 must be 5 divided by 5, which is exactly 1." }
      }
    }
  },
  college: {
    biology: { question: "How does DNA replication ensure accurate copying?", hint: "Focus on the structure of DNA.", correctKeywords: ["base pairing", "template", "semi-conservative", "polymerase"], misconceptionKeywords: ["new", "from scratch", "photocopy", "magic"], evaluations: { correct: { status: 'correct', score: 90, understood: ["Semi-conservative replication.", "Complementary base pairing."], misconception: null, missingConcept: null, simpleExplanation: "Great. The double helix unzips, and each original strand acts as a template. Because A only pairs with T and C with G, the new strands are exact copies." }, partial: { status: 'partial', score: 55, understood: ["DNA copies itself."], misconception: "Missing the mechanical details of the process.", missingConcept: "Complementary base pairing rules (A-T, C-G).", simpleExplanation: "You know it copies, but the *how* is key. DNA unzips, and enzymes build new halves by matching specific pieces (A with T, C with G) to the exposed strands, ensuring a perfect match." }, incorrect: { status: 'incorrect', score: 30, understood: ["DNA duplicates."], misconception: "Thinking it's a completely new synthesis rather than a templated process.", missingConcept: "Semi-conservative replication.", simpleExplanation: "DNA doesn't just 'photocopy' itself out of nowhere. It unzips like a zipper. Because the teeth of the zipper only fit together in specific pairs (A with T, C with G), each half perfectly rebuilds the other." } } },
    physics: { question: "Explain entropy in thermodynamics.", hint: "Think about order, disorder, and microstates.", correctKeywords: ["microstates", "disorder", "probability", "second law", "energy dispersal"], misconceptionKeywords: ["messy", "chaos", "room", "broken"], evaluations: { correct: { status: 'correct', score: 95, understood: ["Statistical definition of entropy.", "Energy dispersal."], misconception: null, missingConcept: null, simpleExplanation: "Excellent. Entropy is a measure of the number of possible microscopic arrangements (microstates) that result in the same macroscopic state. It's about probability, not just 'chaos'." }, partial: { status: 'partial', score: 60, understood: ["It is related to disorder and the arrow of time."], misconception: "Over-relying on the 'messy room' analogy.", missingConcept: "The statistical mechanics perspective of microstates.", simpleExplanation: "You have the basic idea! But in physics, entropy isn't just 'messiness'. It's about probability. There are simply more ways for energy to be spread out (high entropy) than concentrated (low entropy)." }, incorrect: { status: 'incorrect', score: 35, understood: ["It has to do with things breaking down."], misconception: "Viewing entropy purely as visual 'messiness'.", missingConcept: "Statistical mechanics definition of entropy.", simpleExplanation: "Entropy isn't just about a messy room. It's about probability. There are many more ways for energy/matter to be dispersed than to be concentrated. Systems naturally evolve toward states with higher probability." } } },
    cs: { question: "What is the primary difference between a stack and a queue?", hint: "Think about how items are added and removed.", correctKeywords: ["lifo", "fifo", "last in", "first in", "first out"], misconceptionKeywords: ["same", "array", "memory", "sort"], evaluations: { correct: { status: 'correct', score: 95, understood: ["LIFO vs FIFO principles.", "Data structure operations."], misconception: null, missingConcept: null, simpleExplanation: "Perfect. A stack uses Last-In-First-Out (LIFO), like a stack of plates. A queue uses First-In-First-Out (FIFO), like a line at a grocery store." }, partial: { status: 'partial', score: 50, understood: ["They store data in order."], misconception: "Confused about which one is LIFO and which is FIFO.", missingConcept: "Clear distinction of retrieval order.", simpleExplanation: "You know they are ordered lists, but you mixed up the order! Stack = Last In First Out (like pancakes). Queue = First In First Out (like a checkout line)." }, incorrect: { status: 'incorrect', score: 25, understood: ["They are data structures."], misconception: "Believing they are just regular arrays with random access.", missingConcept: "Strict access rules (LIFO and FIFO).", simpleExplanation: "They aren't just generic lists. A stack is strictly Last-In, First-Out (like taking the top book off a pile). A queue is strictly First-In, First-Out (like waiting in line for a ticket)." } } },
    math: { question: "What does the derivative of a function represent geometrically?", hint: "Think about lines on a graph.", correctKeywords: ["slope", "tangent", "instantaneous", "rate of change"], misconceptionKeywords: ["area", "secant", "intersect", "average"], evaluations: { correct: { status: 'correct', score: 95, understood: ["Slope of the tangent line.", "Instantaneous rate of change."], misconception: null, missingConcept: null, simpleExplanation: "Spot on. The derivative gives the exact slope of the tangent line at any single point on the curve, representing instantaneous rate of change." }, partial: { status: 'partial', score: 60, understood: ["It represents the slope."], misconception: "Not specifying that it is the *tangent* line or *instantaneous*.", missingConcept: "The limit as the interval approaches zero.", simpleExplanation: "You are right that it's a slope! But specifically, it is the slope of the *tangent* line at one exact point, not the average slope between two points." }, incorrect: { status: 'incorrect', score: 30, understood: ["It relates to graphs."], misconception: "Confusing derivative with area or average slope.", missingConcept: "Instantaneous rate of change / Tangent line.", simpleExplanation: "The derivative isn't the area (that's the integral). Geometrically, the derivative is the slope of the tangent line at a single, specific point. It tells you exactly how fast the curve is changing right there." } } }
  },
  graduation: {
    // Re-using the structure for graduation to ensure the app works fully.
    biology: { question: "Explain the role of CRISPR-Cas9 in genome editing.", hint: "Focus on how it targets specific sequences.", correctKeywords: ["guide rna", "nuclease", "cut", "target", "scissors"], misconceptionKeywords: ["magic", "random", "mutate everything"], evaluations: { correct: { status: 'correct', score: 95, understood: ["Cas9 acts as an endonuclease.", "Guide RNA provides target specificity."], misconception: null, missingConcept: null, simpleExplanation: "Excellent. You identified that Cas9 is the cutting enzyme (scissors) and the guide RNA is the programmable GPS that ensures the cut happens at the exact right location." }, partial: { status: 'partial', score: 65, understood: ["It cuts/edits DNA."], misconception: "Missing the targeting mechanism.", missingConcept: "The specific role of guide RNA.", simpleExplanation: "You know it edits DNA, but the crucial part is *how* it finds the right spot. It uses a 'guide RNA' that matches the target DNA sequence, acting like a GPS for the Cas9 scissors." }, incorrect: { status: 'incorrect', score: 35, understood: ["It's related to genetics."], misconception: "Thinking it edits DNA randomly or without a targeting mechanism.", missingConcept: "The role of guide RNA in directing the Cas9 nuclease.", simpleExplanation: "CRISPR doesn't just chop DNA randomly. It works like a pair of molecular scissors (Cas9) paired with a GPS (guide RNA). The guide RNA matches a specific DNA sequence, directing the scissors to cut exactly there." } } },
    physics: { question: "What is the core meaning of the Heisenberg Uncertainty Principle?", hint: "Think about measurement at the quantum level vs practical limitations.", correctKeywords: ["fundamental limit", "wave", "position", "momentum", "simultaneous"], misconceptionKeywords: ["bad tools", "measurement error", "observer effect", "clumsy"], evaluations: { correct: { status: 'correct', score: 95, understood: ["It's a fundamental property of nature.", "Relates to position and momentum."], misconception: null, missingConcept: null, simpleExplanation: "Perfect. You understand that this is a built-in feature of wave mechanics in the universe, not a limitation of human measurement tools or the observer effect." }, partial: { status: 'partial', score: 60, understood: ["We can't know position and momentum exactly."], misconception: "Confusing it slightly with the observer effect.", missingConcept: "Distinction between fundamental uncertainty and measurement disturbance.", simpleExplanation: "You know the rule! But remember *why*: it's not because our microscopes bump the particles (observer effect). It's because particles are waves, and a wave doesn't have a single precise 'location'." }, incorrect: { status: 'incorrect', score: 30, understood: ["We can't know everything perfectly."], misconception: "Believing it's due to limitations in our measurement instruments.", missingConcept: "It's a fundamental property of wave-like quantum systems.", simpleExplanation: "It's a common misconception that our tools just aren't good enough yet. The truth is much stranger: particles act like waves. You can't simultaneously pin down exactly where a wave is and how fast it's rippling. It's a limit of the universe itself." } } },
    cs: { question: "Explain the CAP theorem in distributed systems.", hint: "Consistency, Availability, Partition Tolerance.", correctKeywords: ["consistency", "availability", "partition", "choose two", "network failure"], misconceptionKeywords: ["database speed", "security", "cap limits", "cpu"], evaluations: { correct: { status: 'correct', score: 95, understood: ["Network partitions are inevitable.", "Trade-off between Consistency and Availability."], misconception: null, missingConcept: null, simpleExplanation: "Excellent. Since Partition Tolerance (P) is a given in distributed networks, a system must fundamentally trade off between perfect Consistency (C) and 100% Availability (A) during a failure." }, partial: { status: 'partial', score: 65, understood: ["It involves Consistency, Availability, Partition Tolerance."], misconception: "Thinking you can choose ANY two (e.g., CA without P).", missingConcept: "Partitions are unavoidable in distributed systems.", simpleExplanation: "You named the parts! But remember, in reality, network partitions (P) *will* happen. So the theorem really means: *when* a partition happens, you must choose between Consistency and Availability." }, incorrect: { status: 'incorrect', score: 35, understood: ["It's about distributed databases."], misconception: "Misunderstanding the trade-offs completely.", missingConcept: "In a network prone to partitions, you must choose between Consistency and Availability.", simpleExplanation: "The CAP theorem states that when a network breaks (a partition), you have to choose: Do you stop answering requests to ensure all data stays perfectly synced (Consistency), or do you keep answering, even if some answers might be outdated (Availability)?" } } },
    math: { question: "What is the core idea behind Godel's Incompleteness Theorems?", hint: "Think about formal systems and proofs.", correctKeywords: ["unprovable", "true but unprovable", "axioms", "formal system", "contradiction"], misconceptionKeywords: ["math is wrong", "broken", "useless", "errors"], evaluations: { correct: { status: 'correct', score: 95, understood: ["Mathematical systems have limits.", "Truth and provability are not the same."], misconception: null, missingConcept: null, simpleExplanation: "Spot on. Godel proved that in any sufficiently complex formal system, there will always be statements that are true but cannot be proven using the rules of that system." }, partial: { status: 'partial', score: 60, understood: ["Math cannot prove everything."], misconception: "Thinking it means mathematics is fundamentally flawed.", missingConcept: "The distinction between truth and formal provability.", simpleExplanation: "You understand the limitation! However, it doesn't mean math is 'broken'. It simply proves a profound philosophical point: 'Truth' is a bigger concept than 'Provability' within a strict set of rules." }, incorrect: { status: 'incorrect', score: 30, understood: ["It involves math having limits."], misconception: "Thinking it means math is flawed or that 1+1 might not be 2.", missingConcept: "In any sufficiently strong formal system, there are true statements that cannot be proven within the system itself.", simpleExplanation: "Godel didn't show that math is wrong. He showed that math is like a language where you can construct a sentence that says 'This sentence cannot be proven.' If it's false, the system is broken. If it's true, then there's a truth the system can't prove. Math is always 'incomplete'." } } }
  }
};

const INSUFFICIENT_EVALUATION = {
  status: 'insufficient',
  score: 0,
  understood: ["None detected."],
  misconception: null,
  missingConcept: "We need more information to evaluate your reasoning.",
  simpleExplanation: "Your answer was very short, or indicated that you don't know. Don't worry about being wrong in ConceptLens AI! We need you to guess or explain your thought process so we can find the misconception. Please try again."
};

// Evaluate student answer logic
const evaluateStudentAnswer = (questionData, answer, reasoning) => {
  const combinedText = `${answer} ${reasoning}`.toLowerCase();
  
  const insufficientPhrases = ["don't know", "dont know", "not sure", "no idea", "idk", "no clue", "blank", "nothing"];
  const wordCount = combinedText.trim().split(/\s+/).length;

  if (wordCount < 4 || insufficientPhrases.some(phrase => combinedText.includes(phrase))) {
    return INSUFFICIENT_EVALUATION;
  }

  let correctMatches = 0;
  questionData.correctKeywords.forEach(kw => {
    if (combinedText.includes(kw)) correctMatches++;
  });

  let misconceptionMatches = 0;
  questionData.misconceptionKeywords.forEach(kw => {
    if (combinedText.includes(kw)) misconceptionMatches++;
  });

  if (correctMatches >= 1 && misconceptionMatches === 0) {
    return questionData.evaluations.correct;
  } else if (misconceptionMatches > 0) {
    return questionData.evaluations.incorrect;
  } else {
    return questionData.evaluations.partial;
  }
};

const ConceptLensAI = () => {
  const [currentStep, setCurrentStep] = useState('landing'); // landing, level, topics, challenge, analysis, teachback, report
  const [educationLevel, setEducationLevel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [userReasoning, setUserReasoning] = useState('');
  const [teachbackAnswer, setTeachbackAnswer] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [teachbackResult, setTeachbackResult] = useState(null);

  const simulateAnalysis = (stepToMoveTo, delay = 1500, callback) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      if(callback) callback();
      setCurrentStep(stepToMoveTo);
    }, delay);
  };

  const handleStart = () => setCurrentStep('level');

  const handleSelectLevel = (levelId) => {
      setEducationLevel(levelId);
      setCurrentStep('topics');
  };

  const handleSelectTopic = (topicId) => {
    setSelectedTopic(topicId);
    
    // Generate/fetch question based on level and topic
    const questionData = QUESTION_BANK[educationLevel][topicId];
    setActiveQuestion(questionData);

    setCurrentStep('challenge');
    setUserAnswer("");
    setUserReasoning("");
  };

  const handleInvestigate = () => {
    const result = evaluateStudentAnswer(activeQuestion, userAnswer, userReasoning);
    setAnalysisData(result);
    simulateAnalysis('analysis');
  };

  const handleStartTeachback = () => setCurrentStep('teachback');

  const handleEvaluateTeachback = () => {
      if(!teachbackAnswer.trim()) return;
      
      simulateAnalysis('report', 2000, () => {
        // Simple dynamic teachback evaluation
        const length = teachbackAnswer.trim().split(/\s+/).length;
        let finalScore = analysisData.score;
        let improved = false;
        
        if (length > 15) {
          finalScore = Math.min(100, finalScore + 30);
          improved = true;
        } else {
          finalScore = Math.min(100, finalScore + 10);
        }

        setTeachbackResult({
          score: finalScore,
          improved: improved,
          improvement: improved ? "Great job expanding on the core concepts." : "Next time, try to use a real-world analogy to make it even more relatable.",
          explained: ["Attempted to rephrase in own words", improved ? "Provided deeper context" : "Addressed basic premise"]
        });
      });
  };

  const handleRestart = () => {
    setCurrentStep('landing');
    setEducationLevel(null);
    setSelectedTopic(null);
    setActiveQuestion(null);
    setUserAnswer('');
    setUserReasoning('');
    setTeachbackAnswer('');
    setAnalysisData(null);
    setTeachbackResult(null);
  };

  const ProgressBar = () => {
    const steps = ['Level', 'Subject', 'Challenge', 'Analysis', 'TeachBack', 'Report'];
    let currentIndex = -1;
    if (currentStep === 'level') currentIndex = 0;
    if (currentStep === 'topics') currentIndex = 1;
    if (currentStep === 'challenge') currentIndex = 2;
    if (currentStep === 'analysis') currentIndex = 3;
    if (currentStep === 'teachback') currentIndex = 4;
    if (currentStep === 'report') currentIndex = 5;
    
    if (currentStep === 'landing') return null;

    return (
      <div className="w-full max-w-4xl mx-auto mb-8 px-4">
        <div className="hidden sm:flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 z-0"></div>
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%` }}
          ></div>
          
          {steps.map((step, index) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                index <= currentIndex ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-400'
              }`}>
                {index < currentIndex ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`mt-2 text-xs font-medium absolute top-10 whitespace-nowrap ${index <= currentIndex ? 'text-blue-900' : 'text-slate-400'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
        
        {/* Mobile Progress Indicator */}
        <div className="sm:hidden flex flex-col items-center justify-center w-full mt-4">
           <div className="text-sm font-bold text-blue-600 mb-2">Step {currentIndex + 1} of {steps.length}: {steps[currentIndex]}</div>
           <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
             <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}></div>
           </div>
        </div>
      </div>
    );
  };

  const Header = () => (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer group" onClick={handleRestart}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">Concept<span className="text-blue-600">Lens AI</span></span>
        </div>
        {currentStep !== 'landing' && (
             <button onClick={handleRestart} className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center transition-colors">
                <RefreshCw className="w-4 h-4 mr-1" /> Start Over
             </button>
        )}
      </div>
    </header>
  );

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-12">
      <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-8">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 shadow-sm">
          <ShieldCheck className="w-4 h-4 mr-2" /> The New Standard in EdTech
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
          See what you understand.<br/>
          <span className="text-blue-600">Discover what you’re missing.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
          ConceptLens AI doesn't just grade your answers. We analyze your reasoning to identify deep conceptual misunderstandings and guide you to clarity.
        </p>
        
        <div className="pt-4 pb-8">
            <button 
                onClick={handleStart}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-md hover:shadow-lg"
            >
                Start Investigation <ArrowRight className="ml-2 w-5 h-5" />
            </button>
        </div>

        {/* Clean features section instead of the old gradient card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8 border-t border-slate-200">
            <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-3">
                    <User className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">State Your Reasoning</h3>
                <p className="text-sm text-slate-500">Answer conceptual questions in your own words, explaining how you think.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-3">
                    <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">AI Root Cause Analysis</h3>
                <p className="text-sm text-slate-500">We analyze your text to pinpoint exact misconceptions, not just right or wrong.</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">TeachBack Method</h3>
                <p className="text-sm text-slate-500">Solidify your understanding by teaching the corrected concept back to the AI.</p>
            </div>
        </div>

      </div>
    </div>
  );

  const renderLevel = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Select Education Level</h2>
        <p className="text-slate-600">Choose your academic stage to calibrate the concepts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {EDUCATION_LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => handleSelectLevel(level.id)}
            className="group flex flex-col items-center p-8 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-200">
              {level.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{level.name}</h3>
            <p className="text-xs text-slate-500 text-center">{level.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderTopics = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Select Subject</h2>
        <p className="text-slate-600">Choose a discipline for your <span className="font-semibold text-blue-600">{EDUCATION_LEVELS.find(l => l.id === educationLevel)?.name}</span> level challenge.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleSelectTopic(topic.id)}
            className="group flex items-center p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-500 transition-all duration-200 text-left hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-5 border ${topic.color}`}>
              {topic.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{topic.name}</h3>
              <p className="text-sm text-slate-500">Open concept module</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderChallenge = () => {
    return (
      <div className="max-w-3xl mx-auto px-4 pb-12 animate-in fade-in duration-500">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8">
            <div className="flex items-center space-x-2 text-slate-500 mb-3 text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4 text-blue-600" />
              <span>{TOPICS.find(t => t.id === selectedTopic)?.name} • {EDUCATION_LEVELS.find(l => l.id === educationLevel)?.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {activeQuestion?.question}
            </h2>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
             {activeQuestion?.hint && (
                 <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
                     <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                     <p className="text-sm text-blue-800">
                        <span className="font-semibold">Hint:</span> {activeQuestion.hint}
                     </p>
                 </div>
             )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Explain your answer in your own words</label>
                <textarea
                  className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none text-slate-800"
                  placeholder="Type your explanation here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Why do you think this is correct? <span className="text-slate-400 font-normal">(Reasoning)</span></label>
                <textarea
                  className="w-full h-24 p-4 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none text-slate-800"
                  placeholder="Provide your thought process..."
                  value={userReasoning}
                  onChange={(e) => setUserReasoning(e.target.value)}
                ></textarea>
              </div>
            </div>

            <button
              onClick={handleInvestigate}
              disabled={!userAnswer.trim() || isAnalyzing}
              className={`w-full py-3.5 rounded-lg font-bold text-base transition-all flex items-center justify-center ${
                !userAnswer.trim() 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <Activity className="animate-spin w-5 h-5 mr-3" /> Analyzing Reasoning...
                </span>
              ) : (
                <span className="flex items-center">
                  <Search className="w-5 h-5 mr-2" /> Analyze My Understanding
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalysis = () => {
    if (!analysisData) return null;

    const isInsufficient = analysisData.status === 'insufficient';
    const isCorrect = analysisData.status === 'correct';

    return (
      <div className="max-w-4xl mx-auto px-4 pb-12 animate-in fade-in duration-500">
        <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Analysis Complete</h2>
            <p className="text-slate-600 mt-1">Review your conceptual clarity report.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Score Card */}
            <div className="md:col-span-1 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[250px]">
                <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" 
                            className={isCorrect ? "text-emerald-500" : isInsufficient ? "text-slate-400" : "text-blue-500"}
                            strokeDasharray={351.858}
                            strokeDashoffset={351.858 - (351.858 * analysisData.score) / 100}
                        />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <span className="text-3xl font-bold text-slate-900">{analysisData.score}%</span>
                    </div>
                </div>
                <h3 className="font-bold text-slate-800 mt-4">Conceptual Clarity</h3>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                   {isInsufficient ? "Needs More Data" : isCorrect ? "Strong Understanding" : analysisData.status === 'partial' ? "Partial Understanding" : "Misconception Found"}
                </p>
            </div>

            {/* Findings Cards */}
            <div className="md:col-span-2 space-y-4">
                
                {/* What You Understood (Only show if not insufficient) */}
                {!isInsufficient && (
                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex items-start">
                        <div className="p-2 bg-emerald-100 rounded-lg mr-4 flex-shrink-0">
                            <Brain className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                            <h3 className="font-bold text-emerald-900 mb-1 text-sm uppercase tracking-wide">What You Understood</h3>
                            <ul className="list-disc list-inside text-sm text-emerald-800 space-y-1">
                                {analysisData.understood.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Misconception Detected (Only show if misconception exists and not insufficient) */}
                {!isInsufficient && analysisData.misconception && (
                    <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 flex items-start">
                        <div className="p-2 bg-rose-100 rounded-lg mr-4 flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-rose-700" />
                        </div>
                        <div>
                            <h3 className="font-bold text-rose-900 mb-1 text-sm uppercase tracking-wide">Misconception Detected</h3>
                            <p className="text-sm text-rose-800 font-medium">"{analysisData.misconception}"</p>
                        </div>
                    </div>
                )}

                {/* Missing Concept / Guidance */}
                <div className={`${isInsufficient ? 'bg-slate-50 border-slate-200' : isCorrect ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'} rounded-xl p-5 border flex items-start h-full`}>
                    <div className={`p-2 rounded-lg mr-4 flex-shrink-0 ${isInsufficient ? 'bg-slate-200' : isCorrect ? 'bg-blue-200' : 'bg-amber-200'}`}>
                        <Lightbulb className={`w-5 h-5 ${isInsufficient ? 'text-slate-700' : isCorrect ? 'text-blue-700' : 'text-amber-700'}`} />
                    </div>
                    <div>
                        <h3 className={`font-bold mb-1 text-sm uppercase tracking-wide ${isInsufficient ? 'text-slate-900' : isCorrect ? 'text-blue-900' : 'text-amber-900'}`}>
                           {isInsufficient ? 'Status' : isCorrect ? 'Great Work' : 'Missing Concept'}
                        </h3>
                        <p className={`text-sm font-medium ${isInsufficient ? 'text-slate-700' : isCorrect ? 'text-blue-800' : 'text-amber-800'}`}>
                            {analysisData.missingConcept || "You have successfully grasped the core elements of this topic."}
                        </p>
                    </div>
                </div>

            </div>
        </div>

        {/* Aha Explanation */}
        <div className="mt-6 bg-slate-900 rounded-xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md border border-slate-800">
            <div className="relative z-10">
                <h3 className="text-lg font-bold text-blue-300 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-400" /> AI Explanation
                </h3>
                <p className="text-base leading-relaxed text-slate-100">
                    {analysisData.simpleExplanation}
                </p>
            </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {isInsufficient || isCorrect ? (
                <button 
                    onClick={() => {
                        if(isCorrect) handleRestart(); // Done with this concept
                        else setCurrentStep('challenge'); // Try answering again
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                >
                    {isCorrect ? <><RefreshCw className="mr-2 w-4 h-4" /> Try Another Concept</> : <><RefreshCw className="mr-2 w-4 h-4" /> Try Again</>}
                </button>
            ) : null}

            {(!isInsufficient && !isCorrect) && (
                <button 
                    onClick={handleStartTeachback}
                    className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Continue to TeachBack <ArrowRight className="ml-2 w-4 h-4" />
                </button>
            )}
        </div>
      </div>
    );
  };

  const renderTeachback = () => (
    <div className="max-w-3xl mx-auto px-4 pb-12 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-8 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">TeachBack Mode</h2>
            <p className="text-slate-600 text-sm">The best way to prove you understand a corrected concept is to teach it.</p>
        </div>

        <div className="p-6 sm:p-8">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 text-center mb-6">
                <h3 className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-1">Your Mission</h3>
                <p className="text-blue-800 text-sm">Explain this concept back in simple terms, incorporating what you just learned.</p>
            </div>

            <textarea
                  className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none text-slate-800"
                  placeholder="Okay, imagine it like this..."
                  value={teachbackAnswer}
                  onChange={(e) => setTeachbackAnswer(e.target.value)}
            ></textarea>

            <button
              onClick={handleEvaluateTeachback}
              disabled={isAnalyzing || !teachbackAnswer.trim()}
              className={`w-full mt-6 py-3.5 rounded-lg font-bold text-base transition-all flex items-center justify-center ${
                !teachbackAnswer.trim()
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm'
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <Activity className="animate-spin w-5 h-5 mr-3" /> Evaluating Explanation...
                </span>
              ) : (
                <span className="flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2" /> Evaluate My Explanation
                </span>
              )}
            </button>
        </div>
      </div>
    </div>
  );

  const renderReport = () => (
      <div className="max-w-3xl mx-auto px-4 pb-12 animate-in fade-in duration-500">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              
              {/* Report Header */}
              <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white relative z-10 mb-1">Final Learning Report</h2>
                  <p className="text-slate-400 relative z-10 text-sm">
                    {TOPICS.find(t => t.id === selectedTopic)?.name} • {EDUCATION_LEVELS.find(l => l.id === educationLevel)?.name}
                  </p>
              </div>

              <div className="p-6 sm:p-8">
                  {/* Progress Comparison */}
                  <div className="flex items-center justify-center space-x-6 mb-10">
                      <div className="text-center">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Initial Clarity</p>
                          <div className="w-20 h-20 rounded-full border-4 border-slate-100 flex items-center justify-center bg-white shadow-sm">
                              <span className="text-xl font-bold text-slate-700">{analysisData?.score || 0}%</span>
                          </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                          <TrendingUp className="w-6 h-6 text-emerald-500 mb-1" />
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full whitespace-nowrap">
                            +{Math.max(0, (teachbackResult?.score || 0) - (analysisData?.score || 0))}% Growth
                          </span>
                      </div>
                      
                      <div className="text-center">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Final Clarity</p>
                          <div className="w-24 h-24 rounded-full border-4 border-emerald-400 flex items-center justify-center bg-white shadow-sm relative">
                              <span className="text-2xl font-bold text-emerald-600">{teachbackResult?.score || 0}%</span>
                          </div>
                      </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> Concepts Mastered
                          </h4>
                          <ul className="space-y-2">
                              {teachbackResult?.explained.map((item, i) => (
                                  <li key={i} className="text-sm text-slate-800 flex items-start">
                                      <span className="text-emerald-500 mr-2 font-bold">•</span> {item}
                                  </li>
                              ))}
                          </ul>
                      </div>
                      
                      <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center">
                              <Target className="w-4 h-4 mr-2 text-blue-500" /> Next Focus
                          </h4>
                          <p className="text-sm text-slate-800 leading-relaxed">{teachbackResult?.improvement}</p>
                      </div>
                  </div>

                  <div className="border-t border-slate-200 pt-8 text-center">
                      <button onClick={handleRestart} className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                          Investigate Another Concept <Search className="ml-2 w-4 h-4" />
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      <Header />
      
      <main className="flex-1 py-6 sm:py-8">
        <ProgressBar />
        
        {currentStep === 'landing' && renderLanding()}
        {currentStep === 'level' && renderLevel()}
        {currentStep === 'topics' && renderTopics()}
        {currentStep === 'challenge' && renderChallenge()}
        {currentStep === 'analysis' && renderAnalysis()}
        {currentStep === 'teachback' && renderTeachback()}
        {currentStep === 'report' && renderReport()}
      </main>
    </div>
  );
};

export default ConceptLensAI;
