import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import QuestionCard from "@/components/question-card";
import { 
  Mic, 
  ChartLine, 
  Settings, 
  Lightbulb, 
  ListTodo,
  Play,
  Briefcase,
  CheckCircle,
  Flame,
  Users,
  Star,
  Clock,
  TrendingUp,
  Bookmark,
  Target,
  Search
} from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [customTopic, setCustomTopic] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("practice");

  const { data: popularQuestions, isLoading } = useQuery({
    queryKey: ["/api/questions/popular", selectedCompany !== "all" ? selectedCompany : undefined],
    queryFn: async () => {
      const url = selectedCompany !== "all" 
        ? `/api/questions/popular?company=${selectedCompany}`
        : "/api/questions/popular";
      const response = await fetch(url);
      return response.json();
    },
  });



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
    { id: "netflix", name: "Netflix" },
  ];

  const topics = [
    {
      id: "tpm",
      name: "Technical Program Management",
      description: "Cross-functional leadership, technical strategy, and program execution",
      icon: Settings,
      color: "bg-blue-100 text-blue-600",
      questionCount: 245
    },
    {
      id: "pm",
      name: "Product Management", 
      description: "Product strategy, user research, and feature prioritization",
      icon: Lightbulb,
      color: "bg-amber-100 text-amber-600",
      questionCount: 189
    },
    {
      id: "project-management",
      name: "Project Management",
      description: "Agile methodologies, stakeholder management, and delivery",
      icon: ListTodo,
      color: "bg-green-100 text-green-600",
      questionCount: 167
    }
  ];

  const handleCustomTopicSubmit = () => {
    if (customTopic.trim()) {
      setLocation("/custom-case-study");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    switch (searchType) {
      case "practice":
        // Practice + search content = practice questions with search
        setLocation(`/practice?search=${encodeURIComponent(searchQuery)}`);
        break;
      case "learning":
        // Learning + search content = learning page with search
        setLocation(`/learning?search=${encodeURIComponent(searchQuery)}`);
        break;
      case "companies":
        // Companies + search content = practice questions filtered by company
        setLocation(`/practice?company=${encodeURIComponent(searchQuery)}`);
        break;
      default:
        setLocation(`/practice?search=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery("");
  };



  const getCompanyBadgeColor = (company: string) => {
    const colors = {
      microsoft: "bg-blue-100 text-blue-800",
      google: "bg-green-100 text-green-800",
      amazon: "bg-orange-100 text-orange-800", 
      meta: "bg-blue-100 text-blue-800",
      apple: "bg-purple-100 text-purple-800",
      oracle: "bg-red-100 text-red-800",
      cisco: "bg-cyan-100 text-cyan-800",
      salesforce: "bg-indigo-100 text-indigo-800",
      adobe: "bg-red-100 text-red-800",
      nvidia: "bg-green-100 text-green-800",
      netflix: "bg-red-100 text-red-800"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <Header />
      
      {/* Hero Section - edX.org inspired with warm colors */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar - Top Center */}
          <div className="flex justify-center mb-8">
            <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-3">
              {/* Single Dropdown for Search Type */}
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-36 h-12 bg-white text-gray-800 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  <SelectValue placeholder="Search Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="practice">Practice</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="companies">Companies</SelectItem>
                </SelectContent>
              </Select>

              {/* Search Input */}
              <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={
                    searchType === "practice" 
                      ? "Search interview questions and topics..." 
                      : searchType === "learning" 
                      ? "Search learning materials and courses..."
                      : "Search by company name..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 w-96 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 placeholder-gray-500 text-base font-medium"
                />
              </div>

              {/* Search Button - edX.org inspired */}
              <Button type="submit" className="h-12 px-8 bg-white text-blue-900 hover:bg-gray-50 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-white">
                Search
              </Button>
            </form>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">No hacks. No magic. Just practice. Always.</h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed font-light">
              Practice with real questions from top tech companies like Microsoft, Google, Amazon, and more. Get AI-powered feedback for product, program, and engineering management roles.
            </p>
            
            {/* Practice and Learn Options */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
              <div 
                className="glass-card rounded-xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer group scale-on-hover"
                onClick={() => setLocation("/practice")}
              >
                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-6 group-hover:bg-white/30 transition-all">
                    <Play className="w-8 h-8 text-white mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Practice</h3>
                  <p className="text-orange-100 mb-6">
                    Test yourself with real interview questions from top companies. Get AI-powered feedback and improve your answers.
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-orange-100">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Real top tech company questions
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      AI-powered feedback
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Voice and text answers
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                className="glass-card rounded-xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer group scale-on-hover"
                onClick={() => setLocation("/learning")}
              >
                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-6 w-20 h-20 mx-auto mb-6 group-hover:bg-white/30 transition-all">
                    <Lightbulb className="w-8 h-8 text-white mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Learn</h3>
                  <p className="text-orange-100 mb-6">
                    Master the fundamentals with comprehensive learning materials covering PM, TPM, and Engineering Management.
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-orange-100">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Comprehensive frameworks
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Interactive modules
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Real-world examples
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Options */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Choose Your Practice Mode</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Select the type of practice that best fits your preparation goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Case Studies Card */}
            <Card className="card-hover border-2 border-gradient-to-r from-purple-200 to-pink-200 cursor-pointer group scale-on-hover bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg mr-4 shadow-lg">
                    <ChartLine className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">AI Case Studies</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-600">
                  Create custom interview questions or use AI-generated questions with personalized feedback. Perfect for targeted practice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Custom question creation
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    AI-powered optimal answers
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Detailed feedback analysis
                  </li>
                </ul>
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" 
                    onClick={() => setLocation("/custom-case-study?mode=ai-generated")}
                  >
                    <ChartLine className="mr-2 h-5 w-5" />
                    AI Case Study
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Practice Questions Card */}
            <Card className="card-hover border-2 border-gradient-to-r from-orange-200 to-yellow-200 cursor-pointer group scale-on-hover bg-gradient-to-br from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-orange-600 to-yellow-600 p-3 rounded-lg mr-4 shadow-lg">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">Practice Questions</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-600">
                  Browse and practice with curated questions from top tech companies. Perfect for structured interview preparation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                    Top tech company questions
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                    Timed practice sessions
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                    Difficulty-based filtering
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" 
                  onClick={() => setLocation("/practice")}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Browse Questions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Learning Materials */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Learning Materials</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive courses and frameworks for management roles at top tech companies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="card-hover cursor-pointer group scale-on-hover" onClick={() => setLocation("/learning")}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center float-animation">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-purple-800">Technical Program Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Lead complex technical programs across engineering teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Program Planning & Execution</li>
                  <li>• Systems Design for TPMs</li>
                  <li>• Cross-functional Leadership</li>
                  <li>• Risk Management</li>
                </ul>
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover cursor-pointer group scale-on-hover" onClick={() => setLocation("/learning")}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center float-animation">
                  <Lightbulb className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-orange-800">Product Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Build products that customers love and drive business growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Product Strategy & Vision</li>
                  <li>• User Research & Analytics</li>
                  <li>• Feature Prioritization</li>
                  <li>• A/B Testing & Metrics</li>
                </ul>
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover cursor-pointer group scale-on-hover" onClick={() => setLocation("/learning")}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center float-animation">
                  <Users className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle className="text-xl text-pink-800">Engineering Management</CardTitle>
                <CardDescription className="text-gray-600">
                  Lead engineering teams and drive technical excellence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• People Management</li>
                  <li>• Technical Leadership</li>
                  <li>• Engineering Culture</li>
                  <li>• Performance Coaching</li>
                </ul>
                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Popular Top Tech Company Questions</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Practice with real questions asked by top tech companies
            </p>
          </div>

          {/* Company Tabs */}
          <div className="flex flex-wrap justify-center mb-12 border-b border-gray-200">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => setSelectedCompany(company.id)}
                className={`px-6 py-3 font-semibold transition-colors ${
                  selectedCompany === company.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-neutral-600 hover:text-primary"
                }`}
              >
                {company.name}
              </button>
            ))}
          </div>

          {/* Questions Grid */}
          {isLoading ? (
            <div className="text-center">Loading questions...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularQuestions?.slice(0, 20).map((question: any, index: number) => (
                <QuestionCard 
                  key={question.id}
                  question={question}
                  companyBadgeColor={getCompanyBadgeColor(question.company)}
                  statusIcon={getStatusIcon(question.company, index)}
                  onClick={() => setLocation(`/question/${question.id}`)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => setLocation("/practice")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
              View All Questions
              <Target className="ml-2 w-5 h-5" />
            </Button>
            {popularQuestions && popularQuestions.length > 20 && (
              <p className="text-sm text-gray-600 mt-3">
                Showing 20 of {popularQuestions.length} questions
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
