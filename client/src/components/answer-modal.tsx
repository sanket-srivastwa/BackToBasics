import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Clock, Target, Lightbulb, X } from "lucide-react";

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: {
    id: number;
    title: string;
    description?: string;
    company?: string;
    topic: string;
    difficulty: string;
    timeLimit: number;
    tips?: string[];
    optimalAnswer: string;
  };
}

export default function AnswerModal({ isOpen, onClose, question }: AnswerModalProps) {
  const getTopicDisplay = (topic: string) => {
    const topicMap = {
      "tpm": "Technical Program Management",
      "pm": "Product Management", 
      "em": "Engineering Management",
      "project-management": "Project Management"
    };
    return topicMap[topic as keyof typeof topicMap] || topic;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCompanyColor = (company?: string) => {
    if (!company) return "bg-gray-100 text-gray-800";
    
    const companyColors: { [key: string]: string } = {
      google: "bg-blue-100 text-blue-800",
      microsoft: "bg-blue-100 text-blue-800",
      amazon: "bg-orange-100 text-orange-800",
      meta: "bg-blue-100 text-blue-800",
      apple: "bg-gray-100 text-gray-800",
      netflix: "bg-red-100 text-red-800",
      oracle: "bg-red-100 text-red-800",
      salesforce: "bg-blue-100 text-blue-800",
      adobe: "bg-red-100 text-red-800",
      cisco: "bg-blue-100 text-blue-800",
      nvidia: "bg-green-100 text-green-800"
    };
    
    return companyColors[company.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-xl font-semibold leading-tight mb-3">
                {question.title}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {question.company && (
                  <Badge className={`text-xs font-semibold ${getCompanyColor(question.company)}`}>
                    {question.company.charAt(0).toUpperCase() + question.company.slice(1)}
                  </Badge>
                )}
                <Badge className={`text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {getTopicDisplay(question.topic)}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {question.timeLimit} min
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {question.description && (
            <DialogDescription className="text-gray-600 leading-relaxed">
              {question.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Tips Section */}
            {question.tips && question.tips.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Lightbulb className="w-4 h-4 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900">Key Tips</h3>
                </div>
                <ul className="space-y-2">
                  {question.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-blue-800 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Optimal Answer Section */}
            <div>
              <div className="flex items-center mb-4">
                <Target className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Optimal Answer</h3>
              </div>
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="prose prose-sm max-w-none">
                  {question.optimalAnswer.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                      {paragraph.split('\n').map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {line}
                          {lineIndex < paragraph.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Note */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start">
                <BookOpen className="w-4 h-4 text-gray-600 mr-2 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Learning Note</p>
                  <p>This answer demonstrates best practices and structured thinking for {getTopicDisplay(question.topic)} interviews. Use it as a reference to understand the depth and approach expected for similar questions.</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => {
                // This could navigate to the practice page for this question
                window.open(`/question/${question.id}`, '_blank');
              }}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Target className="w-4 h-4 mr-2" />
              Practice This Question
            </Button>
            <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}