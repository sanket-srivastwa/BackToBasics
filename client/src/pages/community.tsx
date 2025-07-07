import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  MessageCircle, 
  Heart, 
  ChevronUp, 
  Users,
  Building,
  Clock,
  TrendingUp,
  Star
} from "lucide-react";
import { type Question } from "@/lib/api";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { getTopicsForRole, getAllTopics } from "@/lib/topicFilters";

interface CommunityQuestion extends Question {
  communityAnswersCount: number;
  communityLikesCount: number;
  communityVotesCount: number;
  lastActivityAt: string;
  topContributors: Array<{
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
    answerCount: number;
  }>;
}

export default function Community() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [sortBy, setSortBy] = useState("most-active");
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Get filters from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const company = urlParams.get('company');
    const difficulty = urlParams.get('difficulty');
    const role = urlParams.get('role');
    const topic = urlParams.get('topic');
    
    if (search) {
      setSearchTerm(search);
      setDebouncedSearchTerm(search);
    }
    if (company) setSelectedCompany(company);
    if (difficulty) setSelectedDifficulty(difficulty);
    if (role) setSelectedRole(role);
    if (topic) setSelectedTopic(topic);
  }, []);

  // Debounce search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch community questions with filters
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["/api/community/questions", {
      search: debouncedSearchTerm,
      company: selectedCompany,
      difficulty: selectedDifficulty,
      role: selectedRole,
      topic: selectedTopic,
      sortBy
    }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
      if (selectedCompany !== 'all') params.set('company', selectedCompany);
      if (selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
      if (selectedRole !== 'all') params.set('role', selectedRole);
      if (selectedTopic !== 'all') params.set('topic', selectedTopic);
      params.set('sortBy', sortBy);

      const response = await fetch(`/api/community/questions?${params}`);
      if (!response.ok) throw new Error("Failed to fetch community questions");
      return response.json();
    }
  });

  const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Oracle", "Cisco", "Salesforce", "Adobe", "NVIDIA", "Netflix"];
  const difficulties = ["Easy", "Medium", "Hard"];
  const roles = ["Product Management", "Program Management", "Engineering Management", "General Management"];
  
  // Dynamic topics based on selected role
  const availableTopics = selectedRole === "all" ? getAllTopics() : getTopicsForRole(selectedRole);
  
  // Reset topic if current selection is not available for the new role
  useEffect(() => {
    if (selectedRole !== "all" && selectedTopic !== "all") {
      const roleTopics = getTopicsForRole(selectedRole);
      if (!roleTopics.includes(selectedTopic)) {
        setSelectedTopic("all");
      }
    }
  }, [selectedRole, selectedTopic]);

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case "most-active": return "Most Active";
      case "most-answers": return "Most Answers";
      case "most-liked": return "Most Liked";
      case "newest": return "Newest";
      case "trending": return "Trending";
      default: return "Most Active";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Community Discussions</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Explore questions with community answers, share your perspectives, and learn from others' experiences.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search community discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {filtersExpanded ? "Hide Filters" : "Show Filters"}
                </Button>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="most-active">Most Active</SelectItem>
                    <SelectItem value="most-answers">Most Answers</SelectItem>
                    <SelectItem value="most-liked">Most Liked</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Expanded Filters */}
              {filtersExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Companies" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Companies</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        {difficulties.map((difficulty) => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {difficulty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Topics" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        {availableTopics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            {isLoading ? "Loading..." : `${questions.length} community discussions found`}
            {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
          </div>
          <div className="text-sm text-gray-500">
            Sorted by {getSortLabel(sortBy)}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Community Questions List */}
        <div className="space-y-6">
          {questions.map((question: CommunityQuestion) => (
            <Card key={question.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/questions/${question.id}`}>
                      <CardTitle className="text-xl hover:text-purple-600 cursor-pointer transition-colors">
                        {question.title}
                      </CardTitle>
                    </Link>
                    <CardDescription className="mt-2 text-base leading-relaxed">
                      {question.description}
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge 
                      variant={question.difficulty === "Easy" ? "secondary" : 
                              question.difficulty === "Medium" ? "default" : "destructive"}
                    >
                      {question.difficulty}
                    </Badge>
                    {question.isPopular && (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {question.company && (
                    <Badge variant="outline" className="text-blue-600">
                      <Building className="h-3 w-3 mr-1" />
                      {question.company}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-green-600">
                    {question.topic}
                  </Badge>
                  {question.roles && question.roles.map((role, index) => (
                    <Badge key={index} variant="outline" className="text-purple-600">
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                {/* Community Engagement Stats */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{question.communityAnswersCount}</span>
                      <span className="text-sm">answers</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Heart className="h-4 w-4" />
                      <span className="font-medium">{question.communityLikesCount}</span>
                      <span className="text-sm">likes</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <ChevronUp className="h-4 w-4" />
                      <span className="font-medium">{question.communityVotesCount}</span>
                      <span className="text-sm">votes</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Last activity {formatDistanceToNow(new Date(question.lastActivityAt), { addSuffix: true })}
                  </div>
                </div>

                {/* Top Contributors */}
                {question.topContributors && question.topContributors.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Top contributors:</span>
                      <div className="flex items-center -space-x-2">
                        {question.topContributors.slice(0, 3).map((contributor, index) => (
                          <Avatar key={index} className="h-8 w-8 border-2 border-white">
                            <AvatarImage src={contributor.profileImageUrl || undefined} />
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                              {contributor.firstName[0]}{contributor.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {question.topContributors.length > 3 && (
                        <span className="text-sm text-gray-500">
                          +{question.topContributors.length - 3} more
                        </span>
                      )}
                    </div>

                    <Link href={`/questions/${question.id}`}>
                      <Button variant="outline" size="sm">
                        Join Discussion
                      </Button>
                    </Link>
                  </div>
                )}

                {/* No Community Activity */}
                {question.communityAnswersCount === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="font-medium text-gray-900 mb-2">No community answers yet</h4>
                    <p className="text-gray-600 text-sm mb-4">Be the first to share your perspective!</p>
                    <Link href={`/questions/${question.id}`}>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Start the Discussion
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {!isLoading && questions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No community discussions found</h3>
              <p className="text-gray-600 mb-6">
                {debouncedSearchTerm || selectedCompany !== 'all' || selectedDifficulty !== 'all' || selectedRole !== 'all' || selectedTopic !== 'all'
                  ? "Try adjusting your filters or search terms."
                  : "Be the first to start a community discussion!"
                }
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setDebouncedSearchTerm("");
                  setSelectedCompany("all");
                  setSelectedDifficulty("all");
                  setSelectedRole("all");
                  setSelectedTopic("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}