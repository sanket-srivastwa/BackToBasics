import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Target, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  FileText, 
  Lightbulb,
  Code,
  TrendingUp,
  BarChart3,
  Database,
  ChevronRight,
  Award,
  Calendar,
  Monitor,
  Network,
  Briefcase,
  Brain,
  Calculator,
  PieChart,
  LineChart,
  DollarSign,
  MessageSquare,
  Zap,
  Globe,
  Lock
} from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  topics: LearningTopic[];
  category: "product" | "program" | "engineering" | "analytics";
}

interface LearningTopic {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: "video" | "article" | "exercise" | "quiz";
  completed: boolean;
  content?: string;
}

const learningModules: LearningModule[] = [
  // Product Management
  {
    id: "product-strategy",
    title: "Product Strategy & Vision",
    description: "Learn to define product vision, strategy, and roadmaps that align with business goals",
    icon: Target,
    duration: "6 hours",
    difficulty: "Intermediate",
    progress: 65,
    category: "product",
    topics: [
      {
        id: "vision-framework",
        title: "Product Vision Framework",
        description: "Creating compelling product visions that guide decision-making",
        duration: "45 min",
        type: "video",
        completed: true,
        content: "Learn the essential components of a strong product vision including customer needs, market opportunity, and competitive differentiation. We'll cover frameworks like the Product Vision Board and how to communicate vision effectively across stakeholders."
      },
      {
        id: "strategy-canvas",
        title: "Strategy Canvas & Business Model",
        description: "Understanding business models and strategic positioning",
        duration: "60 min",
        type: "article",
        completed: true,
        content: "Explore how to use strategy canvas to map out your product's value proposition, key partnerships, cost structure, and revenue streams. Learn to identify strategic opportunities and threats in your market."
      },
      {
        id: "roadmap-planning",
        title: "Roadmap Planning & Prioritization",
        description: "Building effective product roadmaps with clear priorities",
        duration: "50 min",
        type: "exercise",
        completed: false,
        content: "Master the art of roadmap creation using frameworks like RICE, Value vs Effort, and OKRs. Learn to balance customer needs, business objectives, and technical constraints while maintaining flexibility."
      }
    ]
  },
  {
    id: "user-research",
    title: "User Research & Analytics",
    description: "Master data-driven decision making through user research and analytics",
    icon: BarChart3,
    duration: "5 hours",
    difficulty: "Intermediate",
    progress: 40,
    category: "product",
    topics: [
      {
        id: "research-methods",
        title: "Research Methods & User Interviews",
        description: "Conducting effective user research to validate assumptions",
        duration: "55 min",
        type: "video",
        completed: true,
        content: "Learn qualitative and quantitative research methods including user interviews, surveys, usability testing, and A/B testing. Understand when to use each method and how to avoid common biases."
      },
      {
        id: "analytics-frameworks",
        title: "Product Analytics & Metrics",
        description: "Setting up analytics and defining success metrics",
        duration: "50 min",
        type: "article",
        completed: false,
        content: "Discover how to implement product analytics, define KPIs, and create dashboards that drive decision-making. Cover acquisition, activation, retention, referral, and revenue metrics."
      }
    ]
  },
  
  // Program Management
  {
    id: "program-execution",
    title: "Program Execution & Delivery",
    description: "Execute complex programs with multiple stakeholders and dependencies",
    icon: Network,
    duration: "7 hours",
    difficulty: "Advanced",
    progress: 25,
    category: "program",
    topics: [
      {
        id: "program-planning",
        title: "Program Planning & Architecture",
        description: "Breaking down complex programs into manageable workstreams",
        duration: "60 min",
        type: "video",
        completed: true,
        content: "Learn to decompose large-scale programs into workstreams, identify dependencies, and create execution plans. Cover work breakdown structures, critical path analysis, and risk assessment."
      },
      {
        id: "stakeholder-management",
        title: "Stakeholder Management & Communication",
        description: "Managing diverse stakeholders and driving alignment",
        duration: "45 min",
        type: "article",
        completed: false,
        content: "Master stakeholder mapping, influence strategies, and communication frameworks. Learn to build consensus, manage conflicts, and keep programs on track through effective relationship management."
      }
    ]
  },
  {
    id: "systems-design",
    title: "Systems Design for TPMs",
    description: "Technical system design principles for program managers",
    icon: Monitor,
    duration: "8 hours",
    difficulty: "Advanced",
    progress: 15,
    category: "program",
    topics: [
      {
        id: "architecture-patterns",
        title: "System Architecture Patterns",
        description: "Understanding scalable system architectures",
        duration: "75 min",
        type: "video",
        completed: false,
        content: "Explore microservices, distributed systems, APIs, and cloud architectures. Learn to evaluate trade-offs between different architectural approaches and their impact on program execution."
      },
      {
        id: "technical-risks",
        title: "Technical Risk Assessment",
        description: "Identifying and mitigating technical risks in programs",
        duration: "40 min",
        type: "exercise",
        completed: false,
        content: "Develop skills to assess technical feasibility, identify potential bottlenecks, and create mitigation strategies for complex technical programs."
      }
    ]
  },

  // Engineering Management
  {
    id: "team-leadership",
    title: "Engineering Team Leadership",
    description: "Building and leading high-performing engineering teams",
    icon: Users,
    duration: "6 hours",
    difficulty: "Intermediate",
    progress: 55,
    category: "engineering",
    topics: [
      {
        id: "team-building",
        title: "Building High-Performance Teams",
        description: "Creating psychological safety and team dynamics",
        duration: "50 min",
        type: "video",
        completed: true,
        content: "Learn the fundamentals of team formation, establishing psychological safety, and creating an environment where engineers can do their best work. Cover team topology and communication patterns."
      },
      {
        id: "performance-coaching",
        title: "Performance Management & Coaching",
        description: "Developing engineers and managing performance",
        duration: "55 min",
        type: "article",
        completed: false,
        content: "Master one-on-one meetings, goal setting, performance reviews, and career development conversations. Learn to provide constructive feedback and support engineer growth."
      }
    ]
  },
  {
    id: "technical-leadership",
    title: "Technical Leadership & Architecture",
    description: "Leading technical decisions and system architecture",
    icon: Code,
    duration: "7 hours",
    difficulty: "Advanced",
    progress: 30,
    category: "engineering",
    topics: [
      {
        id: "tech-strategy",
        title: "Technical Strategy & Roadmaps",
        description: "Creating technical roadmaps aligned with business goals",
        duration: "60 min",
        type: "video",
        completed: true,
        content: "Learn to balance technical debt, new feature development, and platform investments. Create technical roadmaps that support business objectives while maintaining system health."
      },
      {
        id: "architecture-decisions",
        title: "Architecture Decision Making",
        description: "Making sound technical architecture decisions",
        duration: "45 min",
        type: "exercise",
        completed: false,
        content: "Develop frameworks for evaluating technical alternatives, documenting decisions, and communicating technical trade-offs to stakeholders."
      }
    ]
  },

  // Business Analytics
  {
    id: "probability-stats",
    title: "Probability & Statistics",
    description: "Foundation of statistical thinking for business analytics",
    icon: Calculator,
    duration: "10 hours",
    difficulty: "Beginner",
    progress: 80,
    category: "analytics",
    topics: [
      {
        id: "probability-basics",
        title: "Probability Fundamentals",
        description: "Basic probability concepts and distributions",
        duration: "90 min",
        type: "video",
        completed: true,
        content: "Master probability theory including conditional probability, Bayes' theorem, and common probability distributions. Learn applications in business decision-making and risk assessment."
      },
      {
        id: "statistical-inference",
        title: "Statistical Inference & Hypothesis Testing",
        description: "Drawing conclusions from data using statistical methods",
        duration: "75 min",
        type: "article",
        completed: true,
        content: "Learn hypothesis testing, confidence intervals, p-values, and statistical significance. Understand how to design experiments and interpret results in business contexts."
      },
      {
        id: "stats-practice",
        title: "Statistics Practice Problems",
        description: "Apply statistical concepts to real business scenarios",
        duration: "60 min",
        type: "quiz",
        completed: false,
        content: "Practice statistical analysis with real-world business problems including A/B testing, customer segmentation, and performance metrics analysis."
      }
    ]
  },
  {
    id: "python-analytics",
    title: "Python for Analytics",
    description: "Python programming for data analysis and visualization",
    icon: Code,
    duration: "12 hours",
    difficulty: "Intermediate",
    progress: 35,
    category: "analytics",
    topics: [
      {
        id: "python-basics",
        title: "Python Fundamentals",
        description: "Core Python concepts for data analysis",
        duration: "120 min",
        type: "video",
        completed: true,
        content: "Learn Python syntax, data types, control structures, and functions. Focus on pandas, numpy, and matplotlib libraries essential for data analysis."
      },
      {
        id: "data-manipulation",
        title: "Data Manipulation with Pandas",
        description: "Advanced data cleaning and transformation techniques",
        duration: "90 min",
        type: "exercise",
        completed: false,
        content: "Master data cleaning, merging, grouping, and transformation using pandas. Learn to handle missing data, outliers, and prepare data for analysis."
      }
    ]
  },
  {
    id: "machine-learning",
    title: "Machine Learning Fundamentals",
    description: "Introduction to machine learning concepts and applications",
    icon: Brain,
    duration: "15 hours",
    difficulty: "Intermediate",
    progress: 20,
    category: "analytics",
    topics: [
      {
        id: "ml-concepts",
        title: "Machine Learning Concepts",
        description: "Understanding different types of ML algorithms",
        duration: "75 min",
        type: "video",
        completed: true,
        content: "Explore supervised, unsupervised, and reinforcement learning. Understand when to use classification, regression, clustering, and recommendation systems."
      },
      {
        id: "model-evaluation",
        title: "Model Evaluation & Validation",
        description: "Assessing model performance and avoiding overfitting",
        duration: "60 min",
        type: "article",
        completed: false,
        content: "Learn cross-validation, performance metrics, and techniques to ensure your models generalize well to new data."
      }
    ]
  },
  {
    id: "financial-analytics",
    title: "Financial Analytics",
    description: "Financial modeling and analysis for business decisions",
    icon: DollarSign,
    duration: "8 hours",
    difficulty: "Intermediate",
    progress: 10,
    category: "analytics",
    topics: [
      {
        id: "financial-metrics",
        title: "Key Financial Metrics",
        description: "Understanding ROI, NPV, IRR, and other financial indicators",
        duration: "50 min",
        type: "video",
        completed: false,
        content: "Master essential financial metrics for evaluating business performance and investment decisions. Learn to calculate and interpret profitability ratios."
      },
      {
        id: "forecasting",
        title: "Financial Forecasting & Modeling",
        description: "Building financial models for planning and analysis",
        duration: "70 min",
        type: "exercise",
        completed: false,
        content: "Create financial forecasts, scenario analysis, and sensitivity models to support strategic business decisions."
      }
    ]
  }
];

