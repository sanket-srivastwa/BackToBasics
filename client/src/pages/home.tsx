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
    { id: "meta", name: "Meta" },
    { id: "amazon", name: "Amazon" },
    { id: "apple", name: "Apple" },
    { id: "netflix", name: "Netflix" },
    { id: "google", name: "Google" },
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
        setLocation(`/practice?search=${encodeURIComponent(searchQuery)}`);
        break;
      case "learning":
        setLocation(`/learning?search=${encodeURIComponent(searchQuery)}`);
        break;
      case "companies":
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
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar - Top Right */}
          <div className="flex justify-end mb-8">
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative flex items-center bg-white/20 backdrop-blur-md rounded-xl overflow-hidden border border-white/30 shadow-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search questions, topics, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 w-96 h-12 border-0 rounded-none focus:ring-2 focus:ring-white/40 bg-transparent text-white placeholder-white/80 text-base font-medium"
                />
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="w-28 h-12 border-0 border-l border-white/30 rounded-none bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practice">Practice</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="companies">Companies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Master Your Next Interview</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
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
                  <p className="text-blue-100 mb-6">
                    Test yourself with real interview questions from top companies. Get AI-powered feedback and improve your answers.
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-blue-100">
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Real MAANG company questions
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
                  <p className="text-blue-100 mb-6">
                    Master the fundamentals with comprehensive learning materials covering PM, TPM, and Engineering Management.
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-blue-100">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Choose Your Practice Mode</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Select the type of practice that best fits your preparation goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Case Studies Card */}
            <Card className="card-hover border-2 cursor-pointer group scale-on-hover">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <ChartLine className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">AI Case Studies</CardTitle>
                </div>
                <CardDescription className="text-base">
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
                <Button 
                  className="w-full group-hover:bg-primary/90" 
                  onClick={() => setLocation("/custom-case-study")}
                >
                  Create Custom Case Study
                </Button>
              </CardContent>
            </Card>

            {/* Practice Questions Card */}
            <Card className="card-hover border-2 cursor-pointer group scale-on-hover">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="bg-accent/10 p-3 rounded-lg mr-4">
                    <Briefcase className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Practice Questions</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Browse and practice with curated questions from top tech companies. Perfect for structured interview preparation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    MAANG company questions
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Timed practice sessions
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Difficulty-based filtering
                  </li>
                </ul>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90" 
                  onClick={() => setLocation("/practice")}
                >
                  Browse Questions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Learning Materials */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Learning Materials</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Comprehensive courses and frameworks for management roles at top tech companies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="card-hover cursor-pointer group scale-on-hover" onClick={() => setLocation("/learning")}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center float-animation">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-800">Technical Program Management</CardTitle>
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
                  <Button className="w-full group-hover:bg-blue-700">
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover cursor-pointer group scale-on-hover" onClick={() => setLocation("/learning")}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center float-animation">
                  <Lightbulb className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-800">Product Management</CardTitle>
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
                  <Button className="w-full group-hover:bg-green-700">
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover cursor-pointer group scale-on-hover" onClick={() => setLocation("/learning")}>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center float-animation">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-purple-800">Engineering Management</CardTitle>
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
                  <Button className="w-full group-hover:bg-purple-700">
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Popular MAANG Questions</h2>
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
