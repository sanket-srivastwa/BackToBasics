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

export default function EnhancedCaseStudy() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'generate' | 'answer' | 'result'>('generate');
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [voiceAnswer, setVoiceAnswer] = useState("");
  const [answerMethod, setAnswerMethod] = useState<'type' | 'voice'>('type');

  // Generate case study mutation
  const generateCaseStudyMutation = useMutation({
    mutationFn: async ({ topic, difficulty }: { topic: string; difficulty: string }) => {
      const response = await apiRequest("/api/case-studies/generate", "POST", { topic, difficulty });
      return response as CaseStudy;
    },
    onSuccess: (data: CaseStudy) => {
      setCaseStudy(data);
      setCurrentStep('answer');
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
          description: "Failed to generate case study. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  // Evaluate answer mutation
  const evaluateAnswerMutation = useMutation({
    mutationFn: async () => {
      const finalAnswer = answerMethod === 'voice' ? voiceAnswer : userAnswer;
      if (!finalAnswer.trim()) {
        throw new Error("Please provide an answer before submitting");
      }
      
      const response = await apiRequest("/api/case-studies/evaluate", "POST", { 
        caseStudy, 
        userAnswer: finalAnswer 
      });
      return response as AnalysisResult;
    },
    onSuccess: (data: AnalysisResult) => {
      setAnalysisResult(data);
      setCurrentStep('result');
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
    setCurrentStep('generate');
  };

  if (currentStep === 'generate') {
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

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-blue-600" />
                Generate Custom Case Study
              </CardTitle>
              <CardDescription>
                Select a topic and difficulty level to generate a comprehensive case study
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Popular Topics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleGenerateCaseStudy("Product Strategy", "medium")}
                      disabled={generateCaseStudyMutation.isPending}
                      className="h-auto py-3 px-4 text-left"
                    >
                      <div>
                        <div className="font-medium">Product Strategy</div>
                        <div className="text-xs text-gray-500">Market expansion & positioning</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleGenerateCaseStudy("Operations Optimization", "medium")}
                      disabled={generateCaseStudyMutation.isPending}
                      className="h-auto py-3 px-4 text-left"
                    >
                      <div>
                        <div className="font-medium">Operations</div>
                        <div className="text-xs text-gray-500">Process improvement & efficiency</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleGenerateCaseStudy("Digital Transformation", "hard")}
                      disabled={generateCaseStudyMutation.isPending}
                      className="h-auto py-3 px-4 text-left"
                    >
                      <div>
                        <div className="font-medium">Digital Transform</div>
                        <div className="text-xs text-gray-500">Technology adoption & change</div>
                      </div>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleGenerateCaseStudy("Growth Strategy", "medium")}
                      disabled={generateCaseStudyMutation.isPending}
                      className="h-auto py-3 px-4 text-left"
                    >
                      <div>
                        <div className="font-medium">Growth Strategy</div>
                        <div className="text-xs text-gray-500">Scaling & market development</div>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Difficulty Levels</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => handleGenerateCaseStudy("Customer Experience", "easy")}
                      disabled={generateCaseStudyMutation.isPending}
                      className="w-full justify-start"
                    >
                      <Badge variant="secondary" className="mr-3 bg-green-100 text-green-800">Easy</Badge>
                      Clear problem, straightforward solution
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleGenerateCaseStudy("Market Analysis", "medium")}
                      disabled={generateCaseStudyMutation.isPending}
                      className="w-full justify-start"
                    >
                      <Badge variant="secondary" className="mr-3 bg-yellow-100 text-yellow-800">Medium</Badge>
                      Multiple factors, strategic thinking required
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleGenerateCaseStudy("Complex Systems", "hard")}
                      disabled={generateCaseStudyMutation.isPending}
                      className="w-full justify-start"
                    >
                      <Badge variant="secondary" className="mr-3 bg-red-100 text-red-800">Hard</Badge>
                      Ambiguous problem, multiple stakeholders
                    </Button>
                  </div>
                </div>
              </div>

              {generateCaseStudyMutation.isPending && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating your custom case study...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take up to 30 seconds</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  if (currentStep === 'answer' && caseStudy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleStartNew}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Generate New Case Study
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{caseStudy.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <Badge variant="outline">{caseStudy.company}</Badge>
              <Badge variant="outline">{caseStudy.industry}</Badge>
              <Badge variant="outline">{caseStudy.companySize}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Case Study Details */}
            <div className="lg:col-span-2 space-y-6">
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
            </div>

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
                        Speak
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="type">
                      <Textarea
                        placeholder="Provide your detailed solution here. Consider the problem framework, analysis, recommendations, and implementation plan..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="min-h-[400px]"
                      />
                    </TabsContent>
                    
                    <TabsContent value="voice">
                      <VoiceInput
                        onTranscription={setVoiceAnswer}
                      />
                      {voiceAnswer && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-2">Your Voice Answer:</h4>
                          <p className="text-gray-700">{voiceAnswer}</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  <div className="text-sm text-gray-600 space-y-2">
                    <p><strong>💡 Tip:</strong> Structure your answer using a framework like:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Problem Analysis & Root Cause</li>
                      <li>Strategic Options & Trade-offs</li>
                      <li>Recommended Solution</li>
                      <li>Implementation Plan & Metrics</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={evaluateAnswerMutation.isPending || (!userAnswer.trim() && !voiceAnswer.trim())}
                    className="w-full"
                  >
                    {evaluateAnswerMutation.isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                        Analyzing Solution...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit for Analysis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (currentStep === 'result' && analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleStartNew}
              className="mb-4 text-blue-600 hover:text-blue-800"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Another Case Study
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h1>
            <p className="text-gray-600">Comprehensive feedback on your solution</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score & Overview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                    Your Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    {analysisResult.userScore}
                  </div>
                  <div className="text-gray-600 mb-4">out of 100</div>
                  <Progress value={analysisResult.userScore} className="w-full mb-4" />
                  <Badge 
                    variant={analysisResult.userScore >= 80 ? "default" : analysisResult.userScore >= 60 ? "secondary" : "destructive"}
                    className="text-sm"
                  >
                    {analysisResult.userScore >= 80 ? "Excellent" : 
                     analysisResult.userScore >= 60 ? "Good" : "Needs Improvement"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" onClick={handleStartNew} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Case Study
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/practice")} className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Practice Questions
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/learn")} className="w-full">
                    <Brain className="mr-2 h-4 w-4" />
                    Learning Materials
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Feedback */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-blue-600" />
                    Optimal Solution Approach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{analysisResult.optimalAnswer}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-600">
                      <AlertTriangle className="mr-2 h-5 w-5" />
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
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
                    Suggestions for Next Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <Lightbulb className="mr-2 h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                    Detailed Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{analysisResult.detailedFeedback}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return null;
}