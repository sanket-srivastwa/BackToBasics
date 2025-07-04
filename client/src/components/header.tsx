import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Header() {
  const [, setLocation] = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 
                className="text-2xl font-bold text-primary cursor-pointer" 
                onClick={() => setLocation("/")}
              >
                InterviewAce
              </h1>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <button 
                onClick={() => setLocation("/")}
                className="text-neutral-800 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => setLocation("/practice")}
                className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Practice
              </button>
              <button 
                onClick={() => setLocation("/custom-case-study")}
                className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                AI Case Study
              </button>
              <button className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Resources
              </button>
              <button className="text-neutral-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="font-medium">
              Sign In
            </Button>
            <Button className="font-medium">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
