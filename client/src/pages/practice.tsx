import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import QuestionCard from "@/components/question-card";
import { ArrowLeft, Users } from "lucide-react";

export default function Practice() {
  const [, setLocation] = useLocation();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const topic = searchParams.get("topic") || "";
  const category = searchParams.get("category") || "mock-interview";

  const { data: questions, isLoading } = useQuery({
    queryKey: ["/api/questions", topic, category],
    enabled: !!topic,
  });

  const handleQuestionClick = (questionId: number) => {
    setLocation(`/question/${questionId}`);
  };

  const getTopicDisplay = (topic: string) => {
    const topicMap = {
      "tpm": "Technical Program Management",
      "pm": "Product Management", 
      "project-management": "Project Management"
    };
    return topicMap[topic as keyof typeof topicMap] || topic;
  };

  const getCategoryDisplay = (category: string) => {
    return category === "mock-interview" ? "Mock Interviews" : 
           category === "case-study" ? "Case Studies" : "Custom Questions";
  };

  if (!topic) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <Card>
            <CardHeader>
              <CardTitle>No topic selected</CardTitle>
              <CardDescription>Please go back and select a topic to practice</CardDescription>
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-neutral-800">
              {getTopicDisplay(topic)}
            </h1>
            <Badge variant="secondary" className="text-sm">
              {getCategoryDisplay(category)}
            </Badge>
          </div>
          
          <p className="text-neutral-600">
            Practice questions tailored for your selected topic and interview style
          </p>
        </div>

        {/* Questions */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-neutral-600">Loading questions...</p>
          </div>
        ) : questions && questions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question: any, index: number) => (
              <QuestionCard
                key={question.id}
                question={question}
                companyBadgeColor={question.company ? `bg-${question.company}-100 text-${question.company}-800` : "bg-gray-100 text-gray-800"}
                statusIcon={<Users className="w-4 h-4 text-gray-500" />}
                onClick={() => handleQuestionClick(question.id)}
                showPractitioners={false}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No questions found</CardTitle>
              <CardDescription>
                We don't have questions for this topic yet. Try a different topic or check back later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Try Different Topic
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
