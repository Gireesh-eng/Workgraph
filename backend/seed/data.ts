// Realistic seed data for WorkGraph — plausible names, roles, projects

export interface PersonData {
    id: string;
    name: string;
    role: string;
}

export interface TeamData {
    id: string;
    name: string;
}

export interface ProjectData {
    id: string;
    name: string;
    status: string;
}

export interface TaskData {
    id: string;
    title: string;
    status: string;
}

export interface TechnologyData {
    id: string;
    name: string;
}

export interface DocumentData {
    id: string;
    title: string;
}

export interface RelationshipData {
    from: string;
    to: string;
    type: string;
}

// ——— People (15) ———
export const people: PersonData[] = [
    { id: "p1", name: "Alex Chen", role: "Senior Backend Engineer" },
    { id: "p2", name: "Priya Sharma", role: "Frontend Lead" },
    { id: "p3", name: "Marcus Johnson", role: "DevOps Engineer" },
    { id: "p4", name: "Sofia Reyes", role: "Product Manager" },
    { id: "p5", name: "James Okafor", role: "Data Engineer" },
    { id: "p6", name: "Lena Müller", role: "UX Designer" },
    { id: "p7", name: "Raj Patel", role: "Full Stack Developer" },
    { id: "p8", name: "Emily Zhang", role: "Security Engineer" },
    { id: "p9", name: "David Kim", role: "Mobile Developer" },
    { id: "p10", name: "Anya Petrov", role: "QA Lead" },
    { id: "p11", name: "Carlos Mendoza", role: "Backend Engineer" },
    { id: "p12", name: "Nina Johansson", role: "Technical Writer" },
    { id: "p13", name: "Omar Hassan", role: "ML Engineer" },
    { id: "p14", name: "Mika Tanaka", role: "Site Reliability Engineer" },
    { id: "p15", name: "Grace Mbeki", role: "Engineering Manager" },
];

// ——— Teams (5) ———
export const teams: TeamData[] = [
    { id: "team1", name: "Platform Engineering" },
    { id: "team2", name: "Product & Design" },
    { id: "team3", name: "Data & Analytics" },
    { id: "team4", name: "Security & Compliance" },
    { id: "team5", name: "Mobile" },
];

// ——— Projects (8) ———
export const projects: ProjectData[] = [
    { id: "proj1", name: "Nexus Dashboard", status: "Active" },
    { id: "proj2", name: "Authentication Overhaul", status: "Active" },
    { id: "proj3", name: "Data Pipeline v2", status: "Active" },
    { id: "proj4", name: "Mobile App Redesign", status: "Planning" },
    { id: "proj5", name: "Compliance Automation", status: "Active" },
    { id: "proj6", name: "API Gateway Migration", status: "In Review" },
    { id: "proj7", name: "ML Recommendation Engine", status: "Planning" },
    { id: "proj8", name: "Developer Portal", status: "Active" },
];

// ——— Tasks (30) ———
export const tasks: TaskData[] = [
    { id: "t1", title: "Design dashboard layout", status: "Done" },
    { id: "t2", title: "Implement real-time widgets", status: "In Progress" },
    { id: "t3", title: "Build notification center", status: "In Progress" },
    { id: "t4", title: "Set up OAuth 2.0 provider", status: "In Progress" },
    { id: "t5", title: "Migrate user sessions to JWT", status: "Blocked" },
    { id: "t6", title: "Write auth integration tests", status: "Todo" },
    { id: "t7", title: "Configure Kafka consumers", status: "In Progress" },
    { id: "t8", title: "Build ETL orchestrator", status: "In Progress" },
    { id: "t9", title: "Set up data quality checks", status: "Todo" },
    { id: "t10", title: "Design mobile onboarding flow", status: "In Progress" },
    { id: "t11", title: "Implement push notifications", status: "Todo" },
    { id: "t12", title: "Build offline sync layer", status: "Planning" },
    { id: "t13", title: "GDPR data export endpoint", status: "In Progress" },
    { id: "t14", title: "SOC 2 audit preparation", status: "In Progress" },
    { id: "t15", title: "Encryption at rest migration", status: "Blocked" },
    { id: "t16", title: "Set up Kong gateway", status: "Done" },
    { id: "t17", title: "Migrate legacy endpoints", status: "In Progress" },
    { id: "t18", title: "Rate limiting configuration", status: "Todo" },
    { id: "t19", title: "Train recommendation model", status: "Planning" },
    { id: "t20", title: "Build feature extraction pipeline", status: "Todo" },
    { id: "t21", title: "A/B testing framework", status: "Planning" },
    { id: "t22", title: "Write API documentation", status: "In Progress" },
    { id: "t23", title: "Build interactive examples", status: "Todo" },
    { id: "t24", title: "Set up developer sandbox", status: "In Progress" },
    { id: "t25", title: "Performance benchmarks", status: "Todo" },
    { id: "t26", title: "Dashboard accessibility audit", status: "Todo" },
    { id: "t27", title: "Implement SSO integration", status: "In Progress" },
    { id: "t28", title: "Database schema migration", status: "Done" },
    { id: "t29", title: "CI/CD pipeline optimization", status: "In Progress" },
    { id: "t30", title: "Load testing infrastructure", status: "Planning" },
];

