import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus,
  ChevronUp,
  ChevronDown,
  Filter,
  User,
  Building,
  Calendar,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommunityAnswer {
  id: number;
  questionId: number;
  title: string;
  content: string;
  isAnonymous: boolean;
  experienceLevel?: string;
  currentRole?: string;
  company?: string;
  likesCount: number;
  votesCount: number;
  commentsCount: number;
  tags: string[];
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
  };
}

interface Comment {
  id: number;
  answerId: number;
  content: string;
  isAnonymous: boolean;
  likesCount: number;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
  };
}

interface CommunityAnswersProps {
  questionId: number;
  questionTitle: string;
}

export function CommunityAnswers({ questionId, questionTitle }: CommunityAnswersProps) {
  const [sortBy, setSortBy] = useState("recent");
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState<Set<number>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  
  // Form states
  const [answerTitle, setAnswerTitle] = useState("");
  const [answerContent, setAnswerContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [company, setCompany] = useState("");
  
  const queryClient = useQueryClient();

  // Fetch community answers
  const { data: answers = [], isLoading } = useQuery({
    queryKey: ["/api/questions", questionId, "community-answers", sortBy],
    queryFn: async () => {
      const response = await fetch(`/api/questions/${questionId}/community-answers?sortBy=${sortBy}`);
      if (!response.ok) throw new Error("Failed to fetch community answers");
      return response.json();
    }
  });

  // Create answer mutation
  const createAnswerMutation = useMutation({
    mutationFn: async (answerData: any) => {
      const response = await fetch(`/api/questions/${questionId}/community-answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answerData)
      });
      if (!response.ok) throw new Error("Failed to create answer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions", questionId, "community-answers"] });
      setShowAnswerForm(false);
      setAnswerTitle("");
      setAnswerContent("");
      setIsAnonymous(false);
      setExperienceLevel("");
      setCurrentRole("");
      setCompany("");
    }
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ answerId, voteType }: { answerId: number; voteType: "up" | "down" }) => {
      const response = await fetch(`/api/community-answers/${answerId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType })
      });
      if (!response.ok) throw new Error("Failed to vote");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions", questionId, "community-answers"] });
    }
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async (answerId: number) => {
      const response = await fetch(`/api/community-answers/${answerId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error("Failed to like answer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions", questionId, "community-answers"] });
    }
  });

  const handleSubmitAnswer = () => {
    if (!answerTitle.trim() || !answerContent.trim()) return;
    
    createAnswerMutation.mutate({
      title: answerTitle,
      content: answerContent,
      isAnonymous,
      experienceLevel,
      currentRole,
      company,
      tags: []
    });
  };

  const toggleAnswerExpansion = (answerId: number) => {
    const newExpanded = new Set(expandedAnswers);
    if (newExpanded.has(answerId)) {
      newExpanded.delete(answerId);
    } else {
      newExpanded.add(answerId);
    }
    setExpandedAnswers(newExpanded);
  };

  const getDisplayName = (author: CommunityAnswer["author"], isAnonymous: boolean) => {
    if (isAnonymous) return "Anonymous";
    return `${author.firstName} ${author.lastName}`;
  };

  const getInitials = (author: CommunityAnswer["author"], isAnonymous: boolean) => {
    if (isAnonymous) return "A";
    return `${author.firstName?.[0] || ""}${author.lastName?.[0] || ""}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Community Answers</h3>
          <p className="text-gray-600 text-sm">{answers.length} community responses to this question</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sort Filter */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="most_liked">Most Liked</SelectItem>
              <SelectItem value="most_voted">Most Voted</SelectItem>
              <SelectItem value="most_relevant">Most Relevant</SelectItem>
              <SelectItem value="most_commented">Most Discussed</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Answer Button */}
          <Button 
            onClick={() => setShowAnswerForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Share Your Answer
          </Button>
        </div>
      </div>

      {/* Add Answer Form */}
      {showAnswerForm && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <h4 className="text-lg font-semibold text-gray-900">Share Your Answer</h4>
            <p className="text-gray-600 text-sm">Help the community by sharing your perspective on this question</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="answer-title">Answer Title</Label>
              <Input
                id="answer-title"
                value={answerTitle}
                onChange={(e) => setAnswerTitle(e.target.value)}
                placeholder="Give your answer a descriptive title..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="answer-content">Your Answer</Label>
              <Textarea
                id="answer-content"
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Share your detailed response, frameworks, and insights..."
                rows={6}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="experience-level">Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                    <SelectItem value="principal">Principal (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="current-role">Current Role</Label>
                <Input
                  id="current-role"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g., Senior PM"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Google"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous">Post anonymously</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAnswerForm(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!answerTitle.trim() || !answerContent.trim() || createAnswerMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {createAnswerMutation.isPending ? "Posting..." : "Post Answer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Community Answers */}
      <div className="space-y-4">
        {answers.map((answer: CommunityAnswer) => (
          <Card key={answer.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={answer.isAnonymous ? undefined : answer.author.profileImageUrl || undefined} 
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {getInitials(answer.author, answer.isAnonymous)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{answer.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="font-medium">{getDisplayName(answer.author, answer.isAnonymous)}</span>
                      {!answer.isAnonymous && answer.currentRole && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {answer.currentRole}
                          </span>
                        </>
                      )}
                      {!answer.isAnonymous && answer.company && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {answer.company}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {answer.experienceLevel && (
                    <Badge variant="outline" className="text-xs">
                      {answer.experienceLevel}
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {expandedAnswers.has(answer.id) 
                    ? answer.content 
                    : answer.content.length > 300 
                      ? `${answer.content.substring(0, 300)}...` 
                      : answer.content
                  }
                </p>
                
                {answer.content.length > 300 && (
                  <Button 
                    variant="link" 
                    onClick={() => toggleAnswerExpansion(answer.id)}
                    className="p-0 h-auto text-purple-600 hover:text-purple-700"
                  >
                    {expandedAnswers.has(answer.id) ? "Show less" : "Read more"}
                  </Button>
                )}
              </div>

              {answer.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {answer.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator className="my-4" />

              {/* Interaction Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => voteMutation.mutate({ answerId: answer.id, voteType: "up" })}
                      className="text-gray-600 hover:text-green-600 hover:bg-green-50"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-gray-700 min-w-[2ch] text-center">
                      {answer.votesCount}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => voteMutation.mutate({ answerId: answer.id, voteType: "down" })}
                      className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likeMutation.mutate(answer.id)}
                    className="text-gray-600 hover:text-red-500 hover:bg-red-50"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {answer.likesCount}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newExpanded = new Set(expandedComments);
                      if (newExpanded.has(answer.id)) {
                        newExpanded.delete(answer.id);
                      } else {
                        newExpanded.add(answer.id);
                      }
                      setExpandedComments(newExpanded);
                    }}
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {answer.commentsCount}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>

              {/* Comments Section */}
              {expandedComments.has(answer.id) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <CommentsSection answerId={answer.id} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {!isLoading && answers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No community answers yet</h3>
              <p className="text-gray-600 mb-4">Be the first to share your perspective on this question!</p>
              <Button 
                onClick={() => setShowAnswerForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Write the First Answer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Comments component for individual answers
function CommentsSection({ answerId }: { answerId: number }) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: comments = [] } = useQuery({
    queryKey: ["/api/community-answers", answerId, "comments"],
    queryFn: async () => {
      const response = await fetch(`/api/community-answers/${answerId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json();
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async (commentData: any) => {
      const response = await fetch(`/api/community-answers/${answerId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData)
      });
      if (!response.ok) throw new Error("Failed to create comment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-answers", answerId, "comments"] });
      setShowCommentForm(false);
      setCommentContent("");
      setIsAnonymous(false);
    }
  });

  const handleSubmitComment = () => {
    if (!commentContent.trim()) return;
    
    createCommentMutation.mutate({
      content: commentContent,
      isAnonymous
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {comments.map((comment: Comment) => (
          <div key={comment.id} className="flex space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={comment.isAnonymous ? undefined : comment.author.profileImageUrl || undefined} 
              />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                {comment.isAnonymous ? "A" : `${comment.author.firstName?.[0] || ""}${comment.author.lastName?.[0] || ""}`}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.isAnonymous ? "Anonymous" : `${comment.author.firstName} ${comment.author.lastName}`}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showCommentForm ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCommentForm(true)}
          className="text-gray-600"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Add Comment
        </Button>
      ) : (
        <div className="space-y-3 bg-gray-50 rounded-lg p-3">
          <Textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="resize-none"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="comment-anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="comment-anonymous" className="text-sm">Anonymous</Label>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCommentForm(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSubmitComment}
                disabled={!commentContent.trim() || createCommentMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {createCommentMutation.isPending ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}