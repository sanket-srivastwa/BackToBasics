import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import Footer from "@/components/footer";
import QuestionCard from "@/components/question-card";
import AuthPromptModal from "@/components/auth-prompt-modal";
import { useAccessControl } from "@/hooks/useAccessControl";
import { ArrowLeft, Users, Clock, Target, TrendingUp, Bookmark, Star, Flame, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";

export default function Practice() {
  const [, setLocation] = useLocation();
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { canViewQuestions, shouldShowAuthPrompt, questionsRemaining, questionsViewed } = useAccessControl();

  // Initialize from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const company = urlParams.get('company');
    const difficulty = urlParams.get('difficulty');
    const topic = urlParams.get('topic');
    
    if (search) {
      setSearchTerm(search);
      setDebouncedSearchTerm(search);
    }
    if (company) setSelectedCompany(company);
    if (difficulty) setSelectedDifficulty(difficulty);
    if (topic) setSelectedTopic(topic);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Questions query with proper deduplication
  const { data: questionsData, isLoading, error } = useQuery({
    queryKey: ["/api/questions/filtered", selectedTopic, selectedCompany, selectedDifficulty, debouncedSearchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (selectedCompany !== "all") params.append('company', selectedCompany);
      if (selectedDifficulty !== "all") params.append('difficulty', selectedDifficulty);
      if (selectedTopic !== "all") params.append('topic', selectedTopic);
      if (debouncedSearchTerm.trim()) params.append('search', debouncedSearchTerm);
      
      const hasFilters = params.toString().length > 0;
      const url = hasFilters ? `/api/questions/filtered?${params.toString()}` : "/api/questions/popular";
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      return data;
    },
    staleTime: 2 * 60 * 1000, // Reduce stale time to 2 minutes
    gcTime: 5 * 60 * 1000, // Reduce cache time to 5 minutes
    retry: 1, // Reduce retries
  });

  // Process questions data - duplicates have been cleaned from database
  const questions = useMemo(() => {
    if (!questionsData || !Array.isArray(questionsData)) return [];
    
    // Simple validation to ensure we have valid questions with IDs
    return questionsData.filter((question: any) => 
      question && 
      question.id && 
      question.title && 
      question.description
    );
  }, [questionsData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleQuestionClick = (questionId: number) => {
    setLocation(`/question/${questionId}`);
  };

  const clearAllFilters = () => {
    setSelectedDifficulty("all");
    setSelectedTopic("all");
    setSelectedCompany("all");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    window.history.pushState({}, '', '/practice');
  };

  const topics = [
    { id: "all", name: "All Topics" },
    { id: "pm", name: "Product Management" },
    { id: "tpm", name: "Technical Program Management" },
    { id: "em", name: "Engineering Management" },
    { id: "project-management", name: "Project Management" }
  ];

  const difficulties = [
    { id: "all", name: "All Levels" },
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" }
  ];

  const companies = [
    { id: "all", name: "All Companies" },
    { id: "microsoft", name: "Microsoft" },
    { id: "google", name: "Google" },
    { id: "amazon", name: "Amazon" },
    { id: "meta", name: "Meta" },
    { id: "apple", name: "Apple" },
    { id: "oracle", name: "Oracle" },
    { id: "cisco", name: "Cisco" },
    { id: "salesforce", name: "Salesforce" },
    { id: "adobe", name: "Adobe" },
    { id: "nvidia", name: "NVIDIA" },
    { id: "netflix", name: "Netflix" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="mr-4 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Practice Interview Questions
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Master management interviews with real questions from top tech companies
            </p>

            {/* Questions viewed counter for non-authenticated users */}
            {!canViewQuestions && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-orange-800">
                  <strong>{questionsViewed}/5</strong> free questions viewed. 
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="text-orange-600 hover:text-orange-800 underline ml-1"
                  >
                    Sign in for unlimited access
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search questions by keyword, company, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors" 
              onClick={() => setFiltersExpanded(!filtersExpanded)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter Questions
                </div>
                {filtersExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </CardTitle>
            </CardHeader>
            {filtersExpanded && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Difficulty Filter */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-orange-600" />
                      <h4 className="text-sm font-semibold text-gray-800">Difficulty Level</h4>
                    </div>
                    <div className="space-y-2">
                      {difficulties.map((difficulty) => (
                        <Button
                          key={difficulty.id}
                          variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDifficulty(difficulty.id)}
                          className={`w-full justify-start transition-all duration-200 ${
                            selectedDifficulty === difficulty.id 
                              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg" 
                              : "hover:bg-orange-50 hover:border-orange-300"
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            difficulty.id === "easy" ? "bg-green-400" :
                            difficulty.id === "medium" ? "bg-yellow-400" : "bg-red-400"
                          }`}></div>
                          {difficulty.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Topic Filter */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-semibold text-gray-800">Management Area</h4>
                    </div>
                    <div className="space-y-2">
                      {topics.map((topic) => (
                        <Button
                          key={topic.id}
                          variant={selectedTopic === topic.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTopic(topic.id)}
                          className={`w-full justify-start transition-all duration-200 ${
                            selectedTopic === topic.id 
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" 
                              : "hover:bg-blue-50 hover:border-blue-300"
                          }`}
                        >
                          {topic.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Company Filter */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-purple-600" />
                      <h4 className="text-sm font-semibold text-gray-800">Company</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {companies.map((company) => (
                        <Button
                          key={company.id}
                          variant={selectedCompany === company.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCompany(company.id)}
                          className={`justify-start transition-all duration-200 text-xs ${
                            selectedCompany === company.id 
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                              : "hover:bg-purple-50 hover:border-purple-300"
                          }`}
                        >
                          {company.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Clear All Filters */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No questions found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {questions.map((question: any) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onClick={() => handleQuestionClick(question.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthPromptModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            questionsRemaining={questionsRemaining}
            questionsViewed={questionsViewed}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}