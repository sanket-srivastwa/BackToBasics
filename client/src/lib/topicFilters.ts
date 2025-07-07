// Dynamic topic filtering based on role selection
export const roleTopicMapping = {
  "Product Management": [
    "Product Strategy",
    "Product Roadmap",
    "Product Analytics",
    "User Research",
    "Market Analysis",
    "Product Launch",
    "Feature Prioritization",
    "Stakeholder Management",
    "Product Discovery",
    "Product Growth"
  ],
  "Program Management": [
    "Technical Program Management",
    "Cross-functional Coordination",
    "Program Planning",
    "Risk Management",
    "Resource Allocation",
    "Timeline Management",
    "Stakeholder Alignment",
    "Process Optimization",
    "Project Delivery",
    "Technical Strategy"
  ],
  "Engineering Management": [
    "Team Leadership",
    "Technical Architecture",
    "Code Review Process",
    "Engineering Performance",
    "Technical Hiring",
    "Engineering Culture",
    "System Design",
    "Technology Roadmap",
    "Engineering Operations",
    "Technical Mentoring"
  ],
  "General Management": [
    "Strategic Planning",
    "Team Building",
    "Communication",
    "Decision Making",
    "Change Management",
    "Performance Management",
    "Budget Management",
    "Organizational Design",
    "Leadership Skills",
    "Business Operations"
  ]
};

export const getTopicsForRole = (role: string): string[] => {
  return roleTopicMapping[role as keyof typeof roleTopicMapping] || [];
};

export const getAllTopics = (): string[] => {
  return Object.values(roleTopicMapping).flat();
};