import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import QuestionCard from "@/components/question-card";
import { ArrowLeft, Users, Clock, Target, TrendingUp, Bookmark, Star, Flame } from "lucide-react";

export default function Practice() {
  const [, setLocation] = useLocation();
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");

  // Get search query and company filter from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const company = urlParams.get('company');
    if (search) {
      setSearchQuery(search);
    }
    if (company) {
      setSelectedCompany(company);
    }
  }, []);

  // Default questions query (with company filter)
  const { data: questions, isLoading } = useQuery({
    queryKey: ["/api/questions/popular", selectedCompany !== "all" ? selectedCompany : undefined],
    queryFn: async () => {
      const url = selectedCompany !== "all" 
        ? `/api/questions/popular?company=${selectedCompany}`
        : "/api/questions/popular";
      const response = await fetch(url);
      return response.json();
    },
    enabled: !searchQuery, // Only fetch when not searching
  });

  // Search questions query
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["/api/questions/search", searchQuery],
    queryFn: async () => {
      const response = await fetch(`/api/questions/search?q=${encodeURIComponent(searchQuery)}`);
      return response.json();
    },
    enabled: !!searchQuery,
  });

  const topics = [
    { id: "all", name: "All Topics" },
    { id: "tpm", name: "Technical Program Management" },
    { id: "pm", name: "Product Management" },
    { id: "project-management", name: "Project Management" }
  ];

  const handleQuestionClick = (questionId: number) => {
    setLocation(`/question/${questionId}`);
  };

  const getCompanyBadgeColor = (company: string) => {
    const colors = {
      meta: "bg-blue-100 text-blue-800",
      amazon: "bg-orange-100 text-orange-800", 
      apple: "bg-purple-100 text-purple-800",
      netflix: "bg-red-100 text-red-800",
      google: "bg-green-100 text-green-800",
    };
    return colors[company as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (company: string, index: number) => {
    const icons = [Flame, Star, Clock, TrendingUp, Bookmark];
    const IconComponent = icons[index % icons.length];
    const colors = ["text-orange-500", "text-yellow-500", "text-gray-500", "text-green-500", "text-blue-500"];
    return <IconComponent className={`w-4 h-4 ${colors[index % colors.length]}`} />;
  };

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
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : selectedCompany !== "all" 
                ? `${selectedCompany.charAt(0).toUpperCase() + selectedCompany.slice(1)} Questions`
                : "Practice Questions"
            }
          </h1>
          <p className="text-neutral-600">
            {searchQuery 
              ? `Found ${searchResults?.length || 0} questions matching your search`
              : selectedCompany !== "all"
                ? `Practice questions specifically from ${selectedCompany.charAt(0).toUpperCase() + selectedCompany.slice(1)}`
                : "Browse and practice with curated questions from top tech companies"
            }
          </p>
        </div>

        {/* Topic Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Filter by Topic</h3>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Button
                key={topic.id}
                variant={selectedTopic === topic.id ? "default" : "outline"}
                onClick={() => setSelectedTopic(topic.id)}
              >
                {topic.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {(isLoading || searchLoading) ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (searchQuery ? searchResults : questions) && (searchQuery ? searchResults : questions)?.length > 0 ? (
            <div className="grid gap-6">
              {(searchQuery ? searchResults : questions).map((question: any, index: number) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  companyBadgeColor={getCompanyBadgeColor(question.company)}
                  statusIcon={getStatusIcon(question.company, index)}
                  onClick={() => handleQuestionClick(question.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  {searchQuery ? "No Search Results" : "No Questions Available"}
                </CardTitle>
                <CardDescription>
                  {searchQuery 
                    ? `No questions found matching "${searchQuery}". Try different keywords or browse all questions.`
                    : "There are no questions available at the moment. Try creating a custom case study instead."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {searchQuery ? (
                  <Button onClick={() => {
                    setSearchQuery("");
                    window.history.replaceState({}, '', '/practice');
                  }}>
                    Browse All Questions
                  </Button>
                ) : (
                  <Button onClick={() => setLocation("/custom-case-study")}>
                    Create Custom Case Study
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}