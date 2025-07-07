import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTopicsForRole } from "@/lib/topicFilters";

interface PostQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialRole?: string;
  initialTopic?: string;
}

export default function PostQuestionModal({ 
  open, 
  onOpenChange, 
  initialRole = "",
  initialTopic = ""
}: PostQuestionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState(initialRole);
  const [topic, setTopic] = useState(initialTopic);
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const availableTopics = role ? getTopicsForRole(role) : [];

  const createQuestionMutation = useMutation({
    mutationFn: async (questionData: any) => {
      const response = await fetch("/api/community-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });
      if (!response.ok) {
        throw new Error("Failed to create question");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Question Posted!",
        description: "Your question has been successfully posted to the community.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community-questions"] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRole("");
    setTopic("");
    setCompany("");
    setDifficulty("");
    setIsAnonymous(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !role || !topic || !difficulty) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createQuestionMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      role,
      topic,
      company: company || null,
      difficulty,
      isAnonymous,
    });
  };

  const roles = [
    "Product Management",
    "Program Management", 
    "Engineering Management",
    "General Management"
  ];

  const difficulties = [
    { id: "easy", name: "Easy" },
    { id: "medium", name: "Medium" },
    { id: "hard", name: "Hard" }
  ];

  const companies = [
    { id: "microsoft", name: "Microsoft" },
    { id: "google", name: "Google" },
    { id: "amazon", name: "Amazon" },
    { id: "meta", name: "Meta" },
    { id: "apple", name: "Apple" },
    { id: "oracle", name: "Oracle" },
    { id: "cisco", name: "Cisco" },
    { id: "salesforce", name: "Salesforce" },
    { id: "adobe", name: "Adobe" },
    { id: "nvidia", name: "NVIDIA" },
    { id: "netflix", name: "Netflix" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Post Question to Community
          </DialogTitle>
          <DialogDescription>
            Share your interview question with the community to get insights and answers from experienced professionals.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Question Title *</Label>
            <Input
              id="title"
              placeholder="e.g., How would you prioritize features for a new product?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
            />
            <p className="text-xs text-gray-500">{title.length}/150 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Question Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed context, constraints, and what kind of insights you're looking for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500">{description.length}/1000 characters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={role} onValueChange={(value) => {
                setRole(value);
                setTopic(""); // Reset topic when role changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Topic *</Label>
              <Select value={topic} onValueChange={setTopic} disabled={!role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target Company (Optional)</Label>
              <Select value={company} onValueChange={setCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty *</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(!!checked)}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Post anonymously
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createQuestionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createQuestionMutation.isPending}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {createQuestionMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Post Question
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}