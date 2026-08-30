export const mockEmployees = [
  {
    id: "EMP-2026-001",
    name: "Nivrutti",
    role: "Lead Systems Architect",
    department: "Engineering",
    email: "nivrutti@addcode.engineering",
    phone: "+1 (555) 019-2834",
    joinDate: "2021-06-01",
    status: "Active",
    location: "San Francisco",
    manager: "Sarah Jenkins",
    bio: "Lead Systems Architect at Addcode Engineering. Driving the implementation of core platform scaling and internal operations systems.",
    skills: ["System Architecture", "React", "Node.js", "Scalability", "AWS"],
    projects: ["Addcode Internal Dashboard", "Cranial Space"],
    attendance: 99.5,
    performance: 4.9,
    birthday: "10-15",
    timeOffRequests: [],
    documents: []
  },
  {
    id: "EMP-2026-081",
    name: "Aria Thorne",
    role: "Principal Product Designer",
    department: "Design",
    email: "aria.thorne@addcode.engineering",
    phone: "+1 (555) 234-5678",
    joinDate: "2024-03-15",
    status: "Active",
    location: "San Francisco",
    manager: "Marcus Vance",
    bio: "Passionate about creating design systems and high-fidelity user experiences for enterprise platforms.",
    skills: ["Design Systems", "Figma", "Prototyping", "User Research", "Web Accessibility"],
    projects: ["Internal Tools Portal", "Client Portal v3"],
    attendance: 98.4,
    performance: 4.9,
    birthday: "09-12",
    timeOffRequests: [
      { id: "req-1", type: "Vacation", startDate: "2026-09-15", endDate: "2026-09-22", status: "Approved", notes: "Annual family trip" },
      { id: "req-2", type: "Sick Leave", startDate: "2026-06-12", endDate: "2026-06-13", status: "Approved", notes: "Dental appointment" }
    ],
    documents: [
      { id: "doc-1", name: "Employment Agreement", status: "Signed", signedDate: "2024-03-10" },
      { id: "doc-2", name: "NDA", status: "Signed", signedDate: "2024-03-10" },
      { id: "doc-3", name: "IP Agreement", status: "Signed", signedDate: "2024-03-11" }
    ]
  },
  {
    id: "EMP-2026-042",
    name: "Devon Lane",
    role: "Senior Full Stack Engineer",
    department: "Engineering",
    email: "devon.lane@addcode.engineering",
    phone: "+91 98765 43210",
    joinDate: "2023-07-10",
    status: "Active",
    location: "Bengaluru",
    manager: "Sarah Jenkins",
    bio: "Full stack engineer specializing in React, Node.js, and high-performance serverless architectures.",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"],
    projects: ["Client API Integration", "Core Platform v2"],
    attendance: 96.8,
    performance: 4.7,
    birthday: "11-04",
    timeOffRequests: [
      { id: "req-3", type: "Vacation", startDate: "2026-10-01", endDate: "2026-10-10", status: "Pending", notes: "Festival holidays" }
    ],
    documents: [
      { id: "doc-1", name: "Employment Agreement", status: "Signed", signedDate: "2023-07-05" },
      { id: "doc-2", name: "NDA", status: "Signed", signedDate: "2023-07-05" }
    ]
  },
  {
    id: "EMP-2026-115",
    name: "Elena Rostova",
    role: "Director of Product Management",
    department: "Product",
    email: "elena.rostova@addcode.engineering",
    phone: "+44 20 7946 0192",
    joinDate: "2022-01-20",
    status: "Active",
    location: "London",
    manager: "CEO Office",
    bio: "Leading product strategy, alignment, and roadmap execution for next-gen engineering tools.",
    skills: ["Product Strategy", "Roadmapping", "Agile", "Stakeholder Management", "Data Analytics"],
    projects: ["Internal Dashboard", "Engineering Efficiency Roadmap"],
    attendance: 99.1,
    performance: 4.8,
    birthday: "05-23",
    timeOffRequests: [],
    documents: [
      { id: "doc-1", name: "Employment Agreement", status: "Signed", signedDate: "2022-01-15" },
      { id: "doc-2", name: "NDA", status: "Signed", signedDate: "2022-01-15" }
    ]
  },
  {
    id: "EMP-2026-098",
    name: "Kojo Mensah",
    role: "Senior DevOps Architect",
    department: "Engineering",
    email: "kojo.mensah@addcode.engineering",
    phone: "+49 30 901820",
    joinDate: "2024-09-01",
    status: "Active",
    location: "Berlin",
    manager: "Sarah Jenkins",
    bio: "Automation enthusiast. Dedicated to building robust CI/CD pipelines and infrastructure as code.",
    skills: ["Terraform", "Kubernetes", "AWS", "CI/CD", "Prometheus", "Python"],
    projects: ["Infrastructure Migration", "Dev Security Audit"],
    attendance: 95.5,
    performance: 4.6,
    birthday: "08-30",
    timeOffRequests: [
      { id: "req-4", type: "Compensatory Off", startDate: "2026-09-02", endDate: "2026-09-03", status: "Approved", notes: "Weekend release coverage" }
    ],
    documents: [
      { id: "doc-1", name: "Employment Agreement", status: "Signed", signedDate: "2024-08-25" },
      { id: "doc-2", name: "NDA", status: "Signed", signedDate: "2024-08-25" }
    ]
  },
  {
    id: "EMP-2026-154",
    name: "Sophia Martinez",
    role: "HR Operations Lead",
    department: "HR",
    email: "sophia.martinez@addcode.engineering",
    phone: "+1 (555) 345-6789",
    joinDate: "2023-11-01",
    status: "Active",
    location: "San Francisco",
    manager: "Marcus Vance",
    bio: "Committed to fostering an inclusive company culture and streamlining HR operations for global teams.",
    skills: ["Talent Management", "Conflict Resolution", "HR Compliance", "Employee Engagement"],
    projects: ["Global Onboarding Refresh", "Benefits Enrollment 2026"],
    attendance: 98.9,
    performance: 4.5,
    birthday: "02-14",
    timeOffRequests: [],
    documents: [
      { id: "doc-1", name: "Employment Agreement", status: "Signed", signedDate: "2023-10-25" }
    ]
  },
  {
    id: "EMP-2026-202",
    name: "Alex Rivera",
    role: "Junior Frontend Developer",
    department: "Engineering",
    email: "alex.rivera@addcode.engineering",
    phone: "+1 (555) 456-7890",
    joinDate: "2026-08-15",
    status: "Onboarding",
    location: "Remote",
    manager: "Devon Lane",
    bio: "Excited to start my engineering career at Addcode. Eager to master modern frontend technologies.",
    skills: ["JavaScript", "HTML/CSS", "React Basic", "Tailwind CSS"],
    projects: ["Internal Tools Portal"],
    attendance: 100.0,
    performance: 4.0,
    birthday: "04-05",
    timeOffRequests: [],
    documents: [
      { id: "doc-1", name: "Employment Agreement", status: "Signed", signedDate: "2026-08-01" },
      { id: "doc-2", name: "NDA", status: "Signed", signedDate: "2026-08-01" },
      { id: "doc-3", name: "IP Agreement", status: "Pending", signedDate: "" },
      { id: "doc-4", name: "W4 Tax Form", status: "Pending", signedDate: "" }
    ]
  },
  {
    id: "EMP-2026-210",
    name: "Tariq Mahmood",
    role: "Senior Security Specialist",
    department: "Engineering",
    email: "tariq.mahmood@addcode.engineering",
    phone: "+91 87654 32109",
    joinDate: "2025-05-10",
    status: "On Leave",
    location: "Bengaluru",
    manager: "Sarah Jenkins",
    bio: "Focusing on cyber defense, threat intelligence, and secure coding practices across all development pods.",
    skills: ["Cybersecurity", "Penetration Testing", "Security Auditing", "Network Architecture"],
    projects: ["Dev Security Audit"],
    attendance: 92.3,
    performance: 4.7,
    birthday: "07-19",
    timeOffRequests: [
      { id: "req-5", type: "Medical Leave", startDate: "2026-08-25", endDate: "2026-09-05", status: "Approved", notes: "Surgical recovery" }
    ],
    documents: [
      { id: "doc-1", name: "Employment Agreement", status: "Signed", signedDate: "2025-05-01" }
    ]
  },
  {
    id: "EMP-2026-177",
    name: "Mia Lin",
    role: "Growth Marketing Manager",
    department: "Marketing",
    email: "mia.lin@addcode.engineering",
    phone: "+1 (555) 567-8901",
    joinDate: "2025-01-08",
    status: "Active",
    location: "San Francisco",
    manager: "Elena Rostova",
    bio: "Data-driven marketer focused on B2B customer acquisition and scaling lead gen pipelines.",
    skills: ["SEO", "Content Marketing", "Web Analytics", "Campaign Strategy", "Copywriting"],
    projects: ["Addcode Public Website Rebrand"],
    attendance: 97.2,
    performance: 4.4,
    birthday: "12-28",
    timeOffRequests: [],
    documents: [
      { id: "doc-1", name: "Employment Agreement", status: "Signed", signedDate: "2025-01-02" }
    ]
  },
  {
    id: "EMP-2026-215",
    name: "Oliver Patel",
    role: "Product Designer",
    department: "Design",
    email: "oliver.patel@addcode.engineering",
    phone: "+44 20 8946 0553",
    joinDate: "2026-08-25",
    status: "Onboarding",
    location: "London",
    manager: "Aria Thorne",
    bio: "Freshly joined Addcode. Keen on crafting beautiful interactions and improving mobile experiences.",
    skills: ["Figma", "UI Design", "Visual Design", "Wireframing"],
    projects: ["Client Portal v3"],
    attendance: 100.0,
    performance: 4.2,
    birthday: "03-30",
    timeOffRequests: [],
    documents: [
      { id: "doc-1", name: "Employment Agreement", status: "Signed", signedDate: "2026-08-15" },
      { id: "doc-2", name: "NDA", status: "Signed", signedDate: "2026-08-15" },
      { id: "doc-3", name: "IP Agreement", status: "Signed", signedDate: "2026-08-16" },
      { id: "doc-4", name: "Onboarding Questionnaire", status: "Pending", signedDate: "" }
    ]
  }
];

