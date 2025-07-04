# InterviewAce - AI-Powered Interview Practice Platform

## Overview

InterviewAce is a full-stack web application designed to help users practice for technical interviews, particularly for Product Management (PM), Technical Program Management (TPM), and Project Management roles at major technology companies (MAANG - Meta, Amazon, Apple, Netflix, Google). The platform provides AI-powered feedback on mock interviews and case studies.

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

## Changelog

```
Changelog:
- July 04, 2025. Initial setup with database integration and AI-powered feedback
- July 04, 2025. Added comprehensive learning materials and voice-based answering functionality
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```