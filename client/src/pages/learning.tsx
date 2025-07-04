import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  ChevronRight
} from "lucide-react";

interface LearningContent {
  title: string;
  objectives: string[];
  concepts: Array<{ title: string; explanation: string }>;
  examples: Array<{ scenario: string; solution: string }>;
  exercises: string[];
  resources: Array<{ title: string; type: string; description: string }>;
  assessment: Array<{ question: string; answer: string }>;
}

function AILearningModule({ track, module }: { track: string; module: string }) {
  const { data: content, isLoading, error } = useQuery<LearningContent>({
    queryKey: [`/api/learning/${track}/${module}`],
    retry: 1,
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-red-600 text-center">
            <h3 className="font-semibold mb-2">AI Content Temporarily Unavailable</h3>
            <p className="text-sm">Due to API limitations, dynamic content cannot be generated at this time.</p>
            <p className="text-sm mt-2">Please check back later or contact support if this persists.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!content) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{content.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Learning Objectives */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Learning Objectives</h4>
            <ul className="space-y-2">
              {content.objectives?.map((objective, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Concepts */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Key Concepts</h4>
            <Accordion type="single" collapsible className="w-full">
              {content.concepts?.map((concept, idx) => (
                <AccordionItem key={idx} value={`concept-${idx}`}>
                  <AccordionTrigger>{concept.title}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">{concept.explanation}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Practical Examples */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Practical Examples</h4>
            <div className="space-y-4">
              {content.examples?.map((example, idx) => (
                <Card key={idx} className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h5 className="font-medium text-blue-800 mb-2">Scenario:</h5>
                    <p className="text-sm text-blue-700 mb-3">{example.scenario}</p>
                    <h5 className="font-medium text-blue-800 mb-2">Solution Approach:</h5>
                    <p className="text-sm text-blue-700">{example.solution}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Exercises */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Practice Exercises</h4>
            <div className="space-y-2">
              {content.exercises?.map((exercise, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-primary">
                  <p className="text-sm">{exercise}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Recommended Resources</h4>
            <div className="grid gap-3">
              {content.resources?.map((resource, idx) => (
                <Card key={idx} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{resource.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                      </div>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AISearchComponent({ initialQuery = "" }: { initialQuery?: string }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-search if initial query is provided
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      const performInitialSearch = async () => {
        setIsLoading(true);
        const userMessage = { role: 'user' as const, content: initialQuery };
        setConversation([userMessage]);
        
        try {
          const response = await fetch('/api/learning/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: initialQuery })
          });
          
          const data = await response.json();
          
          if (response.ok) {
            setConversation(prev => [...prev, { role: 'assistant', content: data.response }]);
          } else {
            setConversation(prev => [...prev, { 
              role: 'assistant', 
              content: 'I apologize, but I cannot generate responses right now due to API limitations. Please try again later.' 
            }]);
          }
        } catch (error) {
          setConversation(prev => [...prev, { 
            role: 'assistant', 
            content: 'I encountered an error while processing your question. Please try again.' 
          }]);
        }
        
        setIsLoading(false);
      };
      
      performInitialSearch();
    }
  }, [initialQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    const userMessage = { role: 'user' as const, content: searchQuery };
    setConversation(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('/api/learning/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setConversation(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setConversation(prev => [...prev, { 
          role: 'assistant', 
          content: 'I apologize, but I cannot generate responses right now due to API limitations. Please try again later.' 
        }]);
      }
    } catch (error) {
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: 'I encountered an error while processing your question. Please try again.' 
      }]);
    }
    
    setSearchQuery("");
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="w-5 h-5 mr-2" />
          AI Learning Assistant
        </CardTitle>
        <CardDescription>
          Ask any questions about management, leadership, or technical concepts. I'll provide detailed explanations and examples.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Conversation History */}
        {conversation.length > 0 && (
          <div className="max-h-96 overflow-y-auto space-y-4 border rounded-lg p-4 bg-gray-50">
            {conversation.map((message, idx) => (
              <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-white border shadow-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Search Input */}
        <div className="flex space-x-2">
          <Input
            placeholder="Ask a question about management, leadership, or technical concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || !searchQuery.trim()}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "How do I prioritize features as a PM?",
            "What is technical debt in engineering?",
            "How to conduct effective 1:1 meetings?",
            "Explain the STAR method for interviews"
          ].map((question, idx) => (
            <Button 
              key={idx}
              variant="outline" 
              size="sm" 
              className="text-left justify-start h-auto py-2 px-3"
              onClick={() => setSearchQuery(question)}
              disabled={isLoading}
            >
              <MessageSquare className="w-3 h-3 mr-2 flex-shrink-0" />
              <span className="text-xs">{question}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StaticLearningContent({ track, module }: { track: string; module: string }) {
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set());

  const toggleLesson = (lessonIndex: number) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonIndex)) {
      newExpanded.delete(lessonIndex);
    } else {
      newExpanded.add(lessonIndex);
    }
    setExpandedLessons(newExpanded);
  };

  const courseContent: any = {
    tpm: {
      "TPM Foundations": {
        title: "Technical Program Management Foundations",
        description: "Master the core principles and responsibilities of Technical Program Management",
        lessons: [
          {
            title: "Understanding the TPM Role",
            duration: "15 min",
            content: `Technical Program Managers (TPMs) bridge the gap between technical teams and business objectives. Unlike Project Managers who focus on deliverables and timelines, TPMs dive deep into technical complexity and architectural decisions.

Key Responsibilities:
• Drive cross-functional technical programs from conception to launch
• Identify and mitigate technical risks before they impact delivery
• Facilitate communication between engineering, product, and leadership teams
• Make data-driven decisions on technical trade-offs and priorities

The TPM operates at the intersection of technical depth and program management excellence, requiring both engineering background and strong leadership skills.`,
            keyTakeaways: [
              "TPMs focus on technical complexity, not just project coordination",
              "Technical depth is essential for effective decision-making",
              "Cross-functional leadership is a core competency"
            ]
          },
          {
            title: "Technical Risk Management",
            duration: "20 min", 
            content: `Technical risks are the silent killers of complex programs. Effective TPMs develop systematic approaches to identify, assess, and mitigate these risks before they become critical issues.

Risk Identification Framework:
1. Architecture Reviews: Regularly assess system design decisions
2. Dependency Mapping: Identify critical path dependencies across teams
3. Capacity Planning: Ensure technical infrastructure can handle projected load
4. Security Assessments: Proactively address potential vulnerabilities

Risk Mitigation Strategies:
• Build in contingency time for complex technical work
• Establish fallback plans for critical system components
• Create technical debt budgets for sustainable development
• Implement monitoring and alerting for early risk detection`,
            keyTakeaways: [
              "Proactive risk identification prevents costly delays",
              "Technical debt must be managed as a program risk",
              "Dependencies are often the highest risk factors"
            ]
          },
          {
            title: "Stakeholder Management",
            duration: "18 min",
            content: `Technical programs involve diverse stakeholders with competing priorities. TPMs must master the art of influence without authority, building consensus across engineering, product, design, and executive teams.

Stakeholder Mapping:
• Engineering Teams: Focus on technical feasibility and implementation details
• Product Managers: Emphasize user impact and business value
• Executive Leadership: Communicate in terms of business outcomes and risks
• Design Teams: Collaborate on user experience and technical constraints

Communication Strategies:
1. Tailor your message to your audience's priorities and language
2. Use data and metrics to support technical recommendations
3. Create visual dashboards showing program health and progress
4. Establish regular communication cadences with key stakeholders`,
            keyTakeaways: [
              "Different stakeholders need different communication approaches",
              "Data-driven communication builds credibility",
              "Regular updates prevent surprises and build trust"
            ]
          }
        ]
      },
      "System Design for TPMs": {
        title: "System Design for Technical Program Managers",
        description: "Understand large-scale system architecture and design principles",
        lessons: [
          {
            title: "Scalability Fundamentals",
            duration: "25 min",
            content: `Understanding scalability is crucial for TPMs managing large-scale systems. Scalability isn't just about handling more traffic—it's about designing systems that grow efficiently with business needs.

Horizontal vs Vertical Scaling:
• Horizontal Scaling: Adding more servers to handle increased load
  - Pros: Better fault tolerance, linear cost scaling
  - Cons: Increased complexity, data consistency challenges
• Vertical Scaling: Upgrading existing server capacity
  - Pros: Simpler architecture, no distributed system complexity
  - Cons: Single point of failure, limited by hardware constraints

Design Patterns for Scale:
1. Load Balancing: Distribute traffic across multiple servers
2. Caching Strategies: Reduce database load with intelligent caching
3. Database Sharding: Distribute data across multiple database instances
4. Microservices Architecture: Break monoliths into independent services`,
            keyTakeaways: [
              "Plan for scale early in the design process",
              "Horizontal scaling provides better long-term flexibility",
              "Every scaling decision involves trade-offs"
            ]
          },
          {
            title: "Distributed Systems Challenges",
            duration: "30 min",
            content: `Distributed systems introduce complexity that TPMs must understand to make informed technical decisions. The CAP theorem and its implications shape many architectural choices.

CAP Theorem:
You can only guarantee two of three properties:
• Consistency: All nodes see the same data simultaneously
• Availability: System remains operational even with node failures
• Partition Tolerance: System continues despite network failures

Common Distributed System Patterns:
1. Event-Driven Architecture: Components communicate through events
2. CQRS (Command Query Responsibility Segregation): Separate read and write models
3. Saga Pattern: Manage distributed transactions across services
4. Circuit Breaker: Prevent cascade failures in service dependencies

Monitoring and Observability:
• Distributed Tracing: Track requests across multiple services
• Centralized Logging: Aggregate logs for system-wide visibility
• Metrics and Alerting: Proactive monitoring of system health`,
            keyTakeaways: [
              "Distributed systems require careful trade-off decisions",
              "Observability is critical for managing complexity",
              "Failure is inevitable; design for resilience"
            ]
          }
        ]
      }
    },
    pm: {
      "Product Strategy & Vision": {
        title: "Product Strategy and Vision Development", 
        description: "Learn to define winning product strategies and create compelling visions",
        lessons: [
          {
            title: "Market Analysis and Competitive Intelligence",
            duration: "22 min",
            content: `Successful product strategy starts with deep market understanding. Product managers must systematically analyze market dynamics, customer needs, and competitive landscape to identify opportunities.

Market Analysis Framework:
1. Total Addressable Market (TAM): Overall revenue opportunity
2. Serviceable Addressable Market (SAM): Market segment you can target
3. Serviceable Obtainable Market (SOM): Realistic market share achievable

Competitive Analysis:
• Direct Competitors: Products solving the same problem
• Indirect Competitors: Alternative solutions to customer problems
• Substitute Products: Different approaches to the same end goal

Customer Research Methods:
• Jobs-to-be-Done Interviews: Understand underlying customer motivations
• User Journey Mapping: Identify pain points and opportunities
• Competitive Feature Analysis: Compare capabilities and positioning`,
            keyTakeaways: [
              "Market sizing guides strategic investment decisions",
              "Indirect competition often poses the biggest threat",
              "Customer problems are more important than existing solutions"
            ]
          },
          {
            title: "Vision and Strategy Frameworks",
            duration: "25 min",
            content: `A compelling product vision aligns teams and drives decision-making. Product managers need frameworks to translate market insights into actionable strategy.

Vision Development Process:
1. Problem Definition: Clearly articulate the customer problem
2. Solution Hypothesis: Propose how your product uniquely solves it
3. Value Proposition: Define the specific value delivered to customers
4. Success Metrics: Establish measurable outcomes

Strategic Frameworks:
• North Star Framework: Single metric that captures product value
• OKRs (Objectives and Key Results): Align teams on measurable goals
• ICE Scoring: Prioritize initiatives by Impact, Confidence, Ease
• Kano Model: Categorize features by customer satisfaction impact

Communication Strategies:
• Executive Summaries: Concise strategy communication for leadership
• Team Playbooks: Detailed execution guides for development teams
• Customer-Facing Messaging: External communication of product value`,
            keyTakeaways: [
              "Great visions are customer-centric, not feature-centric",
              "Strategy frameworks provide structure for complex decisions",
              "Different audiences need different levels of detail"
            ]
          }
        ]
      }
    },
    em: {
      "People Management": {
        title: "Engineering People Management",
        description: "Build and lead high-performing engineering teams",
        lessons: [
          {
            title: "Building High-Performing Teams",
            duration: "20 min",
            content: `Engineering teams are the foundation of technical excellence. Engineering managers must create environments where engineers can do their best work while delivering business value.

Team Formation Principles:
1. Diversity of Skills: Combine senior and junior engineers for knowledge transfer
2. Clear Roles: Define responsibilities to avoid overlap and gaps
3. Psychological Safety: Create environment where people feel safe to take risks
4. Shared Purpose: Align team on mission and success metrics

Hiring Excellence:
• Technical Interviews: Assess coding skills and system design thinking
• Behavioral Interviews: Evaluate collaboration and communication
• Culture Fit: Ensure alignment with team values and working style
• Growth Potential: Look for continuous learning mindset

Team Dynamics:
• Code Review Culture: Establish constructive feedback processes
• Knowledge Sharing: Regular tech talks and documentation practices
• Mentorship Programs: Pair experienced engineers with growing talent`,
            keyTakeaways: [
              "Diverse teams outperform homogeneous ones",
              "Psychological safety is essential for innovation",
              "Culture is built through daily practices, not policies"
            ]
          },
          {
            title: "Performance Management and Growth",
            duration: "25 min",
            content: `Engineering managers must balance individual growth with team performance. This requires systematic approaches to feedback, goal setting, and career development.

Performance Framework:
1. Goal Setting: Use SMART goals aligned with business objectives
2. Regular Check-ins: Weekly 1:1s for continuous feedback and support
3. 360 Reviews: Gather feedback from peers, direct reports, and stakeholders
4. Growth Planning: Create personalized development plans for each engineer

Career Laddering:
• Individual Contributor Path: Senior Engineer → Staff → Principal
• Management Path: Team Lead → Engineering Manager → Director
• Technical Leadership: Architect → Distinguished Engineer
• Cross-functional Growth: Product-focused or Infrastructure specialist roles

Difficult Conversations:
• Performance Issues: Address problems early with specific examples
• Career Transitions: Support engineers exploring new directions
• Team Conflicts: Mediate disputes while maintaining relationships
• Compensation Discussions: Advocate for team members fairly`,
            keyTakeaways: [
              "Regular feedback prevents performance surprises",
              "Career growth requires intentional planning and investment",
              "Difficult conversations get easier with practice and preparation"
            ]
          }
        ]
      }
    }
  };

  const content = courseContent[track]?.[module];
  if (!content) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{content.title}</CardTitle>
          <CardDescription>{content.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.lessons.map((lesson: any, idx: number) => (
              <Card key={idx} className="border">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleLesson(idx)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        {expandedLessons.has(idx) ? 
                          <ChevronDown className="w-4 h-4 mr-2" /> : 
                          <ChevronRight className="w-4 h-4 mr-2" />
                        }
                        {lesson.title}
                      </CardTitle>
                      <div className="flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-500">{lesson.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {expandedLessons.has(idx) && (
                  <CardContent>
                    <div className="prose max-w-none">
                      <div className="text-gray-700 whitespace-pre-line mb-4">
                        {lesson.content}
                      </div>
                      {lesson.keyTakeaways && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">Key Takeaways:</h4>
                          <ul className="space-y-1">
                            {lesson.keyTakeaways.map((takeaway: string, takewayIdx: number) => (
                              <li key={takewayIdx} className="flex items-start text-blue-700 text-sm">
                                <CheckCircle className="w-3 h-3 mr-2 mt-1 flex-shrink-0" />
                                {takeaway}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Learning() {
  const [, setLocation] = useLocation();
  const [selectedModule, setSelectedModule] = useState<{ track: string; module: string } | null>(null);
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");

  // Handle search parameter from header
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    if (search) {
      setHeaderSearchQuery(search);
      // Clear URL parameters after extracting the search query
      window.history.replaceState({}, '', '/learning');
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAISearch, setShowAISearch] = useState(false);

  const learningTracks = {
    tpm: {
      title: "Technical Program Management",
      icon: Code,
      color: "bg-blue-600",
      description: "Master complex technical programs and lead engineering teams to success",
      totalLessons: 36,
      students: "12.5k",
      courses: [
        {
          title: "TPM Foundations",
          lessons: 8,
          duration: "2.5 hrs",
          description: "Core concepts and responsibilities of Technical Program Management",
          topics: ["Role definition", "Key responsibilities", "Success metrics", "Career progression"]
        },
        {
          title: "System Design for TPMs",
          lessons: 12,
          duration: "4 hrs",
          description: "Technical architecture and scalability considerations",
          topics: ["Distributed systems", "API design", "Database scaling", "Microservices architecture"]
        },
        {
          title: "Program Planning & Execution",
          lessons: 10,
          duration: "3 hrs",
          description: "End-to-end program management from planning to delivery",
          topics: ["Project scoping", "Resource planning", "Timeline management", "Delivery frameworks"]
        },
        {
          title: "Cross-functional Leadership",
          lessons: 6,
          duration: "2 hrs",
          description: "Leading without authority and stakeholder management",
          topics: ["Influence strategies", "Communication frameworks", "Conflict resolution", "Team alignment"]
        }
      ]
    },
    pm: {
      title: "Product Management",
      icon: TrendingUp,
      color: "bg-green-600",
      description: "Build products that customers love and drive business growth",
      totalLessons: 42,
      students: "25k",
      courses: [
        {
          title: "Product Strategy & Vision",
          lessons: 12,
          duration: "3.5 hrs",
          description: "Define winning product strategies and compelling visions",
          topics: ["Market analysis", "Competitive positioning", "Vision frameworks", "Strategy communication"]
        },
        {
          title: "User Research & Analytics",
          lessons: 10,
          duration: "3 hrs",
          description: "Data-driven product decisions and user insights",
          topics: ["User research methods", "Analytics setup", "A/B testing", "Metrics frameworks"]
        },
        {
          title: "Feature Prioritization",
          lessons: 8,
          duration: "2.5 hrs",
          description: "Frameworks for deciding what to build next",
          topics: ["Prioritization frameworks", "Impact vs effort", "Stakeholder alignment", "Roadmap planning"]
        },
        {
          title: "Product Execution",
          lessons: 12,
          duration: "3.5 hrs",
          description: "From concept to launch and beyond",
          topics: ["Development process", "Launch strategies", "Post-launch optimization", "Feature adoption"]
        }
      ]
    },
    em: {
      title: "Engineering Management",
      icon: Users,
      color: "bg-purple-600",
      description: "Lead engineering teams and drive technical excellence",
      totalLessons: 28,
      students: "8.3k",
      courses: [
        {
          title: "People Management",
          lessons: 10,
          duration: "3 hrs",
          description: "Building and leading high-performing engineering teams",
          topics: ["1:1 meetings", "Performance management", "Career development", "Team dynamics"]
        },
        {
          title: "Technical Leadership",
          lessons: 8,
          duration: "2.5 hrs",
          description: "Balancing hands-on technical work with management duties",
          topics: ["Code reviews", "Architecture decisions", "Technical debt", "Innovation time"]
        },
        {
          title: "Engineering Culture",
          lessons: 6,
          duration: "2 hrs",
          description: "Creating environments where engineers thrive",
          topics: ["Team culture", "Psychological safety", "Knowledge sharing", "Continuous learning"]
        },
        {
          title: "Project & Process Management",
          lessons: 4,
          duration: "1.5 hrs",
          description: "Optimizing engineering processes and delivery",
          topics: ["Agile practices", "Release management", "Incident response", "Process improvement"]
        }
      ]
    }
  };

  const practicalFrameworks = {
    tpm: [
      {
        title: "RICE Prioritization Framework",
        description: "Reach × Impact × Confidence ÷ Effort for feature prioritization",
        example: "Evaluating which technical improvements to tackle first"
      },
      {
        title: "Technical Debt Assessment Matrix",
        description: "Systematic approach to identifying and addressing technical debt",
        example: "Balancing new features with infrastructure improvements"
      },
      {
        title: "Cross-team Dependency Mapping",
        description: "Visualizing and managing complex project dependencies",
        example: "Coordinating microservices migration across multiple teams"
      }
    ],
    pm: [
      {
        title: "Jobs-to-be-Done Framework",
        description: "Understanding what customers are trying to accomplish",
        example: "Designing features based on user goals rather than assumptions"
      },
      {
        title: "North Star Framework",
        description: "Aligning teams around a single metric that matters most",
        example: "Using DAU growth to guide product decisions"
      },
      {
        title: "Product-Market Fit Assessment",
        description: "Measuring and optimizing for strong product-market fit",
        example: "Using retention metrics to validate product value"
      }
    ],
    em: [
      {
        title: "Engineering Ladder Framework",
        description: "Clear career progression paths for individual contributors",
        example: "Defining expectations for Senior to Staff Engineer transitions"
      },
      {
        title: "Blameless Postmortem Process",
        description: "Learning from failures without assigning blame",
        example: "Turning production incidents into learning opportunities"
      },
      {
        title: "Technical Review Process",
        description: "Structured approach to architecture and code reviews",
        example: "Ensuring code quality while maintaining development velocity"
      }
    ]
  };

  const skillAssessments = {
    tpm: [
      "System design for large-scale applications",
      "Cross-functional stakeholder management",
      "Technical risk identification and mitigation",
      "Program planning and execution"
    ],
    pm: [
      "Product strategy development",
      "User research and data analysis", 
      "Feature prioritization and roadmapping",
      "Go-to-market strategy execution"
    ],
    em: [
      "Team building and people management",
      "Technical decision making",
      "Engineering culture development",
      "Performance management and coaching"
    ]
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Learning Materials
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Comprehensive courses and frameworks for Technical Program Management, Product Management, and Engineering Management roles at top tech companies
          </p>
        </div>

        {/* AI Learning Assistant Search */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Search className="w-6 h-6 text-blue-600" />
                AI Learning Assistant
              </CardTitle>
              <CardDescription className="text-lg">
                Ask any question about management, leadership, technical concepts, or career development
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-4xl mx-auto">
              <AISearchComponent initialQuery={headerSearchQuery} />
            </CardContent>
          </Card>
        </div>

        {/* Learning Tracks Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {Object.entries(learningTracks).map(([key, track]) => {
            const IconComponent = track.icon;
            return (
              <Card key={key} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <div className={`mx-auto mb-4 w-16 h-16 ${track.color} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{track.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {track.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <PlayCircle className="w-4 h-4 mr-1" />
                      {track.totalLessons} lessons
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {track.students} students
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Learning Content */}
        <Tabs defaultValue="tpm" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="tpm" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Technical PM
            </TabsTrigger>
            <TabsTrigger value="pm" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Product Management
            </TabsTrigger>
            <TabsTrigger value="em" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Engineering Management
            </TabsTrigger>
          </TabsList>

          {Object.entries(learningTracks).map(([key, track]) => (
            <TabsContent key={key} value={key} className="space-y-8">
              {/* Track Overview */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{track.title}</h3>
                      <p className="text-gray-700 mb-6">{track.description}</p>
                      <div className="flex gap-4 text-sm">
                        <Badge variant="secondary">{track.totalLessons} Lessons</Badge>
                        <Badge variant="secondary">{track.students} Students</Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">What You'll Learn</h4>
                      <ul className="space-y-2">
                        {track.courses.slice(0, 4).map((course, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{course.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Modules */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Course Modules</h3>
                <div className="grid gap-6">
                  {track.courses.map((course, idx) => (
                    <Card 
                      key={idx} 
                      className="border hover:shadow-md transition-shadow cursor-pointer hover:border-primary"
                      onClick={() => setSelectedModule({ track: key, module: course.title })}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl flex items-center">
                              {course.title}
                              <Button variant="ghost" size="sm" className="ml-2 text-primary">
                                <Zap className="w-4 h-4 mr-1" />
                                AI Content
                              </Button>
                            </CardTitle>
                            <CardDescription className="mt-2">{course.description}</CardDescription>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center mb-1">
                              <PlayCircle className="w-4 h-4 mr-1" />
                              {course.lessons} lessons
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {course.duration}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {course.topics.map((topic, topicIdx) => (
                            <Badge key={topicIdx} variant="outline">{topic}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Practical Frameworks */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Practical Frameworks</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {practicalFrameworks[key as keyof typeof practicalFrameworks].map((framework, idx) => (
                    <Card key={idx} className="h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">{framework.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm mb-4">{framework.description}</p>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <span className="text-xs font-medium text-blue-800">Example:</span>
                          <p className="text-sm text-blue-700 mt-1">{framework.example}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Skill Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Skill Assessment</CardTitle>
                  <CardDescription>
                    Test your knowledge in key areas after completing the learning materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {skillAssessments[key as keyof typeof skillAssessments].map((skill, idx) => (
                      <div key={idx} className="flex items-center p-3 border rounded-lg">
                        <Target className="w-5 h-5 text-blue-500 mr-3" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Content Display */}
              {selectedModule && selectedModule.track === key && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Course Content</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowAISearch(!showAISearch)}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        AI Assistant
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedModule(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                  
                  {/* AI Search Component */}
                  {showAISearch && (
                    <div className="mb-6">
                      <AISearchComponent />
                    </div>
                  )}
                  
                  {/* Static Learning Content */}
                  <StaticLearningContent 
                    track={selectedModule.track} 
                    module={selectedModule.module} 
                  />
                  
                  {/* AI Generated Content Option */}
                  <div className="mt-6">
                    <Card className="border-dashed border-2 border-gray-300">
                      <CardContent className="p-6 text-center">
                        <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h4 className="font-semibold mb-2">Enhanced AI Content</h4>
                        <p className="text-gray-600 mb-4">
                          Get personalized, AI-generated learning content tailored to your experience level and learning goals.
                        </p>
                        <AILearningModule 
                          track={selectedModule.track} 
                          module={selectedModule.module} 
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="text-center">
                <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <CardContent className="p-8">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Ready to Practice?</h3>
                    <p className="text-blue-100 mb-6">
                      Apply what you've learned with our AI-powered practice sessions
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        size="lg" 
                        variant="secondary"
                        onClick={() => setLocation("/practice")}
                      >
                        Browse Practice Questions
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-blue-600"
                        onClick={() => setLocation("/custom-case-study")}
                      >
                        Create Custom Case Study
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}