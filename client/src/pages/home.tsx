import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Bookmark
} from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [customTopic, setCustomTopic] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");

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

  const handleTopicSelect = (topicId: string, category: string) => {
    setLocation(`/practice?topic=${topicId}&category=${category}`);
  };

  const handleCustomTopicSubmit = () => {
    if (customTopic.trim()) {
      setLocation(`/practice?topic=${encodeURIComponent(customTopic)}&category=custom`);
    }
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
      
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Master Your Next Interview</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Practice with real MAANG company questions, get AI-powered feedback, and ace your technical program management interviews
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4"
                onClick={() => handleTopicSelect("tpm", "mock-interview")}
              >
                <Play className="mr-2 h-5 w-5" />
                Start Mock Interview
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
                onClick={() => handleTopicSelect("pm", "case-study")}
              >
                <Briefcase className="mr-2 h-5 w-5" />
                Explore Case Studies
              </Button>
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
            {/* Mock Interviews Card */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl cursor-pointer group">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg mr-4">
                    <Mic className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Mock Interviews</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Practice real-time interviews with AI feedback. Perfect for behavioral and technical questions from top tech companies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Real-time feedback
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    MAANG company questions
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Timed practice sessions
                  </li>
                </ul>
                <Button 
                  className="w-full group-hover:bg-primary/90" 
                  onClick={() => handleTopicSelect("tpm", "mock-interview")}
                >
                  Start Mock Interview
                </Button>
              </CardContent>
            </Card>

            {/* Case Studies Card */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl cursor-pointer group">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="bg-accent/10 p-3 rounded-lg mr-4">
                    <ChartLine className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Case Studies</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Solve complex business problems with structured frameworks. Ideal for consulting and product management roles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Structured frameworks
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Step-by-step guidance
                  </li>
                  <li className="flex items-center text-neutral-600">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Industry scenarios
                  </li>
                </ul>
                <Button 
                  className="w-full bg-accent hover:bg-accent/90" 
                  onClick={() => handleTopicSelect("pm", "case-study")}
                >
                  Explore Case Studies
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Topic Selection */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Select Your Focus Area</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Choose from popular domains or enter your custom topic
            </p>
          </div>
          
          {/* Popular Topics */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {topics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <Card 
                  key={topic.id}
                  className="hover:shadow-md transition-shadow cursor-pointer border hover:border-primary"
                  onClick={() => handleTopicSelect(topic.id, "mock-interview")}
                >
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-lg mr-4 ${topic.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{topic.name}</CardTitle>
                    </div>
                    <CardDescription className="mb-4">
                      {topic.description}
                    </CardDescription>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{topic.questionCount} questions available</span>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Custom Topic Input */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">Or Enter Custom Topic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input 
                    placeholder="e.g., Data Engineering, UX Research, Sales Strategy..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomTopicSubmit()}
                    className="flex-1"
                  />
                  <Button onClick={handleCustomTopicSubmit}>
                    Generate Questions
                  </Button>
                </div>
                <p className="text-sm text-neutral-500 mt-2 text-center">
                  We'll create personalized questions based on your specific topic
                </p>
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
              {popularQuestions?.map((question: any, index: number) => (
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
            <Button size="lg" onClick={() => setLocation("/practice")}>
              View All Questions
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