export const mockActivities = [
  { id: "act-1", type: "onboarding", message: "Alex Rivera joined the Engineering team", timestamp: "2 hours ago", user: "Alex Rivera" },
  { id: "act-2", type: "leave", message: "Tariq Mahmood's medical leave was approved", timestamp: "5 hours ago", user: "Tariq Mahmood" },
  { id: "act-3", type: "document", message: "Oliver Patel signed IP Agreement", timestamp: "Yesterday", user: "Oliver Patel" },
  { id: "act-4", type: "project", message: "Aria Thorne updated designs for 'Client Portal v3'", timestamp: "Yesterday", user: "Aria Thorne" },
  { id: "act-5", type: "onboarding", message: "Oliver Patel joined the Design team", timestamp: "5 days ago", user: "Oliver Patel" },
  { id: "act-6", type: "leave", message: "Devon Lane submitted a request for Vacation in October", timestamp: "1 week ago", user: "Devon Lane" }
];

export const mockStats = {
  totalEmployees: 48,
  activeProjects: 12,
  averagePerformance: 4.6,
  onboardingActive: 3,
  departmentBreakdown: [
    { name: "Engineering", count: 24, percentage: 50, color: "bg-indigo-500 text-indigo-500" },
    { name: "Design", count: 10, percentage: 21, color: "bg-purple-500 text-purple-500" },
    { name: "Product", count: 6, percentage: 12.5, color: "bg-pink-500 text-pink-500" },
    { name: "HR & Ops", count: 5, percentage: 10.5, color: "bg-emerald-500 text-emerald-500" },
    { name: "Marketing", count: 3, percentage: 6, color: "bg-amber-500 text-amber-500" }
  ]
};
