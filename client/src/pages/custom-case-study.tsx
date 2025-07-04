import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { 
  ArrowLeft, 
  Send, 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  Target,
  Sparkles,
  MessageSquare,
  TrendingUp,
  PenTool,
  Bot,
  RefreshCw,
  ChevronRight,
  Clock
} from "lucide-react";

interface AnalysisResult {
  optimalAnswer: string;
  userScore: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  detailedFeedback: string;
}

export default function CustomCaseStudy() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Technical Program Management");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [step, setStep] = useState<"mode" | "question" | "answer" | "feedback">("mode");
  const [mode, setMode] = useState<"custom" | "prompted">("custom");
  const [promptedQuestions, setPromptedQuestions] = useState<any[]>([]);
  const [selectedPrompted, setSelectedPrompted] = useState<any>(null);
  const [experienceLevel, setExperienceLevel] = useState("mid");

  const topics = [
    "Technical Program Management",
    "Product Management",
    "Project Management",
    "Engineering Management",
    "Data Science Leadership"
  ];

  const experienceLevels = [
    { id: "junior", name: "Junior (0-2 years)", description: "Entry-level questions focusing on fundamentals" },
    { id: "mid", name: "Mid-level (2-5 years)", description: "Intermediate scenarios requiring strategic thinking" },
    { id: "senior", name: "Senior (5+ years)", description: "Complex leadership and technical challenges" }
  ];

  // Load prompted questions when topic or experience level changes
  const loadPromptedQuestions = async () => {
    try {
      const response = await fetch(`/api/prompted-questions?topic=${encodeURIComponent(selectedTopic)}&experienceLevel=${experienceLevel}`);
      if (response.ok) {
        const questions = await response.json();
        setPromptedQuestions(questions);
      }
    } catch (error) {
      console.error("Failed to load prompted questions:", error);
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

    analyzeAnswerMutation.mutate({
      question: question.trim(),
      userAnswer: userAnswer.trim(),
      topic: selectedTopic,
    });
  };

  const handleStartOver = () => {
    setQuestion("");
    setUserAnswer("");
    setAnalysis(null);
    setSelectedPrompted(null);
    setStep("mode");
  };

  const handleModeSelect = (selectedMode: "custom" | "prompted") => {
    setMode(selectedMode);
    if (selectedMode === "prompted") {
      loadPromptedQuestions();
    }
    setStep("question");
  };

  const handlePromptedQuestionSelect = (promptedQuestion: any) => {
    setSelectedPrompted(promptedQuestion);
    setQuestion(promptedQuestion.questionPrompt);
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

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step === "mode" ? "text-primary" : (step === "question" || step === "answer" || step === "feedback") ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "mode" ? "bg-primary text-white" : (step === "question" || step === "answer" || step === "feedback") ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                1
              </div>
              <span className="ml-2 font-medium">Choose Mode</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step === "question" ? "text-primary" : (step === "answer" || step === "feedback") ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "question" ? "bg-primary text-white" : (step === "answer" || step === "feedback") ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                2
              </div>
              <span className="ml-2 font-medium">Select Question</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step === "answer" ? "text-primary" : step === "feedback" ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "answer" ? "bg-primary text-white" : step === "feedback" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                3
              </div>
              <span className="ml-2 font-medium">Answer Question</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step === "feedback" ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "feedback" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                4
              </div>
              <span className="ml-2 font-medium">Get Feedback</span>
            </div>
          </div>
        </div>

        {/* Step 1: Mode Selection */}
        {step === "mode" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Case Study Mode</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
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

        {/* Step 2: Custom Question Input */}
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

                <Button
                  onClick={handleQuestionSubmit}
                  disabled={validateQuestionMutation.isPending || question.trim().length < 10}
                  className="w-full"
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

                  <Button
                    onClick={loadPromptedQuestions}
                    className="w-full"
                    size="lg"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Load Questions
                  </Button>

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
                    onClick={handleAnswerSubmit}
                    disabled={analyzeAnswerMutation.isPending || userAnswer.trim().length < 50}
                    className="w-full"
                    size="lg"
                  >
                    {analyzeAnswerMutation.isPending ? (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Analyze My Answer
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