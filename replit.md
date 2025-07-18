# AutoDiDact - AI-Powered Interview Practice Platform

## Overview

AutoDiDact is a full-stack web application designed to help users practice for technical interviews, particularly for Product Management (PM), Technical Program Management (TPM), and Engineering Management roles at top technology companies including Microsoft, Google, Amazon, Meta, Apple, Oracle, Cisco, Salesforce, Adobe, NVIDIA, and Netflix. The platform provides AI-powered feedback on mock interviews and case studies with comprehensive role-based filtering and difficulty categorization.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful API endpoints
- **Session Management**: Express sessions with PostgreSQL store

### Project Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── lib/          # Utilities and API client
│   │   └── hooks/        # Custom React hooks
├── server/               # Backend Express application
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data access layer
│   └── vite.ts           # Development server setup
├── shared/               # Shared TypeScript definitions
│   └── schema.ts         # Database schema and validation
└── migrations/           # Database migration files
```

## Key Components

### Database Schema
The application uses four main entities:
- **Users**: Authentication and user management
- **Questions**: Interview questions with metadata (category, topic, company, difficulty)
- **Answers**: User responses with AI-generated feedback and scoring
- **Sessions**: Practice session tracking and progress management

### Authentication System
- Currently implements a placeholder authentication system
- Prepared for user registration and login functionality
- Session-based authentication with PostgreSQL session store

### Question Management
- Categorized questions (mock-interview, case-study)
- Topic-based organization (TPM, PM, project-management)
- Company-specific questions for MAANG companies
- Difficulty levels (easy, medium, hard)
- Time-limited practice sessions

### Feedback System
- AI-powered answer evaluation (placeholder implementation)
- Structured feedback with scores, strengths, improvements, and suggestions
- Progress tracking across practice sessions

## Data Flow

1. **User Navigation**: Users browse popular questions or filter by topic/category
2. **Practice Session**: Users select questions and provide answers within time limits
3. **Answer Submission**: Answers are processed and stored with generated feedback
4. **Feedback Display**: Users receive detailed feedback with scoring and recommendations
5. **Progress Tracking**: Session data tracks completion and performance over time

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **express**: Web server framework
- **react**: Frontend framework
- **tailwindcss**: Utility-first CSS framework

### UI Components
- **@radix-ui/***: Accessible UI primitives
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **cmdk**: Command palette component

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production
- **drizzle-kit**: Database migration and introspection tools

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- Express server with middleware for API routes
- Automatic TypeScript compilation and error checking
- Replit-specific development tools integration

### Production Build
- **Frontend**: Vite builds React application to static assets
- **Backend**: esbuild bundles Express server with external dependencies
- **Database**: Drizzle handles schema migrations and type safety
- **Environment**: Configured for Node.js production deployment

### Database Management
- PostgreSQL schema managed through Drizzle migrations
- Environment-based database URL configuration
- Connection pooling through Neon serverless architecture

## Recent Features

### Learning Materials System
- Comprehensive learning materials for Technical Program Management and Product Management
- Structured modules covering foundations, systems design, execution, strategy, and analytics
- Interactive content with expandable sections, skill assessments, and practical frameworks
- Accessible via header navigation and home page cards

### Voice-Based Answering
- Web Speech API integration for voice-to-text transcription
- Available in both practice questions and custom case studies
- Tab-based interface allowing users to choose between typing and speaking
- Real-time transcription display with clear answer functionality
- Browser compatibility checks and permission handling

### Navigation Improvements
- Fixed all header navigation buttons (Sign In, Get Started, Browse Questions)
- Practice page redesigned to work without URL parameters
- Topic filtering functionality for question browsing
- Seamless integration between learning materials, practice, and case studies

### Enhanced User Experience (Latest Updates)
- Redesigned home page with Practice and Learn focus areas in hero section
- Removed "Select your Focus Area" and "Enter Custom Topic" sections for cleaner UX
- Added Engineering Management to learning materials (now covers TPM, PM, EM)
- Enhanced learning platform inspired by tryexponent.com structure
- Comprehensive course modules with practical frameworks and skill assessments
- Improved visual design with glass morphism effects, floating animations, and card hover states
- Enhanced CSS animations including gradient shifts, scale effects, and smooth transitions
- Better mobile responsiveness and accessibility features

### Community Answer Sharing System (New Features)
- **ProductManagementExercises.com-inspired Community Platform**: Complete community-driven answer sharing system
- **Answer Submission & Management**: Users can submit detailed answers with titles, experience level, current role, and company information
- **Voting & Engagement System**: Upvote/downvote functionality with net vote tracking and community validation
- **Like & Interaction Features**: Heart-based like system for showing appreciation without judgmental voting
- **Threaded Comment System**: Nested comments on answers with like functionality for enhanced discussions
- **Advanced Filtering & Sorting**: Sort answers by recent, most liked, most voted, most relevant, and most commented
- **Anonymous Posting Options**: Users can choose to post answers and comments anonymously for sensitive topics
- **Professional Profiles Integration**: Display of experience level, current role, and company information for credibility
- **Real-time Engagement Metrics**: Live updates of likes, votes, and comment counts across all interactions
- **Comprehensive Permission System**: Authentication-required posting with proper access control and session management

### Search Functionality (New Features)
- Global search bar on home page hero section for searching questions and topics
- Search redirects to practice page with filtered results
- Comprehensive search functionality for questions with query parameter handling
- Enhanced AI Learning Assistant prominently featured at top of learning page
- AI search with conversation history for interactive Q&A in learning materials
- Quick question buttons for common management and technical topics
- Smart error handling for OpenAI API quota limitations with user-friendly messages

### Authentication System (Latest Implementation)
- **Replit Authentication Integration**: Complete sign-in/sign-up system with secure OpenID Connect
- **Freemium Access Model**: Users can access 5 free questions before authentication required
- **Session Management**: PostgreSQL-based session storage with automatic session handling
- **User Profile Management**: Avatar display, profile dropdown, and account management
- **Access Control**: Smart tracking of question views with progressive authentication prompts
- **Professional UI**: Clean authentication interface inspired by tryexponent.com design patterns
- **Database Schema**: Updated to support Replit Auth with proper user tracking fields

### Comprehensive Learning Platform (New Features)
- **Structured Learning Modules**: Organized courses for Product Management, Program Management, Engineering Management, and Business Analytics
- **Module Categories**: Covering Probability, Statistics, Python, Machine Learning, Deep Learning, Financial Analytics, and Marketing Analytics
- **Course Content Viewer**: Professional navigation between modules and topics with sidebar navigation
- **Progress Tracking**: Individual module progress with completion tracking for each topic
- **Interactive Materials**: Video lectures, articles, exercises, and quizzes with different content types
- **Professional Design**: Coursera/edX-inspired design with learning blue (#2962FF) color scheme and clean typography

### Advanced Account Management System (New Features)
- **Complete Profile Management**: Full user profile editing with personal and professional information
- **Photo Upload**: Profile picture management with avatar display
- **Contact Information**: Email verification, phone number management with verification badges
- **Professional Details**: Company, university, education, and professional headline fields
- **Social Media Integration**: LinkedIn, Facebook, and Google profile linking
- **Security Features**: Password reset, two-factor authentication with QR codes and SMS options
- **Multi-Factor Authentication**: Authenticator app integration and SMS-based verification
- **Privacy Controls**: Security alerts, notification preferences, and data management
- **Account Preferences**: Learning reminders, progress reports, and marketing email controls

## Changelog

```
Changelog:
- July 04, 2025. Initial setup with database integration and AI-powered feedback
- July 04, 2025. Added comprehensive learning materials and voice-based answering functionality
- July 04, 2025. Major UX improvements: redesigned home page, enhanced learning platform with Engineering Management, improved visual design and animations
- July 04, 2025. Implemented comprehensive search functionality: global search bar on home page, enhanced AI learning assistant, and question search with filtering
- July 04, 2025. Complete authentication system: Replit Auth integration, freemium access model (5 free questions), user profiles, session management, and professional UI design inspired by tryexponent.com
- July 05, 2025. Comprehensive Learning Platform: Added structured learning modules for Product Management, Program Management, Engineering Management, and Business Analytics with professional course navigation, progress tracking, and Coursera/edX-inspired design
- July 05, 2025. Advanced Account Management: Implemented complete user profile system with personal/professional information editing, photo upload, contact verification, social media integration, two-factor authentication, security settings, and privacy controls
- July 05, 2025. Major Platform Overhaul: Rebranded to "PrepMaster", expanded company coverage to top tech companies (Microsoft, Google, Amazon, Meta, Apple, Oracle, Cisco, Salesforce, Adobe, NVIDIA, Netflix), implemented comprehensive role-based filtering (Product Management, Program Management, Engineering Management, General Management), enhanced difficulty categorization (Easy, Medium, Hard), improved search functionality with advanced filtering API, updated UI with better company colors and enhanced search box styling
- July 05, 2025. Final Rebranding & Comprehensive Account Management: Rebranded platform from "PrepMaster" to "BackToBasics", created beautiful Coursera-inspired sign-in/sign-up pages with professional design, implemented comprehensive account management system with four main sections: Personal Information (profile picture upload, contact details, demographics), Professional Information (company, education, social media links), Security Settings (password reset, multi-factor authentication with SMS and authenticator app, backup codes), and Privacy & Notifications (notification preferences, profile visibility, data sharing controls). Enhanced authentication flow to show Account option instead of Sign In/Sign Up when user is logged in.
- July 05, 2025. Authentication Flow Fixes: Fixed sign-up process to automatically log in users after account creation, updated header to display actual signed-in user information instead of hardcoded "John Doe", implemented proper logout functionality to clear authentication state, and added localStorage synchronization for seamless authentication state management across page refreshes.
- July 05, 2025. Brand Update to Learn Lab Solution: Renamed platform from "BackToBasics" to "Learn Lab Solution" across all pages (header, footer, about page, contact page), updated contact email to learnlabsolution@gmail.com, created comprehensive About Us and Contact pages with company information about IT sector operations in Bangalore, India, and updated HTML title and meta descriptions for better SEO.
- July 05, 2025. Final Rebranding to AutoDiDact: Complete rebranding from "Learn Lab Solution" to "AutoDiDact" with meaningful autodidact-themed imagery (book with lightbulb icon) representing self-learning concept. Updated all pages (header, footer, about, contact, signin, signup, account), added Contact Us and About Us links to user dropdown menu in header, created comprehensive contact page with FAQ section, maintained learnlabsolution@gmail.com email contact, and updated documentation with new brand identity.
- July 05, 2025. Dashboard & Header Navigation Improvements: Made dashboard page less bright for better readability (changed from bg-gray-50 to bg-gray-100), enhanced header tabs with bold font styling, implemented dropdown functionality for Practice tab (showing Product Management, Program Management, Engineering Management, General Management options), and added Learning tab dropdown (showing Product Management, Program Management, Engineering Management, Business Analytics options) for improved navigation experience.
- July 05, 2025. Enhanced Header Navigation & UX Improvements: Added dropdown functionality to AI Case Study tab with topic-specific options (Product Management Cases, Program Management Cases, Engineering Management Cases, Business Strategy Cases), improved dashboard colors to softer slate-50 background for better eye comfort, enhanced header font styling with professional bold weight (700) and optimized spacing inspired by tryexponent.com design, implemented URL parameter handling for Custom Case Study page to support dropdown navigation filtering, and added comprehensive filter interface to Learning page with search functionality.
- July 05, 2025. Final Navigation & Design Updates: Removed dropdown from AI Case Study header tab for cleaner interface (returned to simple button), applied edX.org-inspired CSS styling to dashboard/home page including professional typography and button design, changed main hero text from "Master Your Next Interview" to "No hacks. No magic. Just practice. Always.", maintained original warm gradient color scheme (purple/pink/orange) throughout platform, and enhanced search button with clean white background and professional styling.
- July 05, 2025. Dashboard Light Theme & Search UX: Implemented light color theme for dashboard with smaller hero text (text-3xl), light blue/purple gradients, white cards with soft shadows, and elegant integrated search button design featuring a compact search icon button inside the input field with gradient styling and smooth hover effects.
- July 05, 2025. Comprehensive AI Learning System: Implemented OpenAI-powered learning materials generation for Product Management, Program Management, Engineering Management, and Business Analytics with comprehensive module creation including objectives, examples, exercises, resources, and assessments. Added AI-powered search functionality to learning page with prompt-based queries, quick topic material generation buttons, and integrated search results display. Enhanced learning page with professional AI assistant interface featuring brain icon, topic-specific material generation, and real-time search capabilities.
- July 05, 2025. AI Case Study Enhancements: Improved AI Case Study page verbiage by removing "PM Solutions" references and using more professional language. Implemented hierarchical topic/sub-topic structure with 4 main topics (Product Management, Program Management, Engineering Management, Business Strategy) each containing 6 specific focus areas. Added custom input field for users to specify their own sub-topics not listed in predefined options. Updated validation logic to require both topic and sub-topic selection. Rebranded "Technical Program Management" to "Program Management" throughout the entire platform including header navigation, learning materials, and all page references.
- July 05, 2025. Hierarchical Topic Structure Implementation: Restructured "Technical Program Management" as a sub-topic under "Program Management" across the entire platform. Updated AI Case Study page to include "Technical Program Management" as the first focus area under Program Management. Modified Practice page topic filtering to show "Program Management" as main category. Enhanced Learning page content to position Technical Program Management as a specialized area within the broader Program Management discipline, adding dedicated learning modules that cover both general program management concepts and TPM-specific technical coordination skills.
- July 05, 2025. Search Functionality Bug Fix: Fixed critical database duplication issue causing search results to show identical questions multiple times. Removed 748 duplicate entries from database using SQL deduplication. Enhanced storage methods with unique result filtering based on question IDs. Added duplicate prevention logic to database seeding process to prevent future duplications. Improved search implementation to query across title, description, company, and topic fields with case-insensitive matching. Search functionality now returns accurate, unique results for all queries.
- July 05, 2025. OpenAI API Error Handling Enhancement: Implemented comprehensive error handling for OpenAI API quota exceeded (429) errors across all AI features. Enhanced user experience with friendly error messages guiding users to pre-built content when AI services are temporarily unavailable. Updated Learning Assistant, case study generator, and question generation to show helpful guidance instead of technical error codes. Added fallback systems to ensure platform remains fully functional even during API limitations.
- July 06, 2025. Dynamic Onboarding Tour with Playful Tooltips: Implemented comprehensive onboarding tour system with animated tooltips, smart positioning, and playful visual effects. Features include 6-step guided tour highlighting key platform features (search, practice, learning, AI case studies), dynamic element highlighting with bounce/pulse/float animations, progress tracking with visual progress bar, localStorage-based completion tracking, and tour control button in header. Tour automatically starts for new users and can be manually restarted. Enhanced user onboarding experience with professional tooltip design, overlay backdrop, and smooth transitions.
- July 07, 2025. Community Answer Sharing System: Implemented comprehensive community-driven answer sharing platform inspired by productmanagementexercises.com. Added complete database schema for community answers, votes, likes, and threaded comments. Created professional community interface with answer submission forms, voting/liking systems, advanced filtering (recent, most liked, most voted, most relevant, most commented), anonymous posting options, and threaded comment discussions. Integrated authentication-required posting with proper access control. Enhanced question detail pages with community answers section featuring real-time engagement metrics, professional profile integration, and comprehensive interaction systems for community knowledge sharing.
- July 07, 2025. Community Header Tab & Dynamic Topic Filtering: Added new Community header tab for browsing community discussions with comprehensive filtering system. Implemented dynamic topic filtering based on role selection (Product Strategy appears only for Product Management role, Technical Program Management for Program Management, etc.). Removed Community Answers from Practice page to maintain focus during question answering. Enhanced "Share Your Answer to Community" button with tooltip functionality. Created role-based topic mapping system with 10 specific topics per management role for precise filtering and better user experience.
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```