// ——— Technologies (10) ———
export const technologies: TechnologyData[] = [
    { id: "tech1", name: "React" },
    { id: "tech2", name: "TypeScript" },
    { id: "tech3", name: "GraphQL" },
    { id: "tech4", name: "Kafka" },
    { id: "tech5", name: "PostgreSQL" },
    { id: "tech6", name: "Redis" },
    { id: "tech7", name: "Docker" },
    { id: "tech8", name: "Kubernetes" },
    { id: "tech9", name: "Python" },
    { id: "tech10", name: "JWT" },
];

// ——— Documents (15) ———
export const documents: DocumentData[] = [
    { id: "doc1", title: "Nexus Dashboard PRD" },
    { id: "doc2", title: "Authentication Architecture RFC" },
    { id: "doc3", title: "Data Pipeline Design Doc" },
    { id: "doc4", title: "Mobile Redesign Wireframes" },
    { id: "doc5", title: "Compliance Requirements Matrix" },
    { id: "doc6", title: "API Gateway Migration Plan" },
    { id: "doc7", title: "ML Model Evaluation Report" },
    { id: "doc8", title: "Developer Portal Sitemap" },
    { id: "doc9", title: "SSO Integration Guide" },
    { id: "doc10", title: "Infrastructure Cost Analysis" },
    { id: "doc11", title: "Incident Response Playbook" },
    { id: "doc12", title: "Onboarding Checklist" },
    { id: "doc13", title: "API Style Guide" },
    { id: "doc14", title: "Performance Benchmarks Q3" },
    { id: "doc15", title: "Security Audit Findings" },
];

