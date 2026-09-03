import type { LucideIcon } from 'lucide-react'
import { Braces, Database, GitBranch, LayoutTemplate, ServerCog, ShieldCheck } from 'lucide-react'

export type Project = { title: string; description: string; problem: string; technologies: string[]; accent: 'violet' | 'lime' | 'orange'; liveUrl?: string; repositoryUrl?: string }
export type Experience = { company: string; role: string; period: string; summary: string; technologies: string[] }

// Replace these placeholders with your own verified information before publishing.
export const profile = {
  name: 'Sarthak Das',
  initials: 'SD',
  role: 'Software Engineer | Full Stack Developer',
  location: 'Hyderabad, Telangana, India',
  email: 'sarthakdas0508@gmail.com',
  resumeUrl: '#',
  social: { github: 'https://github.com/sarthak-das', linkedin: 'https://www.linkedin.com/in/sarthak-das0508/' },
}

export const projects: Project[] = [
  { title: 'Full Stack Enterprise Hub', description: 'Scalable web architecture delivering responsive interfaces backed by high-performance APIs and data streams.', problem: 'Orchestrating high-concurrency business workflows and structured client states with robust reliability.', technologies: ['C#', '.NET Core', 'Angular', 'TypeScript', 'SQL Server'], accent: 'violet' },
  { title: 'REST Service Ecosystem', description: 'Modular ASP.NET Core service layer engineered for low-latency integrations and clean service boundaries.', problem: 'Securing mission-critical data exchanges across disparate consumer platforms with unified schema contracts.', technologies: ['.NET Core', 'ASP.NET Core', 'C#', 'REST APIs', 'SQL Server'], accent: 'lime' },
  { title: 'Responsive Client Application', description: 'Declarative Single Page Application providing fluid user journeys and design-system fidelity.', problem: 'Transforming complex product requirements into fast, accessible, and easily maintainable component trees.', technologies: ['Angular', 'TypeScript', 'REST APIs', 'CSS'], accent: 'orange' },
]

export const experience: Experience[] = [
  { company: 'GATTAVA SOFT SOLUTIONS', role: 'Software Engineer | Full Stack Developer', period: 'Hyderabad, India', summary: 'Building and maintaining enterprise full-stack web applications, microservices, and API integrations with .NET Core, Angular, TypeScript, and SQL Server.', technologies: ['.NET Core', 'ASP.NET Core', 'C#', 'Angular', 'TypeScript', 'SQL Server', 'REST APIs'] },
]

export const skillGroups = [
  ['Full Stack & Backend', ['.NET Core', 'ASP.NET Core', 'C#', 'REST APIs', 'API Integration']],
  ['Frontend Systems', ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3 / SCSS']],
  ['Database & Architecture', ['SQL Server', 'Data Modelling', 'Git', 'GitHub', 'Clean Architecture']],
] as const

export const services: { title: string; description: string; icon: LucideIcon }[] = [
  { title: 'Frontend systems', description: 'Responsive interfaces, reusable component architecture, and design-system implementation.', icon: LayoutTemplate },
  { title: 'Full-stack applications', description: 'Thoughtful UI backed by reliable APIs, integrations, and data flows.', icon: ServerCog },
  { title: 'Product refinement', description: 'Performance, accessibility, and interaction polish that improves the experience.', icon: ShieldCheck },
]

export const expertise: { title: string; detail: string; icon: LucideIcon }[] = [
  { title: 'Component architecture', detail: 'Composable interfaces built to remain clear as a product grows.', icon: Braces },
  { title: 'API integration', detail: 'Resilient client states and well-defined contracts between systems.', icon: ServerCog },
  { title: 'Data modelling', detail: 'Practical structures that support useful, dependable applications.', icon: Database },
  { title: 'Delivery discipline', detail: 'Version control, reviewable changes, and iterative improvement.', icon: GitBranch },
]

export const stats = [
  { value: '.NET & C#', label: 'Backend Architecture' },
  { value: 'Angular', label: 'Frontend Systems' },
  { value: 'SQL Server', label: 'Data & REST APIs' },
]
