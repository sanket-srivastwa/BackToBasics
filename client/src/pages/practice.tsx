import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import QuestionCard from "@/components/question-card";
import { ArrowLeft, Users, Clock, Target, TrendingUp, Bookmark, Star, Flame, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";

export default function Practice() {
  const [, setLocation] = useLocation();
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(false);

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

  // Comprehensive questions query with all filters
  const { data: questions, isLoading } = useQuery({
    queryKey: ["/api/questions/filtered", selectedTopic, selectedCompany, selectedDifficulty, searchQuery || localSearchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (searchQuery || localSearchQuery) {
        params.append('q', searchQuery || localSearchQuery);
        const response = await fetch(`/api/questions/search?${params.toString()}`);
        return response.json();
      }
      
      // For non-search queries, use popular questions with filters
      if (selectedCompany !== "all") params.append('company', selectedCompany);
      if (selectedTopic !== "all") params.append('topic', selectedTopic);
      if (selectedDifficulty !== "all") params.append('difficulty', selectedDifficulty);
      
      const url = params.toString() ? `/api/questions/popular?${params.toString()}` : "/api/questions/popular";
      const response = await fetch(url);
      return response.json();
    },
  });

  // Handle local search
  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      setSearchQuery(""); // Clear URL search
      // The query will automatically refetch due to localSearchQuery change
    }
  };

  const topics = [
    { id: "all", name: "All Topics" },
    { id: "tpm", name: "Technical Program Management" },
    { id: "pm", name: "Product Management" },
    { id: "project-management", name: "Project Management" },
    { id: "em", name: "Engineering Management" }
  ];

  const difficulties = [
    { id: "all", name: "All Difficulties" },
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" }
  ];

  const companies = [
    { id: "all", name: "All Companies" },
    { id: "meta", name: "Meta" },
    { id: "amazon", name: "Amazon" },
    { id: "apple", name: "Apple" },
    { id: "netflix", name: "Netflix" },
    { id: "google", name: "Google" }
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
        {/* Header with Search */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                {(searchQuery || localSearchQuery)
                  ? `Search Results for "${searchQuery || localSearchQuery}"` 
                  : selectedCompany !== "all" 
                    ? `${selectedCompany.charAt(0).toUpperCase() + selectedCompany.slice(1)} Questions`
                    : "Practice Questions"
                }
              </h1>
              <p className="text-neutral-600">
                {(searchQuery || localSearchQuery)
                  ? `Found ${questions?.length || 0} questions matching your search`
                  : selectedCompany !== "all"
                    ? `Practice questions specifically from ${selectedCompany.charAt(0).toUpperCase() + selectedCompany.slice(1)}`
                    : "Browse and practice with curated questions from top tech companies"
                }
              </p>
            </div>
            
            {/* Search Section */}
            <div className="lg:min-w-96">
              <form onSubmit={handleLocalSearch} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search questions..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Collapsible Filters */}
        <div className="mb-8">
          <Card>
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
              <CardContent className="space-y-6 pt-0">
                {/* Difficulty Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Difficulty Level</h4>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((difficulty) => (
                      <Button
                        key={difficulty.id}
                        variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDifficulty(difficulty.id)}
                        className="transition-colors"
                      >
                        {difficulty.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Topic Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Management Area</h4>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <Button
                        key={topic.id}
                        variant={selectedTopic === topic.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTopic(topic.id)}
                        className="transition-colors"
                      >
                        {topic.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Company Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Company</h4>
                  <div className="flex flex-wrap gap-2">
                    {companies.map((company) => (
                      <Button
                        key={company.id}
                        variant={selectedCompany === company.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCompany(company.id)}
                        className="transition-colors"
                      >
                        {company.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Legacy Topic Filter (keeping for compatibility) */}
        <div className="mb-8" style={{ display: 'none' }}>
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
          {isLoading ? (
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
          ) : questions && questions.length > 0 ? (
            <div className="grid gap-6">
              {questions.map((question: any, index: number) => (
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