import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("practice");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    switch (searchType) {
      case "practice":
        setLocation(`/practice?search=${encodeURIComponent(searchQuery)}`);
        break;
      case "learning":
        setLocation(`/learning?search=${encodeURIComponent(searchQuery)}`);
        break;
      case "companies":
        setLocation(`/practice?company=${encodeURIComponent(searchQuery)}`);
        break;
      default:
        setLocation(`/practice?search=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery("");
  };

  return (
    <div className="sticky top-0 z-50">

      
      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
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
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === "/" 
                      ? "text-primary bg-primary/10" 
                      : "text-neutral-600 hover:text-primary"
                  }`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setLocation("/practice")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === "/practice" 
                      ? "text-primary bg-primary/10" 
                      : "text-neutral-600 hover:text-primary"
                  }`}
                >
                  Practice
                </button>
                <button 
                  onClick={() => setLocation("/learning")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === "/learning" 
                      ? "text-primary bg-primary/10" 
                      : "text-neutral-600 hover:text-primary"
                  }`}
                >
                  Learning
                </button>
                <button 
                  onClick={() => setLocation("/custom-case-study")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === "/custom-case-study" 
                      ? "text-primary bg-primary/10" 
                      : "text-neutral-600 hover:text-primary"
                  }`}
                >
                  AI Case Study
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="font-medium"
                onClick={() => setLocation("/custom-case-study")}
              >
                Sign In
              </Button>
              <Button 
                className="font-medium"
                onClick={() => setLocation("/practice")}
              >
                Get Started
              </Button>
              

            </div>
          </div>
        </div>
      </header>
    </div>
  );
}