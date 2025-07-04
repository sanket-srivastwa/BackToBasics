import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { 
  ArrowLeft, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  Target,
  TrendingUp
} from "lucide-react";

export default function Feedback() {
  const [, setLocation] = useLocation();
  
  // Get answer ID from URL
  const answerId = parseInt(window.location.pathname.split("/").pop() || "0");

  const { data: answer, isLoading } = useQuery({
    queryKey: [`/api/answers/${answerId}`],
    enabled: !!answerId,
  });

  const { data: question } = useQuery({
    queryKey: [`/api/questions/${answer?.questionId}`],
    enabled: !!answer?.questionId,
  });

  if (!answerId) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <Card>
            <CardHeader>
              <CardTitle>Invalid Feedback</CardTitle>
              <CardDescription>The feedback you're looking for doesn't exist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-neutral-600">Analyzing your answer...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!answer || !question) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <Card>
            <CardHeader>
              <CardTitle>Feedback not found</CardTitle>
              <CardDescription>The feedback you're looking for doesn't exist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreProgress = (score: number) => {
    return (score / 10) * 100;
  };

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

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">Answer Analysis & Feedback</h2>
          <p className="text-xl text-neutral-600">See how your response compares to the optimal answer</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Your Answer */}
          <Card className="shadow-sm border overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-neutral-800">Your Answer</h3>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
                  <span className={`text-sm font-medium ${getScoreColor(answer.score || 0)}`}>
                    Score: {answer.score}/10
                  </span>
                </div>
                <div className="ml-4 flex-1">
                  <Progress value={getScoreProgress(answer.score || 0)} className="h-2" />
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="prose prose-sm max-w-none text-neutral-700">
                <p className="whitespace-pre-wrap">{answer.userAnswer}</p>
              </div>
            </CardContent>
          </Card>

          {/* Optimal Answer */}
          <Card className="shadow-sm border overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-200">
              <h3 className="text-lg font-semibold text-neutral-800">Optimal Answer</h3>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">Reference Score: 9.5/10</span>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="prose prose-sm max-w-none text-neutral-700">
                <div className="whitespace-pre-wrap">{question.optimalAnswer}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feedback */}
        <Card className="shadow-sm border mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Detailed Feedback</CardTitle>
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
                  {answer.strengths?.map((strength: string, index: number) => (
                    <li key={index}>• {strength}</li>
                  )) || <li>• Clear communication</li>}
                </ul>
              </div>
              
              {/* Areas to Improve */}
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-neutral-800 mb-2">Areas to Improve</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  {answer.improvements?.map((improvement: string, index: number) => (
                    <li key={index}>• {improvement}</li>
                  )) || <li>• Consider adding more specific examples</li>}
                </ul>
              </div>
              
              {/* Suggestions */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-neutral-800 mb-2">Suggestions</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  {answer.suggestions?.map((suggestion: string, index: number) => (
                    <li key={index}>• {suggestion}</li>
                  )) || <li>• Use the STAR method for behavioral questions</li>}
                </ul>
              </div>
            </div>

            {answer.feedback && (
              <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-lg">
                <h4 className="font-semibold text-primary mb-3 flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Key Improvement Areas:
                </h4>
                <p className="text-neutral-700 mb-4">
                  {answer.feedback.detailedAnalysis || answer.feedback.overall}
                </p>
                <button 
                  className="text-primary font-semibold hover:underline"
                  onClick={() => {
                    // In a real app, this would show more detailed tips
                    alert("Detailed improvement tips would be shown here.");
                  }}
                >
                  View detailed improvement tips →
                </button>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setLocation(`/question/${question.id}`)}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Another Question
              </Button>
              <Button
                className="flex-1"
                onClick={() => setLocation("/practice")}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Continue Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
