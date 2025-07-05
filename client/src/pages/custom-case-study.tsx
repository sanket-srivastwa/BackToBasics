import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import VoiceInput from "@/components/voice-input";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Send, 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles,
  MessageSquare,
  TrendingUp,
  PenTool,
  Bot,
  RefreshCw,
  ChevronRight,
  Clock,
  Mic,
  Keyboard,
  Brain,
  Building,
  Users,
  Target,
  FileText,
  BarChart3,
  DollarSign,
  CalendarDays
} from "lucide-react";

interface AnalysisResult {
  optimalAnswer: string;
  userScore: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  detailedFeedback: string;
}

interface CaseStudy {
  title: string;
  company: string;
  industry: string;
  companySize: string;
  challenge: string;
  detailedChallenge: string;
  stakeholders: string[];
  constraints: string[];
  objectives: string[];
  timeframe: string;
}

type StepType = 'mode' | 'configure' | 'question' | 'answer' | 'feedback';

const STEPS = [
  { id: 'mode', label: 'Choose Mode', title: 'Select Case Study Mode' },
  { id: 'configure', label: 'Configure', title: 'Configure Settings' },
  { id: 'question', label: 'Question', title: 'Review Question' },
  { id: 'answer', label: 'Answer', title: 'Provide Solution' },
  { id: 'feedback', label: 'Feedback', title: 'Review Results' }
] as const;

