import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Star, Users, BookOpen, Zap, Lock, Unlock } from "lucide-react";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionsViewed: number;
  questionsRemaining: number;
}

export default function AuthPromptModal({ 
  isOpen, 
  onClose, 
  questionsViewed, 
  questionsRemaining 
}: AuthPromptModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    
    // Demo: simulate successful authentication
    setTimeout(() => {
      onClose();
      // Show success message
      window.location.href = "/?message=signed-in-demo";
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {questionsRemaining > 0 ? "Unlock Full Access" : "Continue Your Learning"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {questionsRemaining > 0 
              ? `You have ${questionsRemaining} free questions remaining`
              : "You've used your 5 free questions. Sign in to continue practicing!"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Usage Status */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-orange-800">Free Questions Used</span>
                <Badge variant="outline" className="text-orange-700 border-orange-300">
                  {questionsViewed}/5
                </Badge>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(questionsViewed / 5) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Free vs Premium Benefits */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <h4 className="font-medium text-gray-700">Free Access</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" />
                    5 practice questions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" />
                    Basic feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-500" />
                    Learning materials
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Unlock className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-blue-700">Premium Access</h4>
                </div>
                <ul className="space-y-2 text-sm text-blue-600">
                  <li className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-blue-500" />
                    Unlimited questions
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-blue-500" />
                    AI-powered feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="w-3 h-3 text-blue-500" />
                    Progress tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-blue-500" />
                    Practice sessions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="space-y-3">
            <Button 
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              {isLoading ? "Redirecting..." : "Sign In to Continue"}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Free to create an account • Secure authentication via Replit
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}