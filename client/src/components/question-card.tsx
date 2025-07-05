import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

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
  companyBadgeColor: string;
  statusIcon: React.ReactNode;
  onClick: () => void;
  showPractitioners?: boolean;
}

export default function QuestionCard({ 
  question, 
  companyBadgeColor, 
  statusIcon, 
  onClick,
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
    <Card 
      className="border hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
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
        <div className="flex items-center justify-between">
          {showPractitioners && (
            <div className="flex items-center">
              <Users className="w-4 h-4 text-neutral-400 mr-2" />
              <span className="text-sm text-neutral-500">
                {getPractitionerCount().toLocaleString()} practitioners
              </span>
            </div>
          )}
          <div className="flex items-center text-sm text-neutral-500">
            <span>{question.timeLimit} min</span>
          </div>
          <span className="text-sm font-medium text-primary ml-auto">Practice →</span>
        </div>
      </CardContent>
    </Card>
  );
}
