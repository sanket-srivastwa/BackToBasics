import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Database
} from "lucide-react";

export default function Learning() {
  const [, setLocation] = useLocation();
  
  console.log("Learning component rendered");

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
                    <Card key={idx} className="border hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{course.title}</CardTitle>
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