// ——— Relationships ———
export const relationships: RelationshipData[] = [
    // MEMBER_OF — Person → Team
    { from: "p1", to: "team1", type: "MEMBER_OF" },
    { from: "p3", to: "team1", type: "MEMBER_OF" },
    { from: "p7", to: "team1", type: "MEMBER_OF" },
    { from: "p11", to: "team1", type: "MEMBER_OF" },
    { from: "p14", to: "team1", type: "MEMBER_OF" },
    { from: "p2", to: "team2", type: "MEMBER_OF" },
    { from: "p4", to: "team2", type: "MEMBER_OF" },
    { from: "p6", to: "team2", type: "MEMBER_OF" },
    { from: "p9", to: "team2", type: "MEMBER_OF" },
    { from: "p5", to: "team3", type: "MEMBER_OF" },
    { from: "p13", to: "team3", type: "MEMBER_OF" },
    { from: "p8", to: "team4", type: "MEMBER_OF" },
    { from: "p10", to: "team4", type: "MEMBER_OF" },
    { from: "p12", to: "team5", type: "MEMBER_OF" },
    { from: "p15", to: "team1", type: "MEMBER_OF" },

    // WORKS_ON — Person → Project
    { from: "p1", to: "proj1", type: "WORKS_ON" },
    { from: "p2", to: "proj1", type: "WORKS_ON" },
    { from: "p6", to: "proj1", type: "WORKS_ON" },
    { from: "p1", to: "proj2", type: "WORKS_ON" },
    { from: "p8", to: "proj2", type: "WORKS_ON" },
    { from: "p11", to: "proj2", type: "WORKS_ON" },
    { from: "p5", to: "proj3", type: "WORKS_ON" },
    { from: "p3", to: "proj3", type: "WORKS_ON" },
    { from: "p9", to: "proj4", type: "WORKS_ON" },
    { from: "p6", to: "proj4", type: "WORKS_ON" },
    { from: "p4", to: "proj4", type: "WORKS_ON" },
    { from: "p8", to: "proj5", type: "WORKS_ON" },
    { from: "p10", to: "proj5", type: "WORKS_ON" },
    { from: "p3", to: "proj6", type: "WORKS_ON" },
    { from: "p7", to: "proj6", type: "WORKS_ON" },
    { from: "p13", to: "proj7", type: "WORKS_ON" },
    { from: "p5", to: "proj7", type: "WORKS_ON" },
    { from: "p12", to: "proj8", type: "WORKS_ON" },
    { from: "p7", to: "proj8", type: "WORKS_ON" },
    { from: "p14", to: "proj6", type: "WORKS_ON" },
    { from: "p15", to: "proj1", type: "WORKS_ON" },

    // OWNS — Team → Project
    { from: "team1", to: "proj1", type: "OWNS" },
    { from: "team1", to: "proj6", type: "OWNS" },
    { from: "team1", to: "proj8", type: "OWNS" },
    { from: "team2", to: "proj4", type: "OWNS" },
    { from: "team3", to: "proj3", type: "OWNS" },
    { from: "team3", to: "proj7", type: "OWNS" },
    { from: "team4", to: "proj2", type: "OWNS" },
    { from: "team4", to: "proj5", type: "OWNS" },

    // HAS_TASK — Project → Task
    { from: "proj1", to: "t1", type: "HAS_TASK" },
    { from: "proj1", to: "t2", type: "HAS_TASK" },
    { from: "proj1", to: "t3", type: "HAS_TASK" },
    { from: "proj1", to: "t26", type: "HAS_TASK" },
    { from: "proj2", to: "t4", type: "HAS_TASK" },
    { from: "proj2", to: "t5", type: "HAS_TASK" },
    { from: "proj2", to: "t6", type: "HAS_TASK" },
    { from: "proj2", to: "t27", type: "HAS_TASK" },
    { from: "proj3", to: "t7", type: "HAS_TASK" },
    { from: "proj3", to: "t8", type: "HAS_TASK" },
    { from: "proj3", to: "t9", type: "HAS_TASK" },
    { from: "proj3", to: "t28", type: "HAS_TASK" },
    { from: "proj4", to: "t10", type: "HAS_TASK" },
    { from: "proj4", to: "t11", type: "HAS_TASK" },
    { from: "proj4", to: "t12", type: "HAS_TASK" },
    { from: "proj5", to: "t13", type: "HAS_TASK" },
    { from: "proj5", to: "t14", type: "HAS_TASK" },
    { from: "proj5", to: "t15", type: "HAS_TASK" },
    { from: "proj6", to: "t16", type: "HAS_TASK" },
    { from: "proj6", to: "t17", type: "HAS_TASK" },
    { from: "proj6", to: "t18", type: "HAS_TASK" },
    { from: "proj6", to: "t29", type: "HAS_TASK" },
    { from: "proj7", to: "t19", type: "HAS_TASK" },
    { from: "proj7", to: "t20", type: "HAS_TASK" },
    { from: "proj7", to: "t21", type: "HAS_TASK" },
    { from: "proj8", to: "t22", type: "HAS_TASK" },
    { from: "proj8", to: "t23", type: "HAS_TASK" },
    { from: "proj8", to: "t24", type: "HAS_TASK" },
    { from: "proj8", to: "t25", type: "HAS_TASK" },
    { from: "proj1", to: "t30", type: "HAS_TASK" },

    // ASSIGNED_TO — Task → Person
    { from: "t1", to: "p6", type: "ASSIGNED_TO" },
    { from: "t2", to: "p2", type: "ASSIGNED_TO" },
    { from: "t3", to: "p7", type: "ASSIGNED_TO" },
    { from: "t4", to: "p1", type: "ASSIGNED_TO" },
    { from: "t5", to: "p8", type: "ASSIGNED_TO" },
    { from: "t6", to: "p10", type: "ASSIGNED_TO" },
    { from: "t7", to: "p5", type: "ASSIGNED_TO" },
    { from: "t8", to: "p5", type: "ASSIGNED_TO" },
    { from: "t9", to: "p3", type: "ASSIGNED_TO" },
    { from: "t10", to: "p6", type: "ASSIGNED_TO" },
    { from: "t11", to: "p9", type: "ASSIGNED_TO" },
    { from: "t12", to: "p9", type: "ASSIGNED_TO" },
    { from: "t13", to: "p8", type: "ASSIGNED_TO" },
    { from: "t14", to: "p10", type: "ASSIGNED_TO" },
    { from: "t15", to: "p8", type: "ASSIGNED_TO" },
    { from: "t16", to: "p3", type: "ASSIGNED_TO" },
    { from: "t17", to: "p7", type: "ASSIGNED_TO" },
    { from: "t18", to: "p14", type: "ASSIGNED_TO" },
    { from: "t19", to: "p13", type: "ASSIGNED_TO" },
    { from: "t20", to: "p13", type: "ASSIGNED_TO" },
    { from: "t21", to: "p5", type: "ASSIGNED_TO" },
    { from: "t22", to: "p12", type: "ASSIGNED_TO" },
    { from: "t23", to: "p7", type: "ASSIGNED_TO" },
    { from: "t24", to: "p11", type: "ASSIGNED_TO" },
    { from: "t25", to: "p14", type: "ASSIGNED_TO" },
    { from: "t26", to: "p2", type: "ASSIGNED_TO" },
    { from: "t27", to: "p11", type: "ASSIGNED_TO" },
    { from: "t28", to: "p5", type: "ASSIGNED_TO" },
    { from: "t29", to: "p3", type: "ASSIGNED_TO" },
    { from: "t30", to: "p14", type: "ASSIGNED_TO" },

    // USES — Project → Technology
    { from: "proj1", to: "tech1", type: "USES" },
    { from: "proj1", to: "tech2", type: "USES" },
    { from: "proj1", to: "tech3", type: "USES" },
    { from: "proj2", to: "tech10", type: "USES" },
    { from: "proj2", to: "tech6", type: "USES" },
    { from: "proj2", to: "tech2", type: "USES" },
    { from: "proj3", to: "tech4", type: "USES" },
    { from: "proj3", to: "tech5", type: "USES" },
    { from: "proj3", to: "tech9", type: "USES" },
    { from: "proj4", to: "tech1", type: "USES" },
    { from: "proj4", to: "tech2", type: "USES" },
    { from: "proj5", to: "tech5", type: "USES" },
    { from: "proj5", to: "tech2", type: "USES" },
    { from: "proj6", to: "tech7", type: "USES" },
    { from: "proj6", to: "tech8", type: "USES" },
    { from: "proj7", to: "tech9", type: "USES" },
    { from: "proj7", to: "tech5", type: "USES" },
    { from: "proj8", to: "tech1", type: "USES" },
    { from: "proj8", to: "tech2", type: "USES" },
    { from: "proj8", to: "tech3", type: "USES" },

    // DOCUMENTED_BY — Project → Document
    { from: "proj1", to: "doc1", type: "DOCUMENTED_BY" },
    { from: "proj2", to: "doc2", type: "DOCUMENTED_BY" },
    { from: "proj2", to: "doc9", type: "DOCUMENTED_BY" },
    { from: "proj3", to: "doc3", type: "DOCUMENTED_BY" },
    { from: "proj4", to: "doc4", type: "DOCUMENTED_BY" },
    { from: "proj5", to: "doc5", type: "DOCUMENTED_BY" },
    { from: "proj5", to: "doc15", type: "DOCUMENTED_BY" },
    { from: "proj6", to: "doc6", type: "DOCUMENTED_BY" },
    { from: "proj6", to: "doc10", type: "DOCUMENTED_BY" },
    { from: "proj7", to: "doc7", type: "DOCUMENTED_BY" },
    { from: "proj8", to: "doc8", type: "DOCUMENTED_BY" },
    { from: "proj8", to: "doc13", type: "DOCUMENTED_BY" },
    { from: "proj1", to: "doc14", type: "DOCUMENTED_BY" },
    { from: "proj1", to: "doc11", type: "DOCUMENTED_BY" },
    { from: "proj8", to: "doc12", type: "DOCUMENTED_BY" },

    // DEPENDS_ON — Task → Task (creates chains for the variable-depth query)
    { from: "t5", to: "t4", type: "DEPENDS_ON" },    // JWT migration depends on OAuth setup
    { from: "t6", to: "t5", type: "DEPENDS_ON" },    // Integration tests depend on JWT migration
    { from: "t6", to: "t4", type: "DEPENDS_ON" },    // Integration tests also depend on OAuth
    { from: "t9", to: "t8", type: "DEPENDS_ON" },    // Data quality checks depend on ETL orchestrator
    { from: "t9", to: "t7", type: "DEPENDS_ON" },    // Data quality checks depend on Kafka consumers
    { from: "t3", to: "t2", type: "DEPENDS_ON" },    // Notification center depends on real-time widgets
    { from: "t12", to: "t11", type: "DEPENDS_ON" },  // Offline sync depends on push notifications
    { from: "t17", to: "t16", type: "DEPENDS_ON" },  // Migrate legacy endpoints depends on Kong gateway
    { from: "t18", to: "t17", type: "DEPENDS_ON" },  // Rate limiting depends on endpoint migration
    { from: "t20", to: "t19", type: "DEPENDS_ON" },  // Feature extraction depends on model training
    { from: "t21", to: "t20", type: "DEPENDS_ON" },  // A/B testing depends on feature extraction
    { from: "t23", to: "t22", type: "DEPENDS_ON" },  // Interactive examples depend on API docs
    { from: "t25", to: "t24", type: "DEPENDS_ON" },  // Performance benchmarks depend on sandbox
    { from: "t27", to: "t4", type: "DEPENDS_ON" },   // SSO depends on OAuth setup
    { from: "t15", to: "t14", type: "DEPENDS_ON" },  // Encryption migration depends on SOC 2 audit
];
