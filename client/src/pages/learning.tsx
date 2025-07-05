import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
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
  Lock,
  Filter,
  Search,
  ChevronDown,
  ChevronUp
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
  // Product Management - Comprehensive Course
  {
    id: "pm-fundamentals",
    title: "Product Management Fundamentals",
    description: "Complete guide to product management from basics to advanced concepts",
    icon: Target,
    duration: "12 hours",
    difficulty: "Beginner",
    progress: 0,
    category: "product",
    topics: [
      {
        id: "pm-intro",
        title: "Introduction to Product Management",
        description: "What is product management and the PM role",
        duration: "30 min",
        type: "video",
        completed: false,
        content: "Product Management is the practice of strategically driving the development, market launch, and continual support and improvement of a company's products. Learn the core responsibilities, skills required, and how PMs collaborate with engineering, design, marketing, and sales teams."
      },
      {
        id: "pm-mindset",
        title: "Product Manager Mindset & Skills",
        description: "Essential skills and mindset for successful PMs",
        duration: "45 min",
        type: "article",
        completed: false,
        content: "Develop the right mindset for product management including customer obsession, data-driven thinking, strategic planning, and effective communication. Learn about technical skills, business acumen, and design thinking."
      },
      {
        id: "pm-roles",
        title: "PM Roles Across Different Companies",
        description: "How PM roles differ at startups vs big tech",
        duration: "25 min",
        type: "video",
        completed: false,
        content: "Understand how product management roles vary across different company sizes, industries, and stages. Compare PM responsibilities at FAANG companies vs startups vs enterprise software companies."
      },
      {
        id: "pm-career-path",
        title: "Product Management Career Paths",
        description: "From APM to CPO: career progression in PM",
        duration: "35 min",
        type: "article",
        completed: false,
        content: "Explore career progression from Associate Product Manager to Chief Product Officer. Learn about different specializations like growth PM, platform PM, B2B PM, and the skills needed for each level."
      }
    ]
  },
  {
    id: "product-strategy",
    title: "Product Strategy & Vision",
    description: "Learn to define product vision, strategy, and roadmaps that align with business goals",
    icon: Target,
    duration: "10 hours",
    difficulty: "Intermediate",
    progress: 20,
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
        completed: false,
        content: "Explore how to use strategy canvas to map out your product's value proposition, key partnerships, cost structure, and revenue streams. Learn to identify strategic opportunities and threats in your market."
      },
      {
        id: "competitive-analysis",
        title: "Competitive Analysis & Market Research",
        description: "Analyzing competitors and market dynamics",
        duration: "50 min",
        type: "exercise",
        completed: false,
        content: "Master competitive analysis techniques including feature comparison, pricing analysis, and market positioning. Learn to identify competitive advantages and market gaps."
      },
      {
        id: "north-star-metrics",
        title: "North Star Metrics & OKRs",
        description: "Setting and tracking strategic metrics",
        duration: "40 min",
        type: "video",
        completed: false,
        content: "Learn to define North Star metrics that align with business objectives. Understand how to cascade company OKRs into product and feature-level goals."
      },
      {
        id: "go-to-market",
        title: "Go-to-Market Strategy",
        description: "Planning product launches and market entry",
        duration: "55 min",
        type: "article",
        completed: false,
        content: "Develop comprehensive go-to-market strategies including target customer identification, positioning, pricing, and launch planning. Learn from successful product launches."
      }
    ]
  },
  {
    id: "user-research",
    title: "User Research & Customer Discovery",
    description: "Master data-driven decision making through user research and analytics",
    icon: BarChart3,
    duration: "8 hours",
    difficulty: "Intermediate",
    progress: 0,
    category: "product",
    topics: [
      {
        id: "research-fundamentals",
        title: "User Research Fundamentals",
        description: "Introduction to user research methodologies",
        duration: "40 min",
        type: "video",
        completed: false,
        content: "Learn the basics of user research including qualitative vs quantitative methods, when to use each approach, and how to avoid common research biases."
      },
      {
        id: "customer-interviews",
        title: "Customer Interviews & Surveys",
        description: "Conducting effective customer interviews",
        duration: "55 min",
        type: "video",
        completed: false,
        content: "Master the art of customer interviews including crafting good questions, avoiding leading questions, and extracting actionable insights. Learn survey design best practices."
      },
      {
        id: "usability-testing",
        title: "Usability Testing & User Testing",
        description: "Testing product usability with real users",
        duration: "45 min",
        type: "exercise",
        completed: false,
        content: "Learn to design and conduct usability tests, analyze user behavior, and identify friction points in your product experience."
      },
      {
        id: "analytics-setup",
        title: "Product Analytics & Metrics",
        description: "Setting up analytics and defining success metrics",
        duration: "50 min",
        type: "article",
        completed: false,
        content: "Discover how to implement product analytics, define KPIs, and create dashboards that drive decision-making. Cover acquisition, activation, retention, referral, and revenue metrics."
      },
      {
        id: "ab-testing",
        title: "A/B Testing & Experimentation",
        description: "Running experiments to validate hypotheses",
        duration: "60 min",
        type: "video",
        completed: false,
        content: "Learn experimental design, statistical significance, and how to run A/B tests. Understand common pitfalls and how to design experiments that provide clear insights."
      }
    ]
  },
  {
    id: "product-design",
    title: "Product Design & User Experience",
    description: "Design thinking and UX principles for product managers",
    icon: Monitor,
    duration: "9 hours",
    difficulty: "Intermediate",
    progress: 0,
    category: "product",
    topics: [
      {
        id: "design-thinking",
        title: "Design Thinking Process",
        description: "Understanding the design thinking methodology",
        duration: "45 min",
        type: "video",
        completed: false,
        content: "Learn the five stages of design thinking: Empathize, Define, Ideate, Prototype, and Test. Understand how to apply this methodology to product development."
      },
      {
        id: "user-personas",
        title: "User Personas & Journey Mapping",
        description: "Creating user personas and mapping customer journeys",
        duration: "50 min",
        type: "exercise",
        completed: false,
        content: "Learn to create data-driven user personas and map customer journeys to identify pain points and opportunities for improvement."
      },
      {
        id: "wireframing",
        title: "Wireframing & Prototyping",
        description: "Creating wireframes and interactive prototypes",
        duration: "60 min",
        type: "video",
        completed: false,
        content: "Master wireframing tools and techniques. Learn to create low-fidelity and high-fidelity prototypes for testing ideas quickly."
      },
      {
        id: "ux-principles",
        title: "UX Design Principles",
        description: "Core principles of user experience design",
        duration: "40 min",
        type: "article",
        completed: false,
        content: "Understand fundamental UX principles including usability, accessibility, information architecture, and interaction design."
      },
      {
        id: "design-systems",
        title: "Design Systems & Component Libraries",
        description: "Building scalable design systems",
        duration: "45 min",
        type: "video",
        completed: false,
        content: "Learn about design systems, component libraries, and how they enable consistent user experiences at scale."
      }
    ]
  },
  {
    id: "product-development",
    title: "Product Development & Delivery",
    description: "Agile development, working with engineering teams, and product delivery",
    icon: Code,
    duration: "11 hours",
    difficulty: "Advanced",
    progress: 0,
    category: "product",
    topics: [
      {
        id: "agile-scrum",
        title: "Agile & Scrum Methodology",
        description: "Working in agile environments and scrum processes",
        duration: "50 min",
        type: "video",
        completed: false,
        content: "Master agile principles and scrum framework. Learn about sprints, user stories, backlog management, and the product owner role in scrum teams."
      },
      {
        id: "user-stories",
        title: "Writing Effective User Stories",
        description: "Creating clear and actionable user stories",
        duration: "40 min",
        type: "exercise",
        completed: false,
        content: "Learn the art of writing user stories using the 'As a... I want... So that...' format. Understand acceptance criteria and story estimation."
      },
      {
        id: "backlog-management",
        title: "Product Backlog Management",
        description: "Prioritizing and managing the product backlog",
        duration: "45 min",
        type: "video",
        completed: false,
        content: "Master backlog prioritization techniques including MoSCoW method, Kano model, and RICE scoring. Learn to balance technical debt with feature development."
      },
      {
        id: "engineering-collaboration",
        title: "Working with Engineering Teams",
        description: "Effective collaboration with developers",
        duration: "55 min",
        type: "article",
        completed: false,
        content: "Learn how to effectively communicate with engineering teams, understand technical constraints, and make informed trade-off decisions."
      },
      {
        id: "technical-debt",
        title: "Managing Technical Debt",
        description: "Balancing feature development with technical health",
        duration: "35 min",
        type: "video",
        completed: false,
        content: "Understand technical debt, its impact on product velocity, and how to advocate for technical improvements within business constraints."
      },
      {
        id: "release-management",
        title: "Release Management & Deployment",
        description: "Managing product releases and deployments",
        duration: "40 min",
        type: "article",
        completed: false,
        content: "Learn about release planning, feature flags, gradual rollouts, and monitoring product releases for issues."
      }
    ]
  },
  
  // Program Management - Comprehensive Course
  {
    id: "tpm-fundamentals",
    title: "Program Management Fundamentals",
    description: "Complete guide to technical program management from basics to advanced",
    icon: Network,
    duration: "10 hours",
    difficulty: "Beginner",
    progress: 0,
    category: "program",
    topics: [
      {
        id: "program-management-intro",
        title: "Introduction to Program Management",
        description: "Overview of program management roles and responsibilities",
        duration: "35 min",
        type: "video",
        completed: false,
        content: "Program Management encompasses various specialized roles including Technical Program Management (TPM). Learn the core responsibilities across different program management domains including cross-functional coordination, technical decision-making, and risk management across large-scale programs."
      },
      {
        id: "technical-program-management",
        title: "Technical Program Management (TPM)",
        description: "Deep dive into technical program management specifics",
        duration: "45 min",
        type: "video",
        completed: false,
        content: "Technical Program Management is a specialized area within program management that bridges technical execution and business strategy. Learn TPM-specific responsibilities including system architecture coordination, technical roadmap planning, and engineering team leadership."
      },
      {
        id: "program-management-skills",
        title: "Essential Program Management Skills",
        description: "Core competencies for effective program management",
        duration: "45 min",
        type: "article",
        completed: false,
        content: "Develop technical depth, system thinking, communication skills, and leadership capabilities. Learn how to balance technical constraints with business requirements across different program management specializations."
      },
      {
        id: "tpm-vs-pm",
        title: "TPM vs PM vs Engineering Manager",
        description: "Understanding role boundaries and collaboration",
        duration: "30 min",
        type: "video",
        completed: false,
        content: "Clear distinctions between TPM, PM, and EM roles. Learn how these roles collaborate and when organizations need each type of leadership."
      },
      {
        id: "tpm-career",
        title: "TPM Career Paths & Growth",
        description: "Career progression and specialization areas",
        duration: "25 min",
        type: "article",
        completed: false,
        content: "Explore career paths from senior engineer to senior TPM to director level roles. Learn about specializations in platform, infrastructure, mobile, or AI/ML programs."
      }
    ]
  },
  {
    id: "program-execution",
    title: "Program Execution & Delivery",
    description: "Execute complex programs with multiple stakeholders and dependencies",
    icon: Network,
    duration: "12 hours",
    difficulty: "Advanced",
    progress: 0,
    category: "program",
    topics: [
      {
        id: "program-planning",
        title: "Program Planning & Architecture",
        description: "Breaking down complex programs into manageable workstreams",
        duration: "60 min",
        type: "video",
        completed: false,
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
      },
      {
        id: "dependency-management",
        title: "Dependency Management & Critical Path",
        description: "Managing cross-team dependencies and blockers",
        duration: "55 min",
        type: "video",
        completed: false,
        content: "Learn to identify, track, and resolve dependencies between teams. Master critical path analysis, dependency mapping, and strategies for unblocking teams."
      },
      {
        id: "risk-mitigation",
        title: "Risk Management & Contingency Planning",
        description: "Proactive risk identification and mitigation strategies",
        duration: "50 min",
        type: "exercise",
        completed: false,
        content: "Develop skills in risk assessment, impact analysis, and contingency planning. Learn to create risk registers and implement mitigation strategies."
      },
      {
        id: "program-metrics",
        title: "Program Metrics & Health Monitoring",
        description: "Defining and tracking program success metrics",
        duration: "40 min",
        type: "article",
        completed: false,
        content: "Learn to define program-level metrics, create health dashboards, and establish regular reporting cadences. Cover velocity metrics, quality indicators, and business impact measures."
      }
    ]
  },
  {
    id: "systems-design",
    title: "Systems Design for Program Managers",
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

  // Engineering Management - Comprehensive Course
  {
    id: "em-fundamentals",
    title: "Engineering Management Fundamentals",
    description: "Complete guide to engineering management from first-time manager to senior leader",
    icon: Code,
    duration: "14 hours",
    difficulty: "Beginner",
    progress: 0,
    category: "engineering",
    topics: [
      {
        id: "em-transition",
        title: "Transition from Engineer to Manager",
        description: "Making the shift from individual contributor to manager",
        duration: "45 min",
        type: "video",
        completed: false,
        content: "Navigate the challenging transition from writing code to managing people. Learn about changing mindsets, new responsibilities, and common pitfalls in the first 90 days as a new engineering manager."
      },
      {
        id: "em-responsibilities",
        title: "Core Engineering Manager Responsibilities",
        description: "Understanding the full scope of EM responsibilities",
        duration: "40 min",
        type: "article",
        completed: false,
        content: "Master the key responsibilities including people management, technical strategy, process improvement, and business alignment. Learn how to balance technical leadership with people leadership."
      },
      {
        id: "em-skills",
        title: "Essential Management Skills for Engineers",
        description: "Developing soft skills and leadership capabilities",
        duration: "50 min",
        type: "video",
        completed: false,
        content: "Develop crucial skills including communication, delegation, conflict resolution, and strategic thinking. Learn how technical background enhances management effectiveness."
      },
      {
        id: "em-career-path",
        title: "Engineering Management Career Paths",
        description: "Understanding growth trajectories and specializations",
        duration: "30 min",
        type: "article",
        completed: false,
        content: "Explore career paths from team lead to VP of Engineering. Learn about different tracks including people management, technical leadership, and hybrid roles."
      }
    ]
  },
  {
    id: "team-leadership",
    title: "Engineering Team Leadership",
    description: "Building and leading high-performing engineering teams",
    icon: Users,
    duration: "10 hours",
    difficulty: "Intermediate",
    progress: 0,
    category: "engineering",
    topics: [
      {
        id: "team-building",
        title: "Building High-Performance Teams",
        description: "Creating psychological safety and team dynamics",
        duration: "50 min",
        type: "video",
        completed: false,
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
      },
      {
        id: "hiring-interviewing",
        title: "Technical Hiring & Interviewing",
        description: "Building effective hiring processes for engineers",
        duration: "60 min",
        type: "video",
        completed: false,
        content: "Design inclusive hiring processes, conduct effective technical interviews, and make sound hiring decisions. Learn to assess both technical skills and cultural fit."
      },
      {
        id: "team-scaling",
        title: "Scaling Engineering Teams",
        description: "Growing teams while maintaining productivity",
        duration: "45 min",
        type: "exercise",
        completed: false,
        content: "Navigate the challenges of team growth including onboarding, knowledge sharing, and maintaining team culture as you scale from 5 to 50+ engineers."
      },
      {
        id: "eng-culture",
        title: "Engineering Culture & Values",
        description: "Building and maintaining strong engineering culture",
        duration: "40 min",
        type: "article",
        completed: false,
        content: "Create and maintain engineering culture that promotes innovation, quality, and collaboration. Learn about code review culture, learning culture, and diversity & inclusion."
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
        completed: false,
        content: "Master probability theory including conditional probability, Bayes' theorem, and common probability distributions. Learn applications in business decision-making and risk assessment."
      },
      {
        id: "statistical-inference",
        title: "Statistical Inference & Hypothesis Testing",
        description: "Drawing conclusions from data using statistical methods",
        duration: "75 min",
        type: "article",
        completed: false,
        content: "Learn hypothesis testing, confidence intervals, p-values, and statistical significance. Understand how to design experiments and interpret results in business contexts."
      },
      {
        id: "descriptive-stats",
        title: "Descriptive Statistics & Data Exploration",
        description: "Summarizing and exploring datasets",
        duration: "60 min",
        type: "video",
        completed: false,
        content: "Master measures of central tendency, variability, and distribution shape. Learn to create meaningful data visualizations and identify patterns in business data."
      },
      {
        id: "regression-analysis",
        title: "Regression Analysis & Correlation",
        description: "Understanding relationships between variables",
        duration: "85 min",
        type: "exercise",
        completed: false,
        content: "Learn linear and multiple regression, correlation analysis, and how to interpret coefficients. Understand assumptions and limitations of regression models."
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
    id: "data-visualization",
    title: "Data Visualization & Storytelling",
    description: "Creating compelling visualizations and communicating insights",
    icon: BarChart3,
    duration: "8 hours",
    difficulty: "Intermediate",
    progress: 0,
    category: "analytics",
    topics: [
      {
        id: "viz-principles",
        title: "Data Visualization Principles",
        description: "Design principles for effective data visualization",
        duration: "45 min",
        type: "video",
        completed: false,
        content: "Learn fundamental principles of data visualization including choosing the right chart type, color theory, and visual hierarchy. Understand how to avoid common visualization mistakes."
      },
      {
        id: "dashboard-design",
        title: "Dashboard Design & KPI Tracking",
        description: "Building executive dashboards and KPI systems",
        duration: "60 min",
        type: "exercise",
        completed: false,
        content: "Master dashboard design principles, KPI selection, and real-time monitoring systems. Learn to create dashboards that drive business decisions."
      },
      {
        id: "storytelling",
        title: "Data Storytelling & Presentation",
        description: "Communicating insights to stakeholders",
        duration: "50 min",
        type: "article",
        completed: false,
        content: "Learn to structure data presentations, create compelling narratives, and influence decision-making through effective data storytelling."
      }
    ]
  },
  {
    id: "business-intelligence",
    title: "Business Intelligence & Analytics",
    description: "Enterprise BI systems and advanced analytics",
    icon: Database,
    duration: "12 hours",
    difficulty: "Advanced",
    progress: 0,
    category: "analytics",
    topics: [
      {
        id: "bi-fundamentals",
        title: "Business Intelligence Fundamentals",
        description: "Introduction to BI systems and data warehousing",
        duration: "65 min",
        type: "video",
        completed: false,
        content: "Understand BI architecture, data warehouses, ETL processes, and OLAP systems. Learn how BI systems support business decision-making."
      },
      {
        id: "sql-analytics",
        title: "SQL for Advanced Analytics",
        description: "Complex SQL queries for business analysis",
        duration: "80 min",
        type: "exercise",
        completed: false,
        content: "Master window functions, CTEs, subqueries, and advanced SQL techniques for business analytics. Learn to write complex analytical queries."
      },
      {
        id: "predictive-analytics",
        title: "Predictive Analytics & Forecasting",
        description: "Predicting future trends and business outcomes",
        duration: "70 min",
        type: "video",
        completed: false,
        content: "Learn time series analysis, forecasting models, and predictive analytics techniques. Understand how to build models that predict business metrics."
      },
      {
        id: "customer-analytics",
        title: "Customer Analytics & Segmentation",
        description: "Analyzing customer behavior and segmentation",
        duration: "55 min",
        type: "article",
        completed: false,
        content: "Master customer lifetime value, churn analysis, RFM segmentation, and cohort analysis. Learn to understand and predict customer behavior."
      }
    ]
  },
  {
    id: "machine-learning",
    title: "Machine Learning for Business",
    description: "Practical machine learning applications in business",
    icon: Brain,
    duration: "15 hours",
    difficulty: "Advanced",
    progress: 0,
    category: "analytics",
    topics: [
      {
        id: "ml-concepts",
        title: "Machine Learning Fundamentals",
        description: "Understanding different types of ML algorithms",
        duration: "75 min",
        type: "video",
        completed: false,
        content: "Explore supervised, unsupervised, and reinforcement learning. Understand when to use classification, regression, clustering, and recommendation systems."
      },
      {
        id: "feature-engineering",
        title: "Feature Engineering & Selection",
        description: "Preparing data for machine learning models",
        duration: "60 min",
        type: "exercise",
        completed: false,
        content: "Learn feature selection, transformation, and engineering techniques. Understand how to prepare high-quality features for ML models."
      },
      {
        id: "model-evaluation",
        title: "Model Evaluation & Validation",
        description: "Assessing model performance and avoiding overfitting",
        duration: "60 min",
        type: "article",
        completed: false,
        content: "Learn cross-validation, performance metrics, and techniques to ensure your models generalize well to new data."
      },
      {
        id: "ml-deployment",
        title: "Model Deployment & Monitoring",
        description: "Deploying ML models to production",
        duration: "65 min",
        type: "video",
        completed: false,
        content: "Learn how to deploy ML models, monitor performance, and handle model drift. Understand MLOps principles and production considerations."
      }
    ]
  },
  {
    id: "marketing-analytics",
    title: "Marketing Analytics & Attribution",
    description: "Measuring and optimizing marketing performance",
    icon: TrendingUp,
    duration: "9 hours",
    difficulty: "Intermediate",
    progress: 0,
    category: "analytics",
    topics: [
      {
        id: "marketing-metrics",
        title: "Marketing Metrics & KPIs",
        description: "Essential marketing performance indicators",
        duration: "45 min",
        type: "video",
        completed: false,
        content: "Learn key marketing metrics including CAC, LTV, ROAS, conversion rates, and attribution models. Understand how to measure marketing effectiveness."
      },
      {
        id: "attribution-modeling",
        title: "Attribution Modeling & Multi-touch Analysis",
        description: "Understanding customer journey and touchpoint impact",
        duration: "60 min",
        type: "article",
        completed: false,
        content: "Master first-touch, last-touch, and multi-touch attribution models. Learn to analyze customer journeys and optimize marketing spend."
      },
      {
        id: "campaign-optimization",
        title: "Campaign Optimization & A/B Testing",
        description: "Optimizing marketing campaigns through experimentation",
        duration: "55 min",
        type: "exercise",
        completed: false,
        content: "Learn to design and analyze marketing experiments, optimize campaigns, and use data to improve marketing performance."
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState<{ [key: string]: boolean }>({});
  const [generatedMaterials, setGeneratedMaterials] = useState<{ [key: string]: any }>({});

  // Handle URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const track = urlParams.get('track');
    
    if (search) {
      setSearchQuery(search);
    }
    if (track) {
      // Map track parameter to category
      const trackMap: { [key: string]: string } = {
        'product-management': 'product',
        'program-management': 'program',
        'engineering-management': 'engineering',
        'business-analytics': 'analytics'
      };
      const category = trackMap[track] || 'all';
      setActiveCategory(category);
    }
  }, []);

  const categories = [
    { id: "all", name: "All Courses", icon: BookOpen },
    { id: "product", name: "Product Management", icon: Target },
    { id: "program", name: "Program Management", icon: Network },
    { id: "engineering", name: "Engineering Management", icon: Code },
    { id: "analytics", name: "Business Analytics", icon: BarChart3 }
  ];

  const filteredModules = learningModules.filter(module => {
    // Filter by category
    const categoryMatch = activeCategory === "all" || module.category === activeCategory;
    
    // Filter by search query
    const searchMatch = !searchQuery || 
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.topics.some(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return categoryMatch && searchMatch;
  });

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiSearchQuery.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const response = await fetch('/api/learning/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: aiSearchQuery,
          topics: ["Product Management", "Program Management", "Engineering Management", "Business Analytics"]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to search' }));
        
        if (response.status === 429 || errorData.error?.includes('temporarily unavailable')) {
          throw new Error('quota_exceeded');
        }
        throw new Error('Failed to search');
      }

      const result = await response.json();
      setSearchResults(result);
    } catch (error) {
      console.error('Search failed:', error);
      
      let errorContent = "Sorry, I couldn't search for that right now. Please try again later.";
      
      if (error instanceof Error && error.message === 'quota_exceeded') {
        errorContent = "🤖 Our AI assistant is currently at capacity. Please explore our comprehensive learning materials below, or try the search again in a few minutes.";
      }
      
      setSearchResults({
        query: aiSearchQuery,
        content: errorContent,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSearching(false);
    }
  };

  const generateMaterials = async (topic: string) => {
    const topicKey = topic.toLowerCase().replace(/\s+/g, '-');
    if (loadingMaterials[topicKey] || generatedMaterials[topicKey]) return;

    setLoadingMaterials(prev => ({ ...prev, [topicKey]: true }));
    try {
      const response = await fetch(`/api/learning/materials/${encodeURIComponent(topic)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to generate materials' }));
        
        if (response.status === 429 || errorData.error?.includes('temporarily unavailable')) {
          throw new Error('quota_exceeded');
        }
        throw new Error('Failed to generate materials');
      }

      const result = await response.json();
      setGeneratedMaterials(prev => ({ ...prev, [topicKey]: result }));
    } catch (error) {
      console.error('Failed to generate materials:', error);
      
      let errorMessage = "Unable to generate materials. Please try again later.";
      
      if (error instanceof Error && error.message === 'quota_exceeded') {
        errorMessage = "🤖 Our AI assistant is currently at capacity. Please explore our comprehensive pre-built learning materials below, or try again in a few minutes.";
      }
      
      // Set fallback message
      setGeneratedMaterials(prev => ({ 
        ...prev, 
        [topicKey]: { 
          topic, 
          modules: [], 
          error: errorMessage
        } 
      }));
    } finally {
      setLoadingMaterials(prev => ({ ...prev, [topicKey]: false }));
    }
  };

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
      
      {/* AI Learning Search Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200 px-6 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">AI Learning Assistant</h1>
            <p className="text-lg text-gray-600">Ask any question about Product Management, Program Management, Engineering Management, or Business Analytics</p>
          </div>
          
          <form onSubmit={handleAiSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Brain className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type="text"
                placeholder="e.g., How do I create a product roadmap? What are OKRs? How to manage stakeholders?"
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                className="pl-12 pr-20 w-full h-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 placeholder-gray-500 text-base"
                disabled={isSearching}
              />
              <Button 
                type="submit" 
                disabled={isSearching || !aiSearchQuery.trim()}
                className="absolute right-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all disabled:opacity-50"
              >
                {isSearching ? "Searching..." : "Ask AI"}
              </Button>
            </div>
          </form>

          {/* Quick Topic Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {["Product Management", "Program Management", "Engineering Management", "Business Analytics"].map((topic) => {
              const topicKey = topic.toLowerCase().replace(/\s+/g, '-');
              return (
                <Button
                  key={topic}
                  variant="outline"
                  onClick={() => generateMaterials(topic)}
                  disabled={loadingMaterials[topicKey]}
                  className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                >
                  {loadingMaterials[topicKey] ? "Generating..." : `${topic} Materials`}
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
              );
            })}
          </div>

          {/* Search Results */}
          {searchResults && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Search Results for: "{searchResults.query}"</h3>
              </div>
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {searchResults.content}
                </div>
              </div>
            </div>
          )}

          {/* Generated Materials Display */}
          {Object.entries(generatedMaterials).map(([topicKey, materials]) => (
            <div key={topicKey} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left max-w-4xl mx-auto mt-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">{materials.topic} Learning Materials</h3>
              </div>
              
              {materials.error ? (
                <p className="text-red-600">{materials.error}</p>
              ) : materials.modules && materials.modules.length > 0 ? (
                <div className="grid gap-4">
                  {materials.modules.slice(0, 3).map((module: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">{module.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{module.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {module.duration}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {module.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {materials.modules.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      ...and {materials.modules.length - 3} more modules
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Generating comprehensive learning materials...</p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search learning materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {filtersExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{filteredModules.length} modules available</span>
            </div>
          </div>
          
          {filtersExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Learning Track</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          activeCategory === category.id
                            ? "bg-[#2962FF] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="text-xs"
                    >
                      Clear Search
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveCategory("all")}
                      className="text-xs"
                    >
                      Show All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
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
                {searchQuery 
                  ? `Search Results for "${searchQuery}"` 
                  : activeCategory === "all" 
                    ? "All Learning Modules" 
                    : categories.find(c => c.id === activeCategory)?.name
                }
              </h1>
              <p className="text-[#455A64]">
                {searchQuery 
                  ? `Found ${filteredModules.length} module(s) matching your search`
                  : "Comprehensive courses designed by industry experts to advance your career"
                }
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  className="mt-3"
                >
                  Clear Search
                </Button>
              )}
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