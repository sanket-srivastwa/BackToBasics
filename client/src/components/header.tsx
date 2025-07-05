import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Search, User, LogOut, Settings, Info, Mail } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("practice");
  const { user, isAuthenticated, isLoading } = useAuth();

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
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => setLocation("/")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <svg width="32" height="32" viewBox="0 0 32 32" className="drop-shadow-sm">
                        <defs>
                          <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                        {/* Book/Learning Icon */}
                        <rect x="6" y="4" width="20" height="24" rx="2" fill="url(#bookGradient)" />
                        <rect x="8" y="6" width="16" height="2" rx="1" fill="white" opacity="0.9" />
                        <rect x="8" y="10" width="12" height="1.5" rx="0.75" fill="white" opacity="0.7" />
                        <rect x="8" y="13" width="14" height="1.5" rx="0.75" fill="white" opacity="0.7" />
                        <rect x="8" y="16" width="10" height="1.5" rx="0.75" fill="white" opacity="0.7" />
                        {/* Lightbulb overlay for self-learning */}
                        <circle cx="23" cy="10" r="5" fill="#FCD34D" opacity="0.9" />
                        <circle cx="23" cy="10" r="3" fill="#F59E0B" />
                        <path d="M21.5 12.5 L24.5 12.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      AutoDiDact
                    </h1>
                  </div>
                </div>
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
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-3">
                      {/* User Profile Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={(user as any)?.profileImageUrl} alt={(user as any)?.email || "User"} />
                              <AvatarFallback>
                                {(user as any)?.firstName?.[0] || (user as any)?.email?.[0]?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                          <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                              {(user as any)?.firstName && (user as any)?.lastName && (
                                <p className="font-medium">{(user as any).firstName} {(user as any).lastName}</p>
                              )}
                              {(user as any)?.email && (
                                <p className="w-[200px] truncate text-sm text-muted-foreground">
                                  {(user as any).email}
                                </p>
                              )}
                            </div>
                          </div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setLocation("/account")}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Account Settings</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLocation("/about")}>
                            <Info className="mr-2 h-4 w-4" />
                            <span>About Us</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLocation("/contact")}>
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Contact Us</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            // Clear mock authentication
                            localStorage.removeItem('mockAuth');
                            localStorage.removeItem('mockUser');
                            window.location.href = "/";
                          }}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        className="font-medium text-gray-700 hover:text-blue-600"
                        onClick={() => setLocation("/signin")}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setLocation("/signup")}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}