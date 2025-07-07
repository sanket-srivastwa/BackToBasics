import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, ArrowRight, Clock, Target, Zap, Shield, AlertTriangle } from "lucide-react";

interface QuestionCardProps {
  question: {
    id: number;
    title: string;
    description?: string;
    company?: string;
    topic: string;
    difficulty: string;
    roles?: string[];
    timeLimit: number;
    createdAt?: Date;
  };
  companyBadgeColor?: string;
  statusIcon?: React.ReactNode;
  onClick: () => void;
  onGetAnswer?: () => void;
  showPractitioners?: boolean;
}

export default function QuestionCard({ 
  question, 
  companyBadgeColor = "bg-blue-100 text-blue-800", 
  statusIcon = null, 
  onClick,
  onGetAnswer,
  showPractitioners = true 
}: QuestionCardProps) {
  const getTopicDisplay = (topic: string) => {
    const topicMap = {
      "tpm": "Technical PM",
      "pm": "Product Management", 
      "project-management": "Project Management"
    };
    return topicMap[topic as keyof typeof topicMap] || topic;
  };

  const getTimeAgo = (date: Date | string | undefined) => {
    if (!date) return "Recent";
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return "Recent";
    }
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getPractitionerCount = () => {
    // Generate a realistic random number based on question ID
    const seed = question.id * 123;
    return Math.floor((seed % 2000) + 500);
  };

  return (
    <Card className="border hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {question.company && (
              <Badge className={`text-xs font-semibold ${companyBadgeColor}`}>
                {question.company.charAt(0).toUpperCase() + question.company.slice(1)}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs font-medium bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700">
              <Target className="w-3 h-3 mr-1" />
              {getTopicDisplay(question.topic)}
            </Badge>
          </div>
          <div className="flex items-center">
            <Badge 
              className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                question.difficulty === "easy" 
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200" 
                  : question.difficulty === "medium" 
                  ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border border-yellow-200" 
                  : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
              }`}
            >
              {question.difficulty === "easy" && <Zap className="w-3 h-3" />}
              {question.difficulty === "medium" && <Shield className="w-3 h-3" />}
              {question.difficulty === "hard" && <AlertTriangle className="w-3 h-3" />}
              {question.difficulty === "hard" ? "Hard" : 
               question.difficulty === "medium" ? "Medium" : "Easy"}
            </Badge>
          </div>
        </div>
        <CardTitle 
          className="text-lg line-clamp-2 mb-3 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={onClick}
        >
          {question.title}
        </CardTitle>
        <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{question.timeLimit} min</span>
          </div>
          {question.createdAt && (
            <span>{getTimeAgo(question.createdAt)}</span>
          )}
        </div>
        {question.roles && question.roles.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {question.roles.map((role, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {showPractitioners && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-neutral-400 mr-2" />
                <span className="text-sm text-neutral-500">
                  {getPractitionerCount().toLocaleString()} practitioners
                </span>
              </div>
              <div className="flex items-center text-sm text-neutral-500">
                <span>{question.timeLimit} min</span>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Practice
            </Button>
            {onGetAnswer && (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onGetAnswer();
                }}
                variant="outline"
                className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                size="sm"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Get Answer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