export default function CustomCaseStudy() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Technical Program Management");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [step, setStep] = useState<StepType>("mode");
  const [mode, setMode] = useState<"custom" | "prompted" | "ai-generated">("custom");
  const [promptedQuestions, setPromptedQuestions] = useState<any[]>([]);
  const [selectedPrompted, setSelectedPrompted] = useState<any>(null);
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Stepper navigation helpers - Track completed steps
  const [completedSteps, setCompletedSteps] = useState<StepType[]>(['mode']);
  
  const getCurrentStepIndex = () => STEPS.findIndex(s => s.id === step);
  
  const markStepAsCompleted = (stepId: StepType) => {
    setCompletedSteps(prev => {
      if (!prev.includes(stepId)) {
        return [...prev, stepId];
      }
      return prev;
    });
  };
  
  const isStepCompleted = (stepId: StepType) => completedSteps.includes(stepId);
  
  const canNavigateToStep = (targetStep: StepType) => {
    return completedSteps.includes(targetStep) || targetStep === step;
  };

  // Stepper Component
  const StepperNavigation = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((stepItem, index) => {
            const isActive = step === stepItem.id;
            const isCompleted = isStepCompleted(stepItem.id) && !isActive;
            const isAccessible = canNavigateToStep(stepItem.id);
            
            const handleStepClick = () => {
              if (isAccessible && stepItem.id !== step) {
                console.log(`Navigating to step: ${stepItem.id} (index ${index})`);
                setStep(stepItem.id);
              }
            };
            
            return (
              <div key={stepItem.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleStepClick}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : isCompleted 
                        ? 'bg-green-600 text-white cursor-pointer hover:bg-green-700 hover:shadow-lg' 
                        : isAccessible
                        ? 'bg-gray-300 text-gray-700 cursor-pointer hover:bg-gray-400'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
                  </button>
                  <span className={`mt-2 text-xs text-center max-w-16 ${isActive ? 'font-medium text-blue-600' : isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {stepItem.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 w-16 mx-2 transition-colors ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Current: {step} | Completed: {completedSteps.join(', ')}
        </div>
      </div>
    );
  };

  // Handle URL parameter to auto-trigger AI case study mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modeParam = urlParams.get('mode');
    if (modeParam === 'ai-generated') {
      setMode('ai-generated');
      setStep('configure');
      markStepAsCompleted('mode');
    }
  }, []);

  const topics = [
    "Technical Program Management",
    "Product Management", 
    "Project Management",
    "Engineering Management",
    "Data Science Leadership",
    "Product Strategy",
    "Customer Experience",
    "Growth Strategy",
    "Operations Management",
    "Business Analytics",
    "Market Research",
    "Digital Transformation"
  ];

  const difficultyLevels = [
    { id: "easy", name: "Easy", description: "Entry-level scenarios with clear structure" },
    { id: "medium", name: "Medium", description: "Complex business challenges requiring strategic thinking" },
    { id: "hard", name: "Hard", description: "Executive-level decisions with multiple stakeholders" }
  ];

  const topicMapping: { [key: string]: string } = {
    "Technical Program Management": "Technical Program Management",
    "Product Management": "Product Management",
    "Project Management": "Project Management", 
    "Engineering Management": "Engineering Management",
    "Data Science Leadership": "Data Science Leadership"
  };

  const experienceLevels = [
    { id: "junior", name: "Junior (0-2 years)", description: "Entry-level questions focusing on fundamentals" },
    { id: "mid", name: "Mid-level (2-5 years)", description: "Intermediate scenarios requiring strategic thinking" },
    { id: "senior", name: "Senior (5+ years)", description: "Complex leadership and technical challenges" }
  ];

  // Generate fresh AI questions every time the button is clicked
  const loadPromptedQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      console.log(`Generating fresh questions for topic: ${selectedTopic}, experience: ${experienceLevel}`);
      
      // Add timestamp to force fresh generation and avoid caching
      const timestamp = Date.now();
      const response = await fetch(`/api/prompted-questions?topic=${encodeURIComponent(selectedTopic)}&experienceLevel=${experienceLevel}&timestamp=${timestamp}&forceGenerate=true`);
      
      if (response.ok) {
        const questions = await response.json();
        console.log('Generated fresh questions:', questions);
        setPromptedQuestions(questions);
        
        if (questions.length === 0) {
          toast({
            title: "Generation failed",
            description: "Unable to generate questions. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Fresh questions generated!",
            description: `Generated ${questions.length} new AI-powered questions tailored to your selection.`,
          });
        }
      } else {
        const errorData = await response.json();
        console.error('Error generating questions:', errorData);
        toast({
          title: "Generation failed",
          description: errorData.error || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to generate prompted questions:", error);
      toast({
        title: "Connection error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const validateQuestionMutation = useMutation({
    mutationFn: async (questionText: string) => {
      const response = await fetch("/api/questions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionText }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to validate question");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.isValid) {
        markStepAsCompleted('question');
        setStep("answer");
        toast({
          title: "Great question!",
          description: data.feedback || "Your question looks good for interview practice.",
        });
      } else {
        toast({
          title: "Question needs improvement",
          description: data.feedback || "Please refine your question.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to validate question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const analyzeAnswerMutation = useMutation({
    mutationFn: async ({ question: q, userAnswer: answer, topic }: { question: string; userAnswer: string; topic: string }) => {
      const response = await fetch("/api/answers/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          userAnswer: answer,
          topic: topic,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to analyze answer");
      }
      
      return response.json();
    },
    onSuccess: (data: AnalysisResult) => {
      setAnalysis(data);
      setStep("feedback");
      toast({
        title: "Analysis complete!",
        description: "Your answer has been analyzed and compared with the optimal response.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleQuestionSubmit = () => {
    if (!question.trim() || question.trim().length < 10) {
      toast({
        title: "Question too short",
        description: "Please write a question that's at least 10 characters long.",
        variant: "destructive",
      });
      return;
    }

    validateQuestionMutation.mutate(question.trim());
  };

  const handleAnswerSubmit = () => {
    if (!userAnswer.trim() || userAnswer.trim().length < 50) {
      toast({
        title: "Answer too short",
        description: "Please write a more detailed answer (at least 50 characters).",
        variant: "destructive",
      });
      return;
    }

    // Use case study evaluation for AI-generated cases, regular analysis for others
    if (mode === "ai-generated" && caseStudy) {
      evaluateCaseStudyMutation.mutate(userAnswer.trim());
    } else {
      analyzeAnswerMutation.mutate({
        question: question.trim(),
        userAnswer: userAnswer.trim(),
        topic: selectedTopic,
      });
    }
  };

  const handleStartOver = () => {
    setQuestion("");
    setUserAnswer("");
    setAnalysis(null);
    setSelectedPrompted(null);
    setCaseStudy(null);
    setMode("custom");
    setStep("mode");
  };

  const handleBackToModeSelection = () => {
    // Clear any existing state for clean navigation
    setQuestion("");
    setUserAnswer("");
    setAnalysis(null);
    setSelectedPrompted(null);
    setPromptedQuestions([]);
    setCaseStudy(null);
    setIsLoadingQuestions(false);
    // Reset to default values
    setSelectedTopic("Technical Program Management");
    setExperienceLevel("mid");
    setDifficulty("medium");
    setMode("custom");
    setStep("mode");
  };

  // Generate AI case study mutation with enhanced PM Solutions format (always fresh)
  const generateCaseStudyMutation = useMutation({
    mutationFn: async () => {
      // Add timestamp to ensure fresh generation every time
      const timestamp = Date.now();
      const response = await fetch("/api/case-studies/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty: difficulty,
          timestamp: timestamp,
          forceGenerate: true
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data: CaseStudy) => {
      setCaseStudy(data);
      markStepAsCompleted('question');
      setStep("answer");
      toast({
        title: "Fresh case study generated!",
        description: "Review the AI-generated case study details and provide your strategic solution.",
      });
    },
    onError: (error: Error) => {
      console.error("Case study generation error:", error);
      if (error.message.includes("quota exceeded")) {
        toast({
          title: "Service Temporarily Unavailable",
          description: "AI service is currently at capacity. Please try again in a few minutes.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation failed",
          description: "Unable to generate case study. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Evaluate case study response mutation with enhanced analysis
  const evaluateCaseStudyMutation = useMutation({
    mutationFn: async (answer: string) => {
      if (!answer.trim()) {
        throw new Error("Please provide an answer before submitting");
      }
      
      const response = await fetch("/api/case-studies/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          caseStudy, 
          userAnswer: answer 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data: AnalysisResult) => {
      setAnalysis(data);
      setStep("feedback");
      toast({
        title: "Evaluation complete!",
        description: "Your case study response has been thoroughly analyzed with detailed feedback.",
      });
    },
    onError: (error: Error) => {
      console.error("Case study evaluation error:", error);
      toast({
        title: "Evaluation failed",
        description: error.message.includes("quota") ? "OpenAI quota exceeded. Using demo evaluation for testing." : error.message,
        variant: "destructive",
      });
    },
  });

  const handleModeSelect = (selectedMode: "custom" | "prompted" | "ai-generated") => {
    setMode(selectedMode);
    if (selectedMode === "prompted") {
      loadPromptedQuestions();
      setStep("question");
    } else if (selectedMode === "ai-generated") {
      generateCaseStudyMutation.mutate();
    } else {
      setStep("question");
    }
  };

  const handlePromptedQuestionSelect = (promptedQuestion: any) => {
    setSelectedPrompted(promptedQuestion);
    setQuestion(promptedQuestion.questionPrompt);
    markStepAsCompleted('question');
    setStep("answer");
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreProgress = (score: number) => {
    return (score / 10) * 100;
  };

  const wordCount = userAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-4">
            AI-Powered Custom Case Study
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Create your own interview question and get AI-powered feedback on your answer
          </p>
        </div>

        <StepperNavigation />

        {/* Step 1: Mode Selection */}
        {step === "mode" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Case Study Mode</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div 
                  className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() => handleModeSelect("custom")}
                >
                  <div className="flex items-center mb-4">
                    <PenTool className="w-8 h-8 text-primary mr-3" />
                    <h3 className="text-xl font-semibold">Custom Question</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Write your own case study question and get AI-powered feedback on your answer.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Create personalized scenarios</li>
                    <li>• Focus on specific challenges</li>
                    <li>• Tailored to your needs</li>
                  </ul>
                </div>

                <div 
                  className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() => {
                    markStepAsCompleted('mode');
                    setStep("configure");
                  }}
                >
                  <div className="flex items-center mb-4">
                    <Brain className="w-8 h-8 text-primary mr-3" />
                    <h3 className="text-xl font-semibold">AI Case Study</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Get a professionally structured case study following PM Solutions format with company context and challenges.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Realistic business scenarios</li>
                    <li>• Professional format</li>
                    <li>• Company & stakeholder details</li>
                  </ul>
                </div>

                <div 
                  className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() => handleModeSelect("prompted")}
                >
                  <div className="flex items-center mb-4">
                    <Bot className="w-8 h-8 text-primary mr-3" />
                    <h3 className="text-xl font-semibold">AI-Generated Question</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Choose from AI-generated questions based on your experience level and topic.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Experience-level appropriate</li>
                    <li>• Topic-specific scenarios</li>
                    <li>• Industry-standard questions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: AI Configuration */}
        {step === "configure" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Configure Your AI Case Study</h2>
              
              <div className="space-y-8">
                {/* Topic Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Brain className="w-5 h-5 text-primary mr-2" />
                    Select Topic
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {topics.map((topic) => (
                      <div
                        key={topic}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedTopic === topic
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 hover:border-primary hover:bg-primary/5"
                        }`}
                        onClick={() => setSelectedTopic(topic)}
                      >
                        <h4 className="font-medium text-sm">{topic}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 text-orange-600 mr-2" />
                    Select Difficulty Level
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {difficultyLevels.map((level) => (
                      <div
                        key={level.id}
                        className={`border-2 rounded-lg p-6 cursor-pointer transition-colors ${
                          difficulty === level.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary hover:bg-primary/5"
                        }`}
                        onClick={() => setDifficulty(level.id)}
                      >
                        <div className="flex items-center mb-3">
                          <div className={`w-4 h-4 rounded-full mr-3 ${
                            level.id === "easy" ? "bg-green-500" :
                            level.id === "medium" ? "bg-yellow-500" : "bg-red-500"
                          }`}></div>
                          <h4 className="font-semibold text-lg">{level.name}</h4>
                        </div>
                        <p className="text-gray-600 text-sm">{level.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-lg">
                  <div className="flex items-center mb-2">
                    <Sparkles className="h-5 w-5 text-primary mr-2" />
                    <h4 className="font-semibold text-primary">What You'll Get:</h4>
                  </div>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• Professional case study following PM Solutions format</li>
                    <li>• Detailed company context and stakeholder analysis</li>
                    <li>• Clear constraints and success objectives</li>
                    <li>• AI-powered evaluation with actionable feedback</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("mode")}
                    className="flex-1"
                  >
                    Back to Mode Selection
                  </Button>
                  <Button
                    onClick={() => {
                      markStepAsCompleted('configure');
                      setMode("ai-generated");
                      generateCaseStudyMutation.mutate();
                    }}
                    disabled={generateCaseStudyMutation.isPending}
                    className="flex-1"
                  >
                    {generateCaseStudyMutation.isPending ? (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    ) : (
                      <Brain className="mr-2 h-4 w-4" />
                    )}
                    Generate Fresh Case Study
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Custom Question Input */}
        {step === "question" && mode === "custom" && (
          <Card className="shadow-lg border max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Create Your Interview Question</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Write a thoughtful interview question related to your chosen topic
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Select Topic
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant={selectedTopic === topic ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 ${
                          selectedTopic === topic ? "bg-primary text-white" : "hover:bg-primary/10"
                        }`}
                        onClick={() => setSelectedTopic(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Your Interview Question
                  </label>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Example: 'Describe a time when you had to lead a cross-functional team through a major technical migration while managing competing stakeholder priorities...'"
                    className="min-h-32"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-neutral-500">
                      {question.length} characters (minimum 10)
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-primary p-4">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="h-5 w-5 text-primary mr-2" />
                    <h4 className="font-semibold text-primary">Tips for Great Questions:</h4>
                  </div>
                  <ul className="text-neutral-700 space-y-1 text-sm">
                    <li>• Make it specific to a real-world scenario</li>
                    <li>• Include context about challenges or constraints</li>
                    <li>• Ask for specific examples and outcomes</li>
                    <li>• Focus on leadership, problem-solving, or strategic thinking</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleBackToModeSelection}
                    className="flex-1"
                  >
                    Back to Mode Selection
                  </Button>
                  <Button
                    onClick={handleQuestionSubmit}
                    disabled={validateQuestionMutation.isPending || question.trim().length < 10}
                    className="flex-1"
                    size="lg"
                  >
                    {validateQuestionMutation.isPending ? (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Validate & Continue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Prompted Questions Selection */}
        {step === "question" && mode === "prompted" && (
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Choose AI-Generated Question</CardTitle>
                    <CardDescription className="text-base mt-2">
                      Select from questions tailored to your experience level and topic
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Select Topic
                      </label>
                      <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {topics.map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Experience Level
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {experienceLevels.map(level => (
                          <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={handleBackToModeSelection}
                      className="flex-1"
                    >
                      Back to Mode Selection
                    </Button>
                    <Button
                      onClick={loadPromptedQuestions}
                      disabled={isLoadingQuestions}
                      className="flex-1"
                      size="lg"
                    >
                      {isLoadingQuestions ? (
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      {isLoadingQuestions ? "Generating Fresh Questions..." : "Generate New Questions"}
                    </Button>
                  </div>

                  {promptedQuestions.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Available Questions:</h3>
                      <div className="grid gap-4">
                        {promptedQuestions.map((promptedQuestion, index) => (
                          <div
                            key={promptedQuestion.id}
                            className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                            onClick={() => handlePromptedQuestionSelect(promptedQuestion)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-2">Question {index + 1}</h4>
                                <p className="text-gray-700 mb-3">{promptedQuestion.questionPrompt}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {promptedQuestion.timeLimit} mins
                                  </span>
                                  <span className="flex items-center">
                                    <Target className="w-4 h-4 mr-1" />
                                    {promptedQuestion.difficulty}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {promptedQuestions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No questions available for this combination. Try a different topic or experience level.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Answer Input */}
        {step === "answer" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Display generated case study in PM Solutions format */}
            {caseStudy && mode === "ai-generated" && (
              <Card className="shadow-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold">{caseStudy.title}</CardTitle>
                      <CardDescription className="text-blue-100 text-lg mt-2">
                        {caseStudy.company} • {caseStudy.industry}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-white text-blue-600">
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Company Overview */}
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center mb-3">
                          <Building className="h-5 w-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">Company Context</h3>
                        </div>
                        <div className="bg-white rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Industry:</span>
                            <span className="text-sm text-gray-800">{caseStudy.industry}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Company Size:</span>
                            <span className="text-sm text-gray-800">{caseStudy.companySize}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-600">Timeline:</span>
                            <span className="text-sm text-gray-800">{caseStudy.timeframe}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stakeholders */}
                      <div>
                        <div className="flex items-center mb-3">
                          <Users className="h-5 w-5 text-green-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">Key Stakeholders</h3>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <ul className="space-y-2">
                            {caseStudy.stakeholders.map((stakeholder, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-700">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                {stakeholder}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Challenge & Constraints */}
                    <div className="space-y-6">
                      {/* Business Challenge */}
                      <div>
                        <div className="flex items-center mb-3">
                          <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">The Challenge</h3>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-gray-700 text-sm leading-relaxed">{caseStudy.detailedChallenge}</p>
                        </div>
                      </div>

                      {/* Constraints */}
                      <div>
                        <div className="flex items-center mb-3">
                          <DollarSign className="h-5 w-5 text-red-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">Constraints</h3>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <ul className="space-y-2">
                            {caseStudy.constraints.map((constraint, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-700">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                                {constraint}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Objectives */}
                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <Target className="h-5 w-5 text-purple-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Success Objectives</h3>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {caseStudy.objectives.map((objective, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                            {objective}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Your Task:</strong> Analyze this situation and provide a comprehensive solution that addresses the challenge while considering all stakeholders, constraints, and objectives. Structure your response with clear reasoning and actionable recommendations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Regular question display for custom and prompted modes */}
            {(!caseStudy || mode !== "ai-generated") && (
              <Card className="shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-lg">Your Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 whitespace-pre-wrap">{question}</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <Badge variant="secondary">{selectedTopic}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep("question")}
                    >
                      Edit Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg border">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="bg-accent/10 p-3 rounded-lg mr-4">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Your Answer</CardTitle>
                    <CardDescription className="text-base mt-2">
                      Provide a detailed response using the STAR method
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Write Your Response
                    </label>
                    
                    <Tabs defaultValue="typing" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="typing" className="flex items-center gap-2">
                          <Keyboard className="h-4 w-4" />
                          Type Answer
                        </TabsTrigger>
                        <TabsTrigger value="voice" className="flex items-center gap-2">
                          <Mic className="h-4 w-4" />
                          Speak Answer
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="typing" className="mt-4">
                        <Textarea
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Structure your answer using STAR method:
Situation: Set the context...
Task: Describe your responsibility...
Action: Explain what you did...
Result: Share the outcome and impact..."
                          className="min-h-64"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-neutral-500">
                            Word count: {wordCount} (aim for 200-400 words)
                          </span>
                          <span className="text-sm text-neutral-500">
                            Minimum 50 characters
                          </span>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="voice" className="mt-4">
                        <VoiceInput
                          onTranscription={(text) => setUserAnswer(prev => prev + " " + text)}
                          disabled={analyzeAnswerMutation.isPending}
                        />
                        {userAnswer && (
                          <div className="mt-4">
                            <div className="text-sm text-neutral-600 mb-2">Your transcribed answer:</div>
                            <div className="bg-gray-50 p-4 rounded-lg border text-sm max-h-40 overflow-y-auto">
                              {userAnswer}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-neutral-500">
                                Word count: {wordCount} (aim for 200-400 words)
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setUserAnswer("")}
                              >
                                Clear Answer
                              </Button>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-semibold text-green-700">STAR Method Reminder:</h4>
                    </div>
                    <ul className="text-green-700 space-y-1 text-sm">
                      <li><strong>Situation:</strong> Set the scene and context</li>
                      <li><strong>Task:</strong> Describe your specific responsibility</li>
                      <li><strong>Action:</strong> Explain the steps you took</li>
                      <li><strong>Result:</strong> Share the measurable outcome</li>
                    </ul>
                  </div>

                  <Button
                    onClick={() => {
                      markStepAsCompleted('answer');
                      handleAnswerSubmit();
                    }}
                    disabled={(analyzeAnswerMutation.isPending || evaluateCaseStudyMutation.isPending) || userAnswer.trim().length < 50}
                    className="w-full"
                    size="lg"
                  >
                    {(analyzeAnswerMutation.isPending || evaluateCaseStudyMutation.isPending) ? (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {mode === "ai-generated" && caseStudy ? "Evaluate Case Study Response" : "Analyze My Answer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Feedback */}
        {step === "feedback" && analysis && (
          <div className="space-y-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(analysis.userScore)} mb-2`}>
                {analysis.userScore}/10
              </div>
              <Progress value={getScoreProgress(analysis.userScore)} className="h-3 max-w-xs mx-auto" />
              <p className="text-neutral-600 mt-2">Overall Score</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Your Answer */}
              <Card className="shadow-sm border">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-neutral-800">Your Answer</h3>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
                      <span className={`text-sm font-medium ${getScoreColor(analysis.userScore)}`}>
                        Score: {analysis.userScore}/10
                      </span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none text-neutral-700">
                    <p className="whitespace-pre-wrap">{userAnswer}</p>
                  </div>
                </CardContent>
              </Card>

              {/* AI Optimal Answer */}
              <Card className="shadow-sm border">
                <div className="bg-green-50 px-6 py-4 border-b border-green-200">
                  <h3 className="text-lg font-semibold text-neutral-800">AI-Generated Optimal Answer</h3>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-green-600">Reference Standard</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none text-neutral-700">
                    <div className="whitespace-pre-wrap">{analysis.optimalAnswer}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Feedback */}
            <Card className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-xl">Detailed AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Strengths */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-neutral-800 mb-2">Strengths</h4>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index}>• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Areas to Improve */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold text-neutral-800 mb-2">Areas to Improve</h4>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      {analysis.improvements.map((improvement, index) => (
                        <li key={index}>• {improvement}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Suggestions */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lightbulb className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-neutral-800 mb-2">Suggestions</h4>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-lg">
                  <h4 className="font-semibold text-primary mb-3 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Detailed Analysis:
                  </h4>
                  <p className="text-neutral-700 whitespace-pre-wrap">
                    {analysis.detailedFeedback}
                  </p>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleStartOver}
                  >
                    Try New Question
                  </Button>
                  {mode === "ai-generated" && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setCaseStudy(null);
                        setUserAnswer("");
                        setAnalysis(null);
                        setStep("configure");
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      New Case Study
                    </Button>
                  )}
                  <Button
                    className="flex-1"
                    onClick={() => setLocation("/practice")}
                  >
                    Practice More Questions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}