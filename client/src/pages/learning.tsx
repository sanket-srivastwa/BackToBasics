import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
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
  Settings,
  MessageSquare,
  BarChart3,
  Zap,
  GitBranch,
  Shield,
  Layers,
  Globe,
  Database,
  Search,
  Send,
  ChevronDown,
  ChevronRight,
  Bot,
  User,
  Star,
  Award,
  Calendar,
  Monitor,
  Network,
  Briefcase
} from "lucide-react";

interface LearningContent {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  objectives: string[];
  prerequisites: string[];
  modules: Array<{
    id: string;
    title: string;
    duration: string;
    topics: string[];
    keySkills: string[];
    practicalExercises: string[];
  }>;
  concepts: Array<{ title: string; explanation: string }>;
  examples: Array<{ scenario: string; solution: string }>;
  exercises: string[];
  resources: Array<{ title: string; type: string; description: string; url?: string }>;
  assessment: Array<{ question: string; answer: string }>;
  certification: {
    available: boolean;
    requirements: string[];
    skills: string[];
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AISearchProps {
  onQuestionSelect?: (question: string) => void;
}

// AI Learning Assistant Component
function AILearningAssistant({ onQuestionSelect }: AISearchProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const aiSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await fetch('/api/ai/learning-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'API request failed' }));
        if (response.status === 429 || errorData.error?.includes('quota')) {
          throw new Error('Our AI assistant is currently at capacity. Please try again in a few minutes, or explore our comprehensive learning materials below.');
        }
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      return response.json();
    },
    onSuccess: (data, query) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        role: 'assistant',
        content: data.response || 'I apologize, but I couldn\'t generate a response. Please try rephrasing your question.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    },
    onError: (error: Error) => {
      setIsTyping(false);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        role: 'assistant', 
        content: error.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "AI Assistant Unavailable",
        description: "Please explore our comprehensive learning materials below while our AI assistant is at capacity.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    aiSearchMutation.mutate(inputMessage.trim());
    setInputMessage("");
  };

  const quickQuestions = [
    "How do I prioritize competing product requirements?",
    "What's the difference between TPM and PM roles?",
    "How do I manage technical debt effectively?",
    "What are key engineering management frameworks?",
    "How do I conduct effective stakeholder meetings?",
    "What metrics should I track for team performance?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    if (onQuestionSelect) {
      onQuestionSelect(question);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Learning Assistant</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ask any question about management practices, frameworks, or career advice</p>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-left justify-start h-auto p-3 text-xs"
              onClick={() => handleQuickQuestion(question)}
            >
              <MessageSquare className="w-3 h-3 mr-2 flex-shrink-0" />
              <span className="truncate">{question}</span>
            </Button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask anything about management, leadership, or career development..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
            disabled={aiSearchMutation.isPending}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || aiSearchMutation.isPending}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      {messages.length > 0 && (
        <ScrollArea className="h-96 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

// Course Content Component 
function CourseContent({ track, module }: { track: string; module: string }) {
  const getStaticContent = (track: string, module: string): LearningContent | null => {
    const contentMap: { [key: string]: { [key: string]: LearningContent } } = {
      "tpm": {
        "TPM Foundations": {
          title: "Technical Program Management Foundations",
          description: "Master the fundamentals of technical program management, from role clarity to cross-functional leadership and technical planning.",
          duration: "6-8 weeks",
          difficulty: "Beginner to Intermediate",
          prerequisites: ["Basic understanding of software development", "Some project management experience helpful"],
          modules: [
            {
              id: "tpm-001",
              title: "TPM Role & Responsibilities",
              duration: "1 week",
              topics: ["Role definition", "TPM vs PM vs TL", "Career progression", "Day-to-day activities"],
              keySkills: ["Role clarity", "Career planning", "Expectation setting"],
              practicalExercises: ["Role comparison analysis", "Career roadmap creation", "Skill gap assessment"]
            },
            {
              id: "tpm-002", 
              title: "Cross-Functional Leadership",
              duration: "2 weeks",
              topics: ["Leading without authority", "Influence techniques", "Team dynamics", "Conflict resolution"],
              keySkills: ["Influencing", "Team leadership", "Conflict management", "Communication"],
              practicalExercises: ["Stakeholder mapping", "Influence strategy development", "Team assessment"]
            },
            {
              id: "tpm-003",
              title: "Technical Planning & Execution",
              duration: "2 weeks", 
              topics: ["Project scoping", "Technical dependencies", "Risk assessment", "Milestone planning"],
              keySkills: ["Technical planning", "Risk management", "Timeline estimation", "Dependency mapping"],
              practicalExercises: ["Project plan creation", "Risk register development", "Dependency analysis"]
            },
            {
              id: "tpm-004",
              title: "Stakeholder Management",
              duration: "1-2 weeks",
              topics: ["Executive communication", "Status reporting", "Meeting facilitation", "Decision making"],
              keySkills: ["Executive presence", "Communication", "Facilitation", "Decision frameworks"],
              practicalExercises: ["Executive presentation", "Status report writing", "Meeting facilitation practice"]
            }
          ],
          objectives: [
            "Understand the role of a Technical Program Manager and career progression paths",
            "Learn cross-functional team coordination and leadership without authority",
            "Master stakeholder communication strategies and executive presence",
            "Apply project planning and execution frameworks for technical initiatives"
          ],
          concepts: [
            { 
              title: "Role Definition & Scope", 
              explanation: "TPMs bridge technical and business teams, driving complex technical initiatives across multiple teams and stakeholders. They focus on program-level coordination, technical planning, and risk management while ensuring delivery excellence."
            },
            { 
              title: "Cross-functional Leadership", 
              explanation: "Lead without authority by building relationships, facilitating decisions, and aligning teams toward common goals. Use influence techniques, clear communication, and collaborative problem-solving to drive results."
            },
            { 
              title: "Technical Depth & Planning", 
              explanation: "Maintain sufficient technical knowledge to understand trade-offs, risks, and dependencies in complex systems. Apply systematic planning approaches to break down complex technical initiatives."
            },
            {
              title: "Stakeholder Communication",
              explanation: "Develop executive presence and clear communication strategies. Create compelling narratives, manage up effectively, and facilitate productive cross-team discussions."
            }
          ],
          examples: [
            {
              scenario: "Managing a microservices migration across 8 teams with tight deadline",
              solution: "Create detailed dependency mapping, establish migration phases with clear success criteria, coordinate team schedules with buffer time, implement daily standups and weekly stakeholder updates, and track progress with automated metrics dashboard."
            },
            {
              scenario: "Cross-team API standardization initiative with resistance from legacy teams",
              solution: "Conduct stakeholder interviews to understand concerns, create migration timeline with incremental adoption, establish API design standards committee, provide training and support resources, and implement pilot program with early adopters."
            }
          ],
          exercises: [
            "Design a comprehensive project plan for API versioning across 15 services",
            "Create a stakeholder communication matrix for a major infrastructure upgrade",
            "Develop a risk management framework for a complex technical migration",
            "Build an influence strategy for driving adoption of new technical standards"
          ],
          resources: [
            { title: "TPM Career Guide", type: "Guide", description: "Comprehensive guide to TPM roles, responsibilities, and career progression", url: "#" },
            { title: "Cross-Functional Leadership Toolkit", type: "Toolkit", description: "Templates and frameworks for leading without authority", url: "#" },
            { title: "Technical Planning Templates", type: "Templates", description: "Project planning, risk assessment, and communication templates", url: "#" },
            { title: "Stakeholder Management Best Practices", type: "Best Practices", description: "Proven strategies for effective stakeholder engagement", url: "#" }
          ],
          assessment: [
            { question: "What are the key responsibilities of a TPM compared to a PM?", answer: "TPMs focus on technical program coordination, architecture alignment, and engineering team coordination, while PMs focus on product strategy, market requirements, and customer needs. TPMs drive technical execution while PMs drive product direction." },
            { question: "How do you influence without authority in cross-functional teams?", answer: "Build relationships, understand stakeholder motivations, create compelling shared vision, use data-driven arguments, facilitate collaborative decision-making, and establish clear accountability and communication processes." }
          ],
          certification: {
            available: true,
            requirements: ["Complete all 4 modules", "Pass assessment with 80% score", "Submit capstone project plan", "Peer review participation"],
            skills: ["Technical program management", "Cross-functional leadership", "Stakeholder communication", "Technical planning"]
          }
        }
      },
      "pm": {
        "Product Strategy": {
          title: "Product Strategy Fundamentals",
          description: "Build comprehensive product strategy skills from vision development to market analysis and competitive positioning.",
          duration: "4-6 weeks",
          difficulty: "Intermediate",
          prerequisites: ["Basic business understanding", "Customer empathy", "Data analysis skills"],
          modules: [
            {
              id: "pm-001",
              title: "Product Vision & Mission",
              duration: "1 week",
              topics: ["Vision crafting", "Mission alignment", "Value propositions", "North star metrics"],
              keySkills: ["Strategic thinking", "Vision communication", "Goal setting"],
              practicalExercises: ["Vision statement creation", "Mission alignment workshop", "Value prop canvas"]
            },
            {
              id: "pm-002",
              title: "Market Analysis & Research",
              duration: "2 weeks",
              topics: ["Market sizing", "Customer segmentation", "Competitive analysis", "User research"],
              keySkills: ["Market research", "Data analysis", "Customer insights", "Competitive intelligence"],
              practicalExercises: ["TAM/SAM/SOM analysis", "Persona development", "Competitive positioning map"]
            },
            {
              id: "pm-003",
              title: "Product Roadmapping",
              duration: "2 weeks",
              topics: ["Roadmap frameworks", "Priority setting", "Resource allocation", "Timeline planning"],
              keySkills: ["Strategic planning", "Prioritization", "Communication", "Stakeholder alignment"],
              practicalExercises: ["Roadmap creation", "Priority matrix development", "Stakeholder presentation"]
            }
          ],
          objectives: [
            "Develop product vision and strategy frameworks",
            "Learn market analysis and customer research techniques", 
            "Master product roadmapping and prioritization",
            "Understand competitive positioning and differentiation"
          ],
          concepts: [
            { 
              title: "Product Vision", 
              explanation: "A clear, inspiring picture of what the product will achieve for users and the business in the future. Should be aspirational yet achievable, customer-focused, and aligned with company strategy."
            },
            { 
              title: "Market Analysis", 
              explanation: "Understanding market size, customer segments, competitive landscape, and growth opportunities through data-driven research and customer insights."
            },
            {
              title: "Product-Market Fit",
              explanation: "The degree to which a product satisfies strong market demand. Achieved when target customers are buying, using, and telling others about your product."
            }
          ],
          examples: [
            {
              scenario: "Defining strategy for a new social media feature with limited resources",
              solution: "Conduct targeted user research, analyze competitor features, define clear success metrics, create MVP scope, and develop phased rollout plan with feedback loops."
            }
          ],
          exercises: [
            "Create a comprehensive product strategy for entering a new market segment",
            "Develop a competitive analysis framework and apply it to your product space",
            "Build a customer persona based on research and data"
          ],
          resources: [
            { title: "Product Strategy Templates", type: "Template", description: "Ready-to-use frameworks for strategy development", url: "#" },
            { title: "Market Research Toolkit", type: "Toolkit", description: "Complete guide to market analysis and customer research", url: "#" }
          ],
          assessment: [
            { question: "What components make up a strong product strategy?", answer: "Vision, market analysis, competitive positioning, customer insights, success metrics, and clear roadmap with prioritized initiatives." }
          ],
          certification: {
            available: true,
            requirements: ["Complete all 3 modules", "Pass strategy assessment", "Create product strategy presentation"],
            skills: ["Product strategy", "Market analysis", "Roadmapping", "Competitive positioning"]
          }
        }
      },
      "em": {
        "Engineering Leadership": {
          title: "Engineering Management Foundations",
          description: "Essential skills for leading engineering teams, from technical leadership to people management and organizational effectiveness.",
          duration: "6-8 weeks", 
          difficulty: "Intermediate to Advanced",
          prerequisites: ["Software engineering experience", "Team collaboration experience", "Basic understanding of SDLC"],
          modules: [
            {
              id: "em-001",
              title: "Technical Leadership",
              duration: "2 weeks",
              topics: ["Architecture decisions", "Code quality", "Technical debt management", "System design"],
              keySkills: ["Technical decision making", "Architecture planning", "Quality standards", "Technology evaluation"],
              practicalExercises: ["Architecture review process", "Technical debt assessment", "Technology evaluation framework"]
            },
            {
              id: "em-002",
              title: "People Management",
              duration: "2 weeks",
              topics: ["1:1 meetings", "Performance management", "Career development", "Team dynamics"],
              keySkills: ["Coaching", "Performance evaluation", "Career planning", "Conflict resolution"],
              practicalExercises: ["1:1 template creation", "Performance review process", "Career ladder development"]
            },
            {
              id: "em-003", 
              title: "Team Productivity & Culture",
              duration: "2 weeks",
              topics: ["Agile practices", "Team processes", "Culture building", "Innovation management"],
              keySkills: ["Process optimization", "Culture development", "Team building", "Innovation facilitation"],
              practicalExercises: ["Process improvement plan", "Culture assessment", "Innovation workshop design"]
            }
          ],
          objectives: [
            "Develop technical leadership and architecture decision-making skills",
            "Learn people management and team development techniques",
            "Master team productivity optimization and culture building",
            "Apply engineering management frameworks and best practices"
          ],
          concepts: [
            {
              title: "Technical Leadership",
              explanation: "Guiding technical decisions, architecture choices, and engineering practices while balancing innovation with reliability and maintainability."
            },
            {
              title: "People Management",
              explanation: "Supporting individual growth, managing performance, and creating conditions for engineers to do their best work through coaching and development."
            },
            {
              title: "Team Effectiveness",
              explanation: "Building high-performing teams through clear processes, strong culture, effective communication, and continuous improvement practices."
            }
          ],
          examples: [
            {
              scenario: "Managing a team transition from monolith to microservices while maintaining feature velocity",
              solution: "Create incremental migration plan, establish architecture review process, provide training and mentorship, set up monitoring and rollback procedures, and maintain regular team communication about progress and challenges."
            }
          ],
          exercises: [
            "Design a technical decision-making framework for your team",
            "Create a comprehensive onboarding plan for new engineering hires",
            "Develop a process for managing technical debt while delivering features"
          ],
          resources: [
            { title: "Engineering Management Handbook", type: "Guide", description: "Comprehensive guide to engineering leadership", url: "#" },
            { title: "Technical Decision Templates", type: "Templates", description: "Frameworks for architecture and technical decisions", url: "#" }
          ],
          assessment: [
            { question: "How do you balance technical debt with feature delivery?", answer: "Establish technical debt visibility through metrics, allocate dedicated time for improvements, prioritize based on business impact, and communicate trade-offs clearly to stakeholders." }
          ],
          certification: {
            available: true,
            requirements: ["Complete all 3 modules", "Leadership assessment", "Team improvement project", "Peer feedback"],
            skills: ["Technical leadership", "People management", "Team productivity", "Engineering culture"]
          }
        }
      }
    };

    return contentMap[track]?.[module] || null;
  };

  const content = getStaticContent(track, module);

  if (!content) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-6">
          <div className="text-gray-600 text-center">
            <h3 className="font-semibold mb-2">Content Coming Soon</h3>
            <p className="text-sm">This module content is being developed and will be available soon.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Overview */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{content.title}</CardTitle>
              <CardDescription className="text-base">{content.description}</CardDescription>
            </div>
            {content.certification.available && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Award className="w-3 h-3 mr-1" />
                Certificate Available
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{content.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{content.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{content.modules.length} Modules</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Course Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Course Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {content.modules.map((module, idx) => (
              <Card key={module.id} className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{idx + 1}. {module.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {module.keySkills.length} Skills
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Topics Covered:</h5>
                      <div className="flex flex-wrap gap-2">
                        {module.topics.map((topic, topicIdx) => (
                          <Badge key={topicIdx} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Key Skills:</h5>
                      <div className="flex flex-wrap gap-2">
                        {module.keySkills.map((skill, skillIdx) => (
                          <Badge key={skillIdx} className="bg-blue-100 text-blue-800 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm mb-2">Practical Exercises:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {module.practicalExercises.map((exercise, exerciseIdx) => (
                          <li key={exerciseIdx} className="flex items-start">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                            {exercise}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {content.objectives.map((objective, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Key Concepts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {content.concepts.map((concept, idx) => (
              <AccordionItem key={idx} value={`concept-${idx}`}>
                <AccordionTrigger className="text-left">{concept.title}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-700 leading-relaxed">{concept.explanation}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Practical Examples */}
      {content.examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Real-World Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {content.examples.map((example, idx) => (
                <Card key={idx} className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Scenario:
                        </h5>
                        <p className="text-sm text-blue-700">{example.scenario}</p>
                      </div>
                      <Separator className="bg-blue-200" />
                      <div>
                        <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Solution Approach:
                        </h5>
                        <p className="text-sm text-blue-700">{example.solution}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certification */}
      {content.certification.available && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Award className="w-5 h-5" />
              Professional Certification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Requirements:</h5>
                <ul className="space-y-1">
                  {content.certification.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Skills Certified:</h5>
                <div className="flex flex-wrap gap-2">
                  {content.certification.skills.map((skill, idx) => (
                    <Badge key={idx} className="bg-yellow-200 text-yellow-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Learning() {
  const [location, navigate] = useLocation();
  const [selectedTrack, setSelectedTrack] = useState("tpm");
  const [selectedModule, setSelectedModule] = useState("TPM Foundations");

  const tracks = [
    { 
      id: "tpm", 
      name: "Technical Program Management", 
      icon: Code, 
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200" 
    },
    { 
      id: "pm", 
      name: "Product Management", 
      icon: TrendingUp, 
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200" 
    },
    { 
      id: "em", 
      name: "Engineering Management", 
      icon: Settings, 
      color: "text-purple-600",
      bgColor: "bg-purple-50", 
      borderColor: "border-purple-200"
    }
  ];

  const modules: { [key: string]: string[] } = {
    tpm: ["TPM Foundations", "Systems Design", "Technical Strategy"],
    pm: ["Product Strategy", "Analytics & Metrics", "User Research"],
    em: ["Engineering Leadership", "Team Management", "Technical Culture"]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Learning Platform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Master management skills with comprehensive courses designed for Technical Program Management, 
              Product Management, and Engineering Leadership roles.
            </p>
          </div>
        </div>

        {/* AI Learning Assistant - Prominently Featured */}
        <div className="mb-8">
          <AILearningAssistant />
        </div>

        {/* Track Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Choose Your Learning Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {tracks.map((track) => {
                const IconComponent = track.icon;
                return (
                  <Card 
                    key={track.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedTrack === track.id 
                        ? `${track.bgColor} ${track.borderColor} border-2` 
                        : "hover:shadow-md"
                    }`}
                    onClick={() => {
                      setSelectedTrack(track.id);
                      setSelectedModule(modules[track.id][0]);
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      <IconComponent className={`w-12 h-12 mx-auto mb-4 ${track.color}`} />
                      <h3 className="font-semibold text-lg mb-2">{track.name}</h3>
                      <p className="text-sm text-gray-600">
                        {track.id === "tpm" && "Lead complex technical programs across multiple teams"}
                        {track.id === "pm" && "Drive product strategy and customer-focused solutions"} 
                        {track.id === "em" && "Build and lead high-performing engineering teams"}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Module Selection and Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Module Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Modules</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {modules[selectedTrack].map((module) => (
                    <Button
                      key={module}
                      variant={selectedModule === module ? "default" : "ghost"}
                      className="w-full justify-start text-left h-auto p-4"
                      onClick={() => setSelectedModule(module)}
                    >
                      <div>
                        <div className="font-medium">{module}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {module === "TPM Foundations" && "6-8 weeks"}
                          {module === "Product Strategy" && "4-6 weeks"}
                          {module === "Engineering Leadership" && "6-8 weeks"}
                          {!["TPM Foundations", "Product Strategy", "Engineering Leadership"].includes(module) && "Coming Soon"}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Content */}
          <div className="lg:col-span-3">
            <CourseContent track={selectedTrack} module={selectedModule} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}