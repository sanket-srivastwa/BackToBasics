import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Search, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAccessControl } from "@/hooks/useAccessControl";
import AuthPromptModal from "@/components/auth-prompt-modal";

export default function Header() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("practice");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const { questionsRemaining, questionsViewed } = useAccessControl();

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
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-3">
                      {/* Questions Remaining Badge */}
                      {questionsRemaining !== undefined && questionsRemaining > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {questionsRemaining} free left
                        </Badge>
                      )}
                      
                      {/* User Profile Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user?.profileImageUrl} alt={user?.email || "User"} />
                              <AvatarFallback>
                                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                          <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                              {user?.firstName && user?.lastName && (
                                <p className="font-medium">{user.firstName} {user.lastName}</p>
                              )}
                              {user?.email && (
                                <p className="w-[200px] truncate text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              )}
                            </div>
                          </div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setLocation("/profile")}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLocation("/settings")}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.location.href = "/api/logout"}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        className="font-medium"
                        onClick={() => setShowAuthModal(true)}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="font-medium"
                        onClick={() => setLocation("/practice")}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Authentication Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        questionsViewed={questionsViewed || 0}
        questionsRemaining={questionsRemaining || 5}
      />
    </div>
  );
}