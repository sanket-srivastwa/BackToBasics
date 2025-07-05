import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, ArrowRight } from "lucide-react";

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
          {question.company && (
            <Badge className={`text-xs font-semibold ${companyBadgeColor}`}>
              {question.company.charAt(0).toUpperCase() + question.company.slice(1)}
            </Badge>
          )}
          <div className="flex items-center text-sm text-neutral-500">
            {statusIcon}
            <span className="ml-1">
              {question.difficulty === "hard" ? "Hard" : 
               question.difficulty === "medium" ? "Medium" : "Easy"}
            </span>
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2 mb-3">
          {question.title}
        </CardTitle>
        <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
          <span>{getTopicDisplay(question.topic)}</span>
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
