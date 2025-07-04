import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ArrowLeft, BookOpen, Users, Target, Clock, CheckCircle, PlayCircle, FileText, Lightbulb } from "lucide-react";

export default function Learning() {
  const [, setLocation] = useLocation();
  const [selectedTopic, setSelectedTopic] = useState("tpm");

  const learningModules = {
    tpm: {
      title: "Technical Program Management",
      description: "Master the skills needed to lead complex technical programs across engineering teams",
      modules: [
        {
          id: "foundations",
          title: "TPM Foundations",
          duration: "45 min",
          content: [
            {
              title: "What is Technical Program Management?",
              type: "article",
              content: "Technical Program Management (TPM) is a critical role that bridges the gap between technical teams and business objectives. TPMs are responsible for driving complex, cross-functional technical programs from conception to delivery. Unlike traditional project managers, TPMs possess deep technical knowledge and can make informed decisions about architecture, scalability, and technical trade-offs."
            },
            {
              title: "Core Responsibilities",
              type: "list",
              items: [
                "Program Planning & Execution: Define program scope, create detailed project plans, and ensure timely delivery",
                "Technical Leadership: Provide technical guidance and make architecture decisions",
                "Cross-functional Coordination: Align engineering, product, design, and business teams",
                "Risk Management: Identify and mitigate technical and program risks",
                "Stakeholder Communication: Translate technical concepts for non-technical stakeholders"
              ]
            },
            {
              title: "Key Skills for TPMs",
              type: "skills",
              skills: [
                { name: "Technical Depth", level: "Expert", description: "Deep understanding of software architecture, systems design, and engineering practices" },
                { name: "Program Management", level: "Expert", description: "Proficiency in project planning, resource allocation, and delivery management" },
                { name: "Communication", level: "Expert", description: "Ability to communicate complex technical concepts to diverse audiences" },
                { name: "Leadership", level: "Advanced", description: "Influence without authority, team motivation, and conflict resolution" }
              ]
            }
          ]
        },
        {
          id: "system-design",
          title: "Systems Design for TPMs",
          duration: "60 min",
          content: [
            {
              title: "Architecture Planning",
              type: "article",
              content: "As a TPM, you'll often be involved in high-level architecture decisions. Understanding system design principles is crucial for making informed trade-offs between scalability, performance, and maintainability. This includes knowledge of microservices vs monolithic architectures, database design patterns, and cloud infrastructure considerations."
            },
            {
              title: "Scalability Considerations",
              type: "checklist",
              items: [
                "Load balancing strategies and implementation",
                "Database sharding and replication patterns",
                "Caching strategies (Redis, Memcached, CDN)",
                "Event-driven architecture and message queues",
                "API design and rate limiting",
                "Monitoring and observability setup"
              ]
            }
          ]
        },
        {
          id: "execution",
          title: "Program Execution Excellence",
          duration: "50 min",
          content: [
            {
              title: "Agile Program Management",
              type: "article",
              content: "TPMs must excel at managing large-scale programs using agile methodologies. This involves coordinating multiple scrum teams, managing dependencies, and ensuring alignment with business objectives. Key practices include regular sprint planning, backlog grooming, and retrospectives at the program level."
            },
            {
              title: "Risk Management Framework",
              type: "framework",
              steps: [
                "Risk Identification: Systematically identify technical, resource, and timeline risks",
                "Risk Assessment: Evaluate probability and impact of each risk",
                "Risk Mitigation: Develop and implement mitigation strategies",
                "Risk Monitoring: Continuously track and reassess risks throughout the program"
              ]
            }
          ]
        }
      ]
    },
    pm: {
      title: "Product Management",
      description: "Learn to build products that customers love and drive business growth",
      modules: [
        {
          id: "product-strategy",
          title: "Product Strategy & Vision",
          duration: "55 min",
          content: [
            {
              title: "Product Vision and Strategy",
              type: "article",
              content: "Product Management is about identifying customer needs and business opportunities, then working with engineering and design teams to build solutions that create value. A strong product strategy starts with understanding the market, competitive landscape, and customer pain points. The product vision should be inspiring, clear, and aligned with business objectives."
            },
            {
              title: "Market Research Techniques",
              type: "list",
              items: [
                "Customer interviews and surveys to understand needs and pain points",
                "Competitive analysis to identify market gaps and opportunities",
                "Market sizing and TAM (Total Addressable Market) analysis",
                "User persona development based on research data",
                "Jobs-to-be-done framework for understanding customer motivations"
              ]
            },
            {
              title: "Product Strategy Framework",
              type: "framework",
              steps: [
                "Market Analysis: Understand market size, trends, and competitive landscape",
                "Customer Research: Identify target customers and their needs",
                "Value Proposition: Define unique value your product provides",
                "Product Roadmap: Plan features and timeline based on strategy",
                "Success Metrics: Define KPIs to measure product success"
              ]
            }
          ]
        },
        {
          id: "product-development",
          title: "Product Development Process",
          duration: "65 min",
          content: [
            {
              title: "Product Discovery",
              type: "article",
              content: "Product discovery is the process of validating that the product you're building solves a real customer problem before you invest significant resources in development. This involves rapid experimentation, prototyping, and customer validation. The goal is to reduce risk and increase confidence in your product decisions."
            },
            {
              title: "Prioritization Frameworks",
              type: "frameworks",
              frameworks: [
                {
                  name: "RICE Framework",
                  description: "Reach × Impact × Confidence ÷ Effort = Priority Score",
                  useCase: "Great for feature prioritization with quantitative data"
                },
                {
                  name: "MoSCoW Method",
                  description: "Must have, Should have, Could have, Won't have",
                  useCase: "Useful for release planning and stakeholder alignment"
                },
                {
                  name: "Value vs Effort Matrix",
                  description: "Plot features on a 2x2 matrix of value and effort",
                  useCase: "Quick visual prioritization for leadership discussions"
                }
              ]
            },
            {
              title: "User Story Writing",
              type: "template",
              template: "As a [user type], I want [functionality] so that [benefit/value]",
              examples: [
                "As a busy professional, I want to schedule meetings with one click so that I can save time and avoid back-and-forth emails",
                "As a team lead, I want to see team productivity metrics so that I can identify areas for improvement and support"
              ]
            }
          ]
        },
        {
          id: "analytics",
          title: "Product Analytics & Metrics",
          duration: "45 min",
          content: [
            {
              title: "Key Product Metrics",
              type: "metrics",
              categories: [
                {
                  name: "Acquisition Metrics",
                  metrics: ["Customer Acquisition Cost (CAC)", "Conversion Rate", "Traffic Sources", "Sign-up Rate"]
                },
                {
                  name: "Engagement Metrics",
                  metrics: ["Daily/Monthly Active Users", "Session Duration", "Feature Adoption Rate", "User Retention"]
                },
                {
                  name: "Business Metrics",
                  metrics: ["Revenue Growth", "Customer Lifetime Value (CLV)", "Churn Rate", "Net Promoter Score (NPS)"]
                }
              ]
            },
            {
              title: "A/B Testing Best Practices",
              type: "checklist",
              items: [
                "Define clear hypothesis before testing",
                "Ensure statistical significance in sample size",
                "Test one variable at a time",
                "Run tests for appropriate duration",
                "Consider seasonal and external factors",
                "Document and share learnings"
              ]
            }
          ]
        }
      ]
    }
  };

  const currentTopic = learningModules[selectedTopic as keyof typeof learningModules];

  const renderContent = (content: any) => {
    switch (content.type) {
      case "article":
        return (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">{content.content}</p>
          </div>
        );
      case "list":
        return (
          <ul className="space-y-2">
            {content.items.map((item: string, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        );
      case "skills":
        return (
          <div className="space-y-3">
            {content.skills.map((skill: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{skill.name}</h4>
                  <Badge variant={skill.level === "Expert" ? "default" : "secondary"}>
                    {skill.level}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{skill.description}</p>
              </div>
            ))}
          </div>
        );
      case "framework":
        return (
          <div className="space-y-3">
            {content.steps.map((step: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <span className="text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        );
      case "checklist":
        return (
          <div className="space-y-2">
            {content.items.map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 text-blue-600" />
                <label className="text-gray-700">{item}</label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            Learning Materials
          </h1>
          <p className="text-neutral-600">
            Comprehensive guides and resources for mastering management roles
          </p>
        </div>

        {/* Topic Selection */}
        <Tabs value={selectedTopic} onValueChange={setSelectedTopic} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tpm">Technical Program Management</TabsTrigger>
            <TabsTrigger value="pm">Product Management</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTopic} className="mt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentTopic.title}</h2>
              <p className="text-gray-600 mb-4">{currentTopic.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {currentTopic.modules.length} modules
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {currentTopic.modules.reduce((total, module) => total + parseInt(module.duration), 0)} min total
                </span>
              </div>
            </div>

            {/* Learning Modules */}
            <div className="space-y-6">
              {currentTopic.modules.map((module, moduleIndex) => (
                <Card key={module.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-800">{module.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {module.duration}
                        </CardDescription>
                      </div>
                      <div className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold">
                        Module {moduleIndex + 1}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {module.content.map((contentItem, contentIndex) => (
                        <AccordionItem key={contentIndex} value={`item-${contentIndex}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span>{contentItem.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            {renderContent(contentItem)}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
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
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}