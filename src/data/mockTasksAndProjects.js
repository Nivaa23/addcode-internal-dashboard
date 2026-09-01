export const mockProjects = [
  {
    id: 'PRJ-101',
    name: 'Project Phoenix',
    description: 'Migrating legacy application servers to an optimized serverless microservices architecture with global CDN endpoints.',
    status: 'In Progress',
    progress: 68,
    projectLead: 'Sarah Connor',
    leadRole: 'Principal Architect',
    leadAvatar: 'SC',
    teamSize: 8,
    startDate: '2026-06-15',
    expectedCompletion: '2026-09-25',
    teamMembers: [
      { name: 'Sarah Connor', role: 'Lead Architect', avatar: 'SC' },
      { name: 'Marcus Wright', role: 'DevOps Specialist', avatar: 'MW' },
      { name: 'Grace Harper', role: 'Product Designer', avatar: 'GH' },
      { name: 'Nivrutti', role: 'Systems Architect', avatar: 'N' },
      { name: 'Alex Rivera', role: 'Frontend Engineer', avatar: 'AR' }
    ]
  },
  {
    id: 'PRJ-102',
    name: 'Cyberdyne Guard',
    description: 'Implementing automated penetration testing suites, zero-trust policies, and secret-scanner pipelines into production workflows.',
    status: 'In Review',
    progress: 92,
    projectLead: 'Kate Brewster',
    leadRole: 'Senior SecOps Lead',
    leadAvatar: 'KB',
    teamSize: 5,
    startDate: '2026-05-01',
    expectedCompletion: '2026-09-10',
    teamMembers: [
      { name: 'Kate Brewster', role: 'SecOps Lead', avatar: 'KB' },
      { name: 'Marcus Wright', role: 'DevOps Specialist', avatar: 'MW' },
      { name: 'David Kim', role: 'Security Analyst', avatar: 'DK' }
    ]
  },
  {
    id: 'PRJ-103',
    name: 'Addcode UI V2',
    description: 'Creating the unified internal component library utilizing CSS custom properties, WCAG standards, and custom design tokens.',
    status: 'Planning',
    progress: 20,
    projectLead: 'Grace Harper',
    leadRole: 'Junior Product Designer',
    leadAvatar: 'GH',
    teamSize: 6,
    startDate: '2026-08-01',
    expectedCompletion: '2026-10-15',
    teamMembers: [
      { name: 'Grace Harper', role: 'Product Designer', avatar: 'GH' },
      { name: 'John Connor', role: 'Frontend Dev', avatar: 'JC' },
      { name: 'Nivrutti', role: 'Systems Architect', avatar: 'N' }
    ]
  },
  {
    id: 'PRJ-104',
    name: 'Aether Sync',
    description: 'Designing real-time log-aggregator daemon with sub-millisecond message delivery guarantees across multi-region clouds.',
    status: 'In Progress',
    progress: 45,
    projectLead: 'Marcus Wright',
    leadRole: 'Senior Devops Lead',
    leadAvatar: 'MW',
    teamSize: 7,
    startDate: '2026-07-10',
    expectedCompletion: '2026-11-01',
    teamMembers: [
      { name: 'Marcus Wright', role: 'DevOps Lead', avatar: 'MW' },
      { name: 'Sarah Connor', role: 'Lead Architect', avatar: 'SC' },
      { name: 'Kate Brewster', role: 'SecOps Lead', avatar: 'KB' }
    ]
  },
  {
    id: 'PRJ-105',
    name: 'Chronos Dashboard',
    description: 'Interactive analytics cockpit for scheduling internal employee resource allocations and tracking global sprint velocities.',
    status: 'Completed',
    progress: 100,
    projectLead: 'John Connor',
    leadRole: 'Staff Frontend Developer',
    leadAvatar: 'JC',
    teamSize: 4,
    startDate: '2026-04-10',
    expectedCompletion: '2026-08-20',
    teamMembers: [
      { name: 'John Connor', role: 'Frontend Dev', avatar: 'JC' },
      { name: 'T-800 Model', role: 'QA Automation', avatar: 'T8' },
      { name: 'Sarah Connor', role: 'Lead Architect', avatar: 'SC' },
      { name: 'Nivrutti', role: 'Systems Architect', avatar: 'N' }
    ]
  }
];