export default function Learning() {
  const [location, setLocation] = useLocation();
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const categories = [
    { id: "all", name: "All Courses", icon: BookOpen },
    { id: "product", name: "Product Management", icon: Target },
    { id: "program", name: "Program Management", icon: Network },
    { id: "engineering", name: "Engineering Management", icon: Code },
    { id: "analytics", name: "Business Analytics", icon: BarChart3 }
  ];

  const filteredModules = activeCategory === "all" 
    ? learningModules 
    : learningModules.filter(module => module.category === activeCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-blue-100 text-blue-800";
      case "Advanced": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return PlayCircle;
      case "article": return FileText;
      case "exercise": return Code;
      case "quiz": return CheckCircle;
      default: return BookOpen;
    }
  };

  const completeCurrentTopic = () => {
    if (selectedTopic && selectedModule) {
      // In a real app, this would update the backend
      selectedTopic.completed = true;
      
      // Move to next topic if available
      const currentIndex = selectedModule.topics.findIndex(t => t.id === selectedTopic.id);
      if (currentIndex < selectedModule.topics.length - 1) {
        setSelectedTopic(selectedModule.topics[currentIndex + 1]);
      }
    }
  };

  if (selectedModule && selectedTopic) {
    // Topic Content View
    const TypeIcon = getTypeIcon(selectedTopic.type);
    const currentTopicIndex = selectedModule.topics.findIndex(t => t.id === selectedTopic.id);
    const nextTopic = currentTopicIndex < selectedModule.topics.length - 1 
      ? selectedModule.topics[currentTopicIndex + 1] 
      : null;

    return (
      <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: "'Source Sans Pro', 'Roboto', sans-serif" }}>
        <Header />
        
        {/* Content Area */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 h-screen sticky top-0">
            <div className="p-6">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSelectedTopic(null);
                  setSelectedModule(null);
                }}
                className="mb-4 text-[#455A64]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Modules
              </Button>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#263238] mb-2">{selectedModule.title}</h2>
                <div className="flex items-center gap-2 text-sm text-[#455A64] mb-4">
                  <Clock className="h-4 w-4" />
                  {selectedModule.duration}
                  <Badge className={getDifficultyColor(selectedModule.difficulty)}>
                    {selectedModule.difficulty}
                  </Badge>
                </div>
                <Progress value={selectedModule.progress} className="h-2" />
                <p className="text-xs text-[#455A64] mt-1">{selectedModule.progress}% complete</p>
              </div>

              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2">
                  {selectedModule.topics.map((topic, index) => {
                    const TopicIcon = getTypeIcon(topic.type);
                    return (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedTopic.id === topic.id
                            ? "bg-[#2962FF] text-white"
                            : "bg-gray-50 hover:bg-gray-100 text-[#263238]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {topic.completed ? (
                              <CheckCircle className="h-4 w-4 text-[#00BFA5]" />
                            ) : (
                              <TopicIcon className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm mb-1">{topic.title}</p>
                            <p className={`text-xs ${
                              selectedTopic.id === topic.id ? "text-blue-100" : "text-[#455A64]"
                            }`}>
                              {topic.duration}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <TypeIcon className="h-6 w-6 text-[#2962FF]" />
                  <div>
                    <h1 className="text-2xl font-bold text-[#263238]">{selectedTopic.title}</h1>
                    <p className="text-[#455A64] mt-1">{selectedTopic.description}</p>
                  </div>
                  {selectedTopic.completed && (
                    <Badge className="bg-[#00BFA5] text-white ml-auto">
                      Completed
                    </Badge>
                  )}
                </div>

                <div className="prose max-w-none">
                  <div className="text-[#263238] leading-relaxed text-base">
                    {selectedTopic.content}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <div className="text-sm text-[#455A64]">
                    Duration: {selectedTopic.duration}
                  </div>
                  
                  <div className="flex gap-3">
                    {!selectedTopic.completed && (
                      <Button
                        onClick={completeCurrentTopic}
                        className="bg-[#00BFA5] hover:bg-[#00ACC1] text-white"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Complete
                      </Button>
                    )}
                    
                    {nextTopic && (
                      <Button
                        onClick={() => setSelectedTopic(nextTopic)}
                        className="bg-[#2962FF] hover:bg-[#1E88E5] text-white"
                      >
                        Next Topic
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedModule) {
    // Module Overview
    const ModuleIcon = selectedModule.icon;
    
    return (
      <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: "'Source Sans Pro', 'Roboto', sans-serif" }}>
        <Header />
        
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedModule(null)}
            className="mb-6 text-[#455A64]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Modules
          </Button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="bg-[#2962FF]/10 p-4 rounded-lg">
                <ModuleIcon className="h-12 w-12 text-[#2962FF]" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#263238] mb-2">{selectedModule.title}</h1>
                <p className="text-lg text-[#455A64] mb-4">{selectedModule.description}</p>
                
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2 text-[#455A64]">
                    <Clock className="h-4 w-4" />
                    {selectedModule.duration}
                  </div>
                  <Badge className={getDifficultyColor(selectedModule.difficulty)}>
                    {selectedModule.difficulty}
                  </Badge>
                  <div className="flex items-center gap-2 text-[#455A64]">
                    <Award className="h-4 w-4" />
                    {selectedModule.topics.filter(t => t.completed).length} / {selectedModule.topics.length} completed
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-[#455A64] mb-2">
                    <span>Progress</span>
                    <span>{selectedModule.progress}%</span>
                  </div>
                  <Progress value={selectedModule.progress} className="h-3" />
                </div>

                <Button 
                  onClick={() => setSelectedTopic(selectedModule.topics[0])}
                  className="bg-[#2962FF] hover:bg-[#1E88E5] text-white"
                >
                  Start Learning
                  <PlayCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Topics List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-[#263238] mb-6">Course Content</h2>
            
            <div className="space-y-4">
              {selectedModule.topics.map((topic, index) => {
                const TopicIcon = getTypeIcon(topic.type);
                
                return (
                  <div
                    key={topic.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {topic.completed ? (
                          <CheckCircle className="h-5 w-5 text-[#00BFA5]" />
                        ) : (
                          <TopicIcon className="h-5 w-5 text-[#455A64]" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#263238] mb-1">{topic.title}</h3>
                        <p className="text-[#455A64] text-sm mb-2">{topic.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-[#455A64]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {topic.duration}
                          </span>
                          <span className="capitalize">{topic.type}</span>
                          {topic.completed && (
                            <Badge className="bg-[#00BFA5] text-white text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-[#455A64] flex-shrink-0 mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Learning Dashboard
  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: "'Source Sans Pro', 'Roboto', sans-serif" }}>
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-lg font-bold text-[#263238] mb-6">Learning Paths</h2>
            
            <div className="space-y-2">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeCategory === category.id
                        ? "bg-[#2962FF] text-white"
                        : "text-[#455A64] hover:bg-gray-50"
                    }`}
                  >
                    <CategoryIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#263238] mb-2">
                {activeCategory === "all" ? "All Learning Modules" : categories.find(c => c.id === activeCategory)?.name}
              </h1>
              <p className="text-[#455A64]">
                Comprehensive courses designed by industry experts to advance your career
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredModules.map((module) => {
                const ModuleIcon = module.icon;
                const completedTopics = module.topics.filter(t => t.completed).length;
                
                return (
                  <Card 
                    key={module.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border-gray-200"
                    onClick={() => setSelectedModule(module)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#2962FF]/10 p-3 rounded-lg">
                          <ModuleIcon className="h-6 w-6 text-[#2962FF]" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-[#263238] mb-2">{module.title}</CardTitle>
                          <Badge className={getDifficultyColor(module.difficulty)}>
                            {module.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-[#455A64] text-sm mb-4">{module.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-[#455A64]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {module.duration}
                          </span>
                          <span>{completedTopics} / {module.topics.length} topics</span>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs text-[#455A64] mb-1">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-4 bg-[#2962FF] hover:bg-[#1E88E5] text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModule(module);
                        }}
                      >
                        {module.progress > 0 ? "Continue Learning" : "Start Course"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}