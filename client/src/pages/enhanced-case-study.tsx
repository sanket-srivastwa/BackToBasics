import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import VoiceInput from "@/components/voice-input";
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
  Target
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
  { id: 'question', label: 'Question', title: 'Review Case Study' },
  { id: 'answer', label: 'Answer', title: 'Provide Solution' },
  { id: 'feedback', label: 'Feedback', title: 'Review Results' }
] as const;

export default function EnhancedCaseStudy() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<StepType>('mode');
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [voiceAnswer, setVoiceAnswer] = useState("");
  const [answerMethod, setAnswerMethod] = useState<'type' | 'voice'>('type');
  
  // Configuration state
  const [selectedTopic, setSelectedTopic] = useState("Product Strategy");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");

  // Generate case study mutation
  const generateCaseStudyMutation = useMutation({
    mutationFn: async ({ topic, difficulty }: { topic: string; difficulty: string }) => {
      const response = await fetch("/api/case-studies/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, difficulty }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data: CaseStudy) => {
      setCaseStudy(data);
      setCurrentStep('question');
      toast({
        title: "Case Study Generated",
        description: "Your custom case study is ready. Review the details and provide your solution.",
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
          title: "Generation Failed",
          description: error.message || "Failed to generate case study. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  // Evaluate answer mutation
  const evaluateAnswerMutation = useMutation({
    mutationFn: async () => {
      const finalAnswer = answerMethod === 'voice' ? voiceAnswer : userAnswer;
      const response = await fetch("/api/case-studies/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          caseStudy, 
          userAnswer: finalAnswer 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data: AnalysisResult) => {
      setAnalysisResult(data);
      setCurrentStep('feedback');
      toast({
        title: "Analysis Complete",
        description: `Your solution scored ${data.userScore}/100. Review detailed feedback below.`,
      });
    },
    onError: (error: Error) => {
      console.error("Answer evaluation error:", error);
      if (error.message.includes("quota exceeded")) {
        toast({
          title: "Service Temporarily Unavailable",
          description: "AI evaluation service is currently at capacity. Please try again in a few minutes.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Evaluation Failed",
          description: error.message || "Failed to evaluate your answer. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const handleGenerateCaseStudy = (topic: string, difficulty: string = "medium") => {
    generateCaseStudyMutation.mutate({ topic, difficulty });
  };

  const handleSubmitAnswer = () => {
    evaluateAnswerMutation.mutate();
  };

  const handleStartNew = () => {
    setCaseStudy(null);
    setUserAnswer("");
    setVoiceAnswer("");
    setAnalysisResult(null);
    setCurrentStep('mode');
  };

  // Stepper navigation helpers
  const getCurrentStepIndex = () => STEPS.findIndex(step => step.id === currentStep);
  const getMaxCompletedStepIndex = () => {
    // Determine the maximum step index the user has reached
    if (analysisResult) return 4; // Feedback step (index 4)
    if (caseStudy && userAnswer.length > 0) return 3; // Answer step (index 3)
    if (caseStudy) return 2; // Question step (index 2)
    if (selectedTopic && selectedDifficulty) return 1; // Configure step (index 1)
    return 0; // Mode step (index 0)
  };
  
  const canNavigateToStep = (targetStep: StepType) => {
    const targetIndex = STEPS.findIndex(step => step.id === targetStep);
    const maxCompletedIndex = getMaxCompletedStepIndex();
    return targetIndex <= maxCompletedIndex; // Allow navigation to any completed step
  };

  const navigateToStep = (targetStep: StepType) => {
    if (canNavigateToStep(targetStep)) {
      setCurrentStep(targetStep);
    }
  };

  // Stepper Component
  const StepperNavigation = () => {
    const maxCompletedIndex = getMaxCompletedStepIndex();
    const currentIndex = getCurrentStepIndex();
    
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = index < currentIndex; // Previous steps are completed
            const isAccessible = index <= maxCompletedIndex; // Can access any step up to max completed
            
            const handleStepClick = () => {
              if (isAccessible) {
                console.log(`Navigating to step: ${step.id} (index ${index})`);
                setCurrentStep(step.id);
              }
            };
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleStepClick}
                    disabled={!isAccessible}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : isCompleted 
                        ? 'bg-green-600 text-white cursor-pointer hover:bg-green-700 shadow-md' 
                        : isAccessible
                        ? 'bg-gray-300 text-gray-700 cursor-pointer hover:bg-gray-400'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
                  </button>
                  <span className={`mt-2 text-xs text-center max-w-16 ${isActive ? 'font-medium text-blue-600' : isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {step.label}
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
          Current: {currentStep} (Index: {currentIndex}) | Max Completed: {maxCompletedIndex}
        </div>
      </div>
    );
  };

  // Step 1: Choose Mode
  if (currentStep === 'mode') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Enhanced AI Case Study
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate comprehensive business case studies with detailed company context, 
              stakeholder analysis, and AI-powered evaluation following PM Solutions format.
            </p>
          </div>

          <StepperNavigation />

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-blue-600" />
                Select Case Study Mode
              </CardTitle>
              <CardDescription>
                Choose how you'd like to approach your case study practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer border-2 hover:border-blue-500 transition-colors" onClick={() => setCurrentStep('configure')}>
                  <CardContent className="p-6 text-center">
                    <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">AI-Generated Case Study</h3>
                    <p className="text-gray-600 text-sm">
                      Let AI create a comprehensive case study with realistic company scenarios, stakeholders, and constraints
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer border-2 hover:border-purple-500 transition-colors opacity-60">
                  <CardContent className="p-6 text-center">
                    <PenTool className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Custom Case Study</h3>
                    <p className="text-gray-600 text-sm">
                      Upload your own case study or work with provided templates
                    </p>
                    <Badge variant="outline" className="mt-2">Coming Soon</Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Step 2: Configure Settings
  if (currentStep === 'configure') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Configure Your Case Study
            </h1>
            <p className="text-xl text-gray-600">
              Customize the topic and difficulty level for your AI-generated case study
            </p>
          </div>

          <StepperNavigation />

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-blue-600" />
                Configure Case Study Settings
              </CardTitle>
              <CardDescription>
                Select your preferred topic and difficulty level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Select Topic</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { topic: "Product Strategy", description: "Market expansion & positioning" },
                      { topic: "Operations Optimization", description: "Process improvement & efficiency" },
                      { topic: "Digital Transformation", description: "Technology adoption & change management" },
                      { topic: "Growth & Scaling", description: "Business expansion strategies" }
                    ].map(({ topic, description }) => (
                      <Button
                        key={topic}
                        variant={selectedTopic === topic ? "default" : "outline"}
                        onClick={() => setSelectedTopic(topic)}
                        className="h-auto py-3 px-4 text-left justify-start"
                      >
                        <div>
                          <div className="font-medium">{topic}</div>
                          <div className="text-xs text-gray-500">{description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Difficulty Level</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { level: "easy", label: "Easy", description: "Entry-level challenges" },
                      { level: "medium", label: "Medium", description: "Mid-level complexity" },
                      { level: "hard", label: "Hard", description: "Senior-level challenges" }
                    ].map(({ level, label, description }) => (
                      <Button
                        key={level}
                        variant={selectedDifficulty === level ? "default" : "outline"}
                        onClick={() => setSelectedDifficulty(level)}
                        className="h-auto py-3 px-4 text-left justify-start"
                      >
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-xs text-gray-500">{description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleGenerateCaseStudy(selectedTopic, selectedDifficulty)}
                  disabled={generateCaseStudyMutation.isPending}
                  size="lg"
                >
                  {generateCaseStudyMutation.isPending ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Case Study
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Step 3: Review Generated Case Study
  if (currentStep === 'question') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Review Your Case Study
            </h1>
            <p className="text-xl text-gray-600">
              Study the details and context before providing your solution
            </p>
          </div>

          <StepperNavigation />

          {caseStudy && (
            <div className="space-y-6 mb-8">
              {/* Company Information */}
              <Card className="shadow-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-xl">
                        <Building className="mr-2 h-6 w-6" />
                        {caseStudy.company}
                      </CardTitle>
                      <p className="text-blue-100 mt-1">{caseStudy.industry} • {caseStudy.companySize}</p>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {caseStudy.title}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Challenge Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                    Challenge Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{caseStudy.challenge}</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Detailed Context:</h4>
                    <p className="text-gray-700">{caseStudy.detailedChallenge}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-blue-500" />
                      Key Stakeholders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {caseStudy.stakeholders.map((stakeholder, index) => (
                        <li key={index} className="flex items-center">
                          <ChevronRight className="mr-2 h-4 w-4 text-blue-500" />
                          {stakeholder}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-5 w-5 text-green-500" />
                      Objectives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {caseStudy.objectives.map((objective, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-purple-500" />
                    Constraints & Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Constraints:</h4>
                      <ul className="space-y-1">
                        {caseStudy.constraints.map((constraint, index) => (
                          <li key={index} className="text-gray-700">• {constraint}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Timeframe:</h4>
                      <p className="text-gray-700">{caseStudy.timeframe}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setCurrentStep('answer')} 
                  size="lg"
                >
                  Begin Solution
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // Step 4: Provide Answer
  if (currentStep === 'answer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Provide Your Solution
            </h1>
            <p className="text-xl text-gray-600">
              Think through the problem and provide your comprehensive solution
            </p>
          </div>

          <StepperNavigation />

          {/* Case Study Summary */}
          {caseStudy && (
            <Card className="mb-6 border-blue-200 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">{caseStudy.company} - {caseStudy.title}</h3>
                    <p className="text-sm text-blue-700">{caseStudy.challenge}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setCurrentStep('question')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Review Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Answer Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenTool className="mr-2 h-5 w-5 text-blue-600" />
                  Your Solution
                </CardTitle>
                <CardDescription>
                  Provide a comprehensive solution to this business challenge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={answerMethod} onValueChange={(value) => setAnswerMethod(value as 'type' | 'voice')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="type" className="flex items-center">
                      <Keyboard className="mr-2 h-4 w-4" />
                      Type
                    </TabsTrigger>
                    <TabsTrigger value="voice" className="flex items-center">
                      <Mic className="mr-2 h-4 w-4" />
                      Voice
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="type" className="space-y-4">
                    <Textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Provide your comprehensive solution to this case study. Consider the stakeholders, constraints, objectives, and timeline..."
                      className="min-h-64 resize-none"
                    />
                    <div className="text-right text-sm text-gray-500">
                      {userAnswer.length} characters (minimum 100 recommended)
                    </div>
                  </TabsContent>

                  <TabsContent value="voice" className="space-y-4">
                    <VoiceInput
                      onTranscription={(transcript: string) => {
                        setVoiceAnswer(transcript);
                        setUserAnswer(transcript);
                      }}
                    />
                    {voiceAnswer && (
                      <div className="text-right text-sm text-gray-500">
                        {voiceAnswer.length} characters transcribed
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-semibold text-yellow-800">Solution Structure Tips:</h4>
                  </div>
                  <ul className="text-yellow-700 space-y-1 text-sm">
                    <li>• Start with situation assessment and problem analysis</li>
                    <li>• Identify key stakeholders and their concerns</li>
                    <li>• Propose specific solutions with clear implementation steps</li>
                    <li>• Address constraints and potential risks</li>
                    <li>• Define success metrics and expected outcomes</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={evaluateAnswerMutation.isPending || userAnswer.trim().length < 10}
                    size="lg"
                  >
                    {evaluateAnswerMutation.isPending ? (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Submit Solution
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Step 5: Review Feedback
  if (currentStep === 'feedback') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Review Your Results
            </h1>
            <p className="text-xl text-gray-600">
              Detailed feedback and evaluation of your solution
            </p>
          </div>

          <StepperNavigation />

          {analysisResult && (
            <div className="space-y-6">
              {/* Score Overview */}
              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-green-800">Overall Score</h3>
                      <p className="text-green-600">Your solution evaluation</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-green-800">{analysisResult.userScore}/100</div>
                      <Progress value={analysisResult.userScore} className="w-32 mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-600">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-600">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="mr-2 h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Optimal Solution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-600">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Optimal Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{analysisResult.optimalAnswer}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-600">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Next Steps & Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <ChevronRight className="mr-2 h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Detailed Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-600">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Detailed Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{analysisResult.detailedFeedback}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleStartNew}
                  size="lg"
                >
                  Try Another Case Study
                </Button>
                <Button 
                  onClick={() => setLocation("/")}
                  size="lg"
                >
                  Return to Home
                </Button>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  return null;
}