# Auto The Dact - AI-Powered Interview Practice Platform

## Overview

Auto The Dact is a full-stack web application designed to help users practice for technical interviews, particularly for Product Management (PM), Technical Program Management (TPM), and Engineering Management roles at top technology companies including Microsoft, Google, Amazon, Meta, Apple, Oracle, Cisco, Salesforce, Adobe, NVIDIA, and Netflix. The platform provides AI-powered feedback on mock interviews and case studies with comprehensive role-based filtering and difficulty categorization.

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
- July 05, 2025. Final Rebranding to Auto The Dact: Complete rebranding from "Learn Lab Solution" to "Auto The Dact" with professional logo design inspired by wisdomhatch.com featuring gradient blue-purple logo icon with "A" letter. Updated all pages (header, footer, about, contact, signin, signup, account), added footer component to all pages that were missing it, maintained learnlabsolution@gmail.com email contact, and updated documentation with new brand identity.
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```