export const mockTasks = [
  {
    id: 'TSK-101',
    title: 'Optimize API Gateway latency for auth middleware',
    projectId: 'PRJ-101',
    project: 'Project Phoenix',
    status: 'In Progress',
    priority: 'Critical',
    dueDate: '2026-09-12',
    progress: 65,
    assignedBy: 'Sarah Connor',
    assignee: 'Nivrutti',
    description: 'Profile latency spikes under heavy concurrent requests and cache session verification tokens in Redis edge nodes to eliminate database trips.',
    comments: [
      { id: 'c1', user: 'Sarah Connor', avatar: 'SC', text: 'Please ensure you benchmark with 10k virtual users before opening the PR.', time: 'Yesterday at 4:30 PM' },
      { id: 'c2', user: 'Nivrutti', avatar: 'N', text: 'Benchmarked up to 12k concurrent connections. P99 latency dropped by 42%.', time: 'Today at 10:15 AM' }
    ],
    activity: [
      { id: 'a1', event: 'Task created', user: 'Sarah Connor', timestamp: 'Aug 28, 2026 09:00 AM' },
      { id: 'a2', event: 'Task assigned to Nivrutti', user: 'Sarah Connor', timestamp: 'Aug 28, 2026 09:05 AM' },
      { id: 'a3', event: 'Status changed to In Progress', user: 'Nivrutti', timestamp: 'Aug 29, 2026 11:30 AM' },
      { id: 'a4', event: 'Progress updated to 65%', user: 'Nivrutti', timestamp: 'Today at 10:15 AM' }
    ]
  },
  {
    id: 'TSK-102',
    title: 'Implement secret-scanning GitHub Actions pipeline',
    projectId: 'PRJ-102',
    project: 'Cyberdyne Guard',
    status: 'In Review',
    priority: 'High',
    dueDate: '2026-09-08',
    progress: 90,
    assignedBy: 'Kate Brewster',
    assignee: 'Marcus Wright',
    description: 'Configure automated secret detection rules for AWS tokens and API keys across all repository branches before merge.',
    comments: [
      { id: 'c3', user: 'Kate Brewster', avatar: 'KB', text: 'Rule definitions look solid. Just waiting for final SecOps signoff.', time: '2 hours ago' }
    ],
    activity: [
      { id: 'a5', event: 'Task created', user: 'Kate Brewster', timestamp: 'Aug 25, 2026 02:00 PM' },
      { id: 'a6', event: 'Status changed to In Review', user: 'Marcus Wright', timestamp: 'Yesterday at 05:12 PM' }
    ]
  },
  {
    id: 'TSK-103',
    title: 'Design Dark Mode color token palette for Figma library',
    projectId: 'PRJ-103',
    project: 'Addcode UI V2',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '2026-09-20',
    progress: 0,
    assignedBy: 'Grace Harper',
    assignee: 'Grace Harper',
    description: 'Draft accessible contrast tokens for dark mode background surfaces, borders, and active status indicators.',
    comments: [],
    activity: [
      { id: 'a7', event: 'Task created', user: 'Grace Harper', timestamp: 'Sep 01, 2026 09:00 AM' }
    ]
  },
  {
    id: 'TSK-104',
    title: 'Setup Kafka consumer partition failover triggers',
    projectId: 'PRJ-104',
    project: 'Aether Sync',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-10-05',
    progress: 40,
    assignedBy: 'Marcus Wright',
    assignee: 'Sarah Connor',
    description: 'Configure automated partition rebalancing listeners when edge nodes disconnect unexpectedly.',
    comments: [
      { id: 'c4', user: 'Marcus Wright', avatar: 'MW', text: 'Added fallback heartbeat timers to prevent split-brain states.', time: '1 day ago' }
    ],
    activity: [
      { id: 'a8', event: 'Task created', user: 'Marcus Wright', timestamp: 'Aug 30, 2026 10:00 AM' },
      { id: 'a9', event: 'Status changed to In Progress', user: 'Sarah Connor', timestamp: 'Aug 31, 2026 01:15 PM' }
    ]
  },
  {
    id: 'TSK-105',
    title: 'Export Chronos historical logs to S3 cold storage',
    projectId: 'PRJ-105',
    project: 'Chronos Dashboard',
    status: 'Completed',
    priority: 'Low',
    dueDate: '2026-08-18',
    progress: 100,
    assignedBy: 'John Connor',
    assignee: 'T-800 Model',
    description: 'Compress and archive log traces older than 90 days into Amazon S3 Glacier Flexible Retrieval buckets.',
    comments: [
      { id: 'c5', user: 'T-800 Model', avatar: 'T8', text: 'Archival pipeline executed. 4.2 TB written to Glacier.', time: 'Aug 18, 2026' }
    ],
    activity: [
      { id: 'a10', event: 'Task created', user: 'John Connor', timestamp: 'Aug 10, 2026' },
      { id: 'a11', event: 'Status changed to Completed', user: 'T-800 Model', timestamp: 'Aug 18, 2026' }
    ]
  },
  {
    id: 'TSK-106',
    title: 'Audit IAM roles for production Kubernetes cluster',
    projectId: 'PRJ-102',
    project: 'Cyberdyne Guard',
    status: 'To Do',
    priority: 'Critical',
    dueDate: '2026-09-15',
    progress: 10,
    assignedBy: 'Kate Brewster',
    assignee: 'Kate Brewster',
    description: 'Review service account bindings and revoke unneeded cluster-admin credentials across namespace pods.',
    comments: [],
    activity: [
      { id: 'a12', event: 'Task created', user: 'Kate Brewster', timestamp: 'Sep 01, 2026' }
    ]
  },
  {
    id: 'TSK-107',
    title: 'Refactor global button component with focus-ring tokens',
    projectId: 'PRJ-103',
    project: 'Addcode UI V2',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '2026-09-18',
    progress: 50,
    assignedBy: 'Grace Harper',
    assignee: 'John Connor',
    description: 'Standardize focus outline rings and active press animations across Button, IconButton, and SplitButton primitives.',
    comments: [
      { id: 'c6', user: 'John Connor', avatar: 'JC', text: 'Added keyboard navigation focus indicator tests.', time: '3 hours ago' }
    ],
    activity: [
      { id: 'a13', event: 'Task created', user: 'Grace Harper', timestamp: 'Aug 29, 2026' },
      { id: 'a14', event: 'Progress updated to 50%', user: 'John Connor', timestamp: '3 hours ago' }
    ]
  },
  {
    id: 'TSK-108',
    title: 'Migrate SQLite session store to Redis cluster',
    projectId: 'PRJ-101',
    project: 'Project Phoenix',
    status: 'In Review',
    priority: 'High',
    dueDate: '2026-09-09',
    progress: 95,
    assignedBy: 'Sarah Connor',
    assignee: 'Nivrutti',
    description: 'Replace file-backed sessions with distributed Redis cluster nodes supporting zero-downtime failovers.',
    comments: [
      { id: 'c7', user: 'Nivrutti', avatar: 'N', text: 'Staging validation complete. Load balancer health checks pass.', time: '5 hours ago' }
    ],
    activity: [
      { id: 'a15', event: 'Task created', user: 'Sarah Connor', timestamp: 'Aug 27, 2026' },
      { id: 'a16', event: 'Status changed to In Review', user: 'Nivrutti', timestamp: '5 hours ago' }
    ]
  }
];
