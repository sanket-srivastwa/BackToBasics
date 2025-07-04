import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { type Question } from "@/lib/api";
import Header from "@/components/header";
import Footer from "@/components/footer";
import VoiceInput from "@/components/voice-input";
import { ArrowLeft, Save, Send, Clock, Lightbulb, Mic, Keyboard } from "lucide-react";

export default function Question() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Get question ID from URL
  const questionId = parseInt(window.location.pathname.split("/").pop() || "0");

  const { data: question, isLoading } = useQuery<Question>({
    queryKey: [`/api/questions/${questionId}`],
    enabled: !!questionId,
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async (userAnswer: string) => {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: questionId,
          userAnswer: userAnswer,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Answer submitted successfully!",
        description: "Redirecting to feedback...",
      });
      setLocation(`/feedback/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Timer logic
  useEffect(() => {
    if (question && question.timeLimit && !isTimerActive) {
      setTimeLeft(question.timeLimit * 60); // Convert minutes to seconds
      setIsTimerActive(true);
    }
  }, [question, isTimerActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      toast({
        title: "Time's up!",
        description: "Consider submitting your answer or continue without time pressure.",
      });
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast({
        title: "Answer required",
        description: "Please enter your answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitAnswerMutation.mutate(answer);
  };

  const handleSaveProgress = () => {
    // In a real app, you'd save to localStorage or backend
    localStorage.setItem(`question_${questionId}_answer`, answer);
    toast({
      title: "Progress saved",
      description: "Your answer has been saved locally.",
    });
  };

  // Load saved progress
  useEffect(() => {
    const savedAnswer = localStorage.getItem(`question_${questionId}_answer`);
    if (savedAnswer) {
      setAnswer(savedAnswer);
    }
  }, [questionId]);

  if (!questionId) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <Card>
            <CardHeader>
              <CardTitle>Invalid Question</CardTitle>
              <CardDescription>The question you're looking for doesn't exist.</CardDescription>
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
            <p className="mt-4 text-neutral-600">Loading question...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <Card>
            <CardHeader>
              <CardTitle>Question not found</CardTitle>
              <CardDescription>The question you're looking for doesn't exist.</CardDescription>
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

  const wordCount = answer.trim().split(/\s+/).filter(word => word.length > 0).length;

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

        <Card className="shadow-lg border overflow-hidden">
          {/* Question Header */}
          <div className="gradient-hero text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {question?.topic?.toUpperCase()} - Question
                </h3>
                <p className="text-blue-100">
                  {question?.category === "mock-interview" ? "Behavioral" : "Case Study"} • 
                  Expected time: {question?.timeLimit || 0} minutes
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
                <div className="text-blue-100 text-sm">
                  {timeLeft > 0 ? "Remaining" : "Time's up"}
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">
                {question?.title || "Loading question..."}
              </h2>
              
              <p className="text-lg text-neutral-700 mb-6">
                {question?.description || "Loading question details..."}
              </p>

              {question?.tips && question.tips.length > 0 && (
                <div className="bg-blue-50 border-l-4 border-primary p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="h-5 w-5 text-primary mr-2" />
                    <h4 className="font-semibold text-primary">Interview Tips:</h4>
                  </div>
                  <ul className="text-neutral-700 space-y-1">
                    {question.tips.map((tip: string, index: number) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Answer Input */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-neutral-800 mb-3">
                Your Answer
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
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Start typing your answer here... Remember to structure your response using the STAR method."
                    className="min-h-64 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-neutral-500">
                      Word count: {wordCount}
                    </span>
                    <span className="text-sm text-neutral-500">
                      Aim for 200-400 words
                    </span>
                  </div>
                </TabsContent>
                
                <TabsContent value="voice" className="mt-4">
                  <VoiceInput
                    onTranscription={(text) => setAnswer(prev => prev + " " + text)}
                    disabled={submitAnswerMutation.isPending}
                  />
                  {answer && (
                    <div className="mt-4">
                      <div className="text-sm text-neutral-600 mb-2">Your transcribed answer:</div>
                      <div className="bg-gray-50 p-4 rounded-lg border text-sm">
                        {answer}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-neutral-500">
                          Word count: {wordCount}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAnswer("")}
                        >
                          Clear Answer
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSaveProgress}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Progress
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={submitAnswerMutation.isPending}
              >
                {submitAnswerMutation.isPending ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
