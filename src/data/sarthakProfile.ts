export const AI_PROFILE_IMAGE = '/images/sarthak-das.png'

export interface EducationItem {
  institution: string
  degree?: string
}

export interface ExperienceItem {
  company: string
  role: string
  period?: string
  summary?: string
  technologies?: string[]
}

export interface SarthakProfile {
  name: string
  initials: string
  title: string
  location: string
  currentCompany: string
  education: EducationItem[]
  technologies: string[]
  linkedin: string
  email: string
  github: string
}

export const sarthakProfile: SarthakProfile = {
  name: 'Sarthak Das',
  initials: 'SD',
  title: 'Software Engineer | Full Stack Developer',
  location: 'Hyderabad, Telangana, India',
  currentCompany: 'GATTAVA SOFT SOLUTIONS',
  education: [
    {
      institution: 'Gandhi Institute for Technological Advancement',
    },
  ],
  technologies: [
    '.NET Core',
    'ASP.NET Core',
    'C#',
    'REST APIs',
    'Angular',
    'TypeScript',
    'SQL Server',
  ],
  linkedin: 'https://www.linkedin.com/in/sarthak-das0508/',
  email: 'sarthakdas0508@gmail.com',
  github: 'https://github.com/sarthak-das',
}

export interface QuickPrompt {
  label: string
  query: string
  response: string
}

export const quickPrompts: QuickPrompt[] = [
  {
    label: 'Who is Sarthak?',
    query: 'Who is Sarthak?',
    response: `Sarthak Das is a Software Engineer and Full Stack Developer based in Hyderabad, Telangana, India. He currently works at GATTAVA SOFT SOLUTIONS, specializing in modern web applications and API integration.`,
  },
  {
    label: 'What are his core skills?',
    query: 'What are his skills and technologies?',
    response: `Sarthak's core verified technology stack includes .NET Core, ASP.NET Core, C#, REST APIs, Angular, TypeScript, and SQL Server.`,
  },
  {
    label: 'Tell me about his experience',
    query: 'Tell me about his experience',
    response: `Sarthak is currently working at GATTAVA SOFT SOLUTIONS as a Software Engineer | Full Stack Developer in Hyderabad, building scalable backend services and responsive frontend applications.`,
  },
  {
    label: 'What did he study?',
    query: 'What is his educational background?',
    response: `Sarthak studied at Gandhi Institute for Technological Advancement. (Specific degree or graduation dates are not specified in the current profile data).`,
  },
  {
    label: 'Tell me about his projects',
    query: 'Tell me about his projects',
    response: `Sarthak develops full-stack and frontend systems leveraging .NET Core, Angular, TypeScript, and SQL Server. You can explore his case studies in the Projects section of this portfolio.`,
  },
  {
    label: 'How can I contact him?',
    query: 'How can I contact Sarthak?',
    response: `You can connect with Sarthak directly on LinkedIn at https://www.linkedin.com/in/sarthak-das0508/ or send a message through the Contact section below.`,
  },
]

export function answerQuestion(userInput: string): string {
  const query = userInput.toLowerCase().trim()

  if (!query) {
    return "Hi! I'm Sarthak's AI. Feel free to ask anything about his background, verified skills, company, or how to get in touch."
  }

  // Identity / Who is
  if (query.includes('who is') || query.includes('about him') || query.includes('introduce') || query.includes('bio') || query.includes('yourself')) {
    return `Sarthak Das is a Software Engineer and Full Stack Developer based in Hyderabad, Telangana, India. He currently works at GATTAVA SOFT SOLUTIONS, building robust web applications with .NET Core, Angular, and SQL Server.`
  }

  // Skills / Technologies
  if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('c#') || query.includes('.net') || query.includes('angular') || query.includes('language')) {
    return `Sarthak's verified core technologies are: ${sarthakProfile.technologies.join(', ')}.`
  }

  // Company / Work / Experience / Job
  if (query.includes('company') || query.includes('current work') || query.includes('experience') || query.includes('where does he work') || query.includes('organization') || query.includes('gattava')) {
    return `Sarthak currently works at GATTAVA SOFT SOLUTIONS as a Software Engineer | Full Stack Developer in Hyderabad, India.`
  }

  // Education / College / University / Study
  if (query.includes('education') || query.includes('college') || query.includes('university') || query.includes('study') || query.includes('gandhi') || query.includes('degree') || query.includes('institute')) {
    return `Sarthak attended the Gandhi Institute for Technological Advancement. Specific degree, dates, and CGPA details are not currently provided in the verified profile data.`
  }

  // Location / Where is he
  if (query.includes('location') || query.includes('where is') || query.includes('city') || query.includes('live') || query.includes('based') || query.includes('hyderabad')) {
    return `Sarthak is located in Hyderabad, Telangana, India.`
  }

  // Contact / LinkedIn / Email
  if (query.includes('contact') || query.includes('linkedin') || query.includes('reach') || query.includes('email') || query.includes('hire') || query.includes('message')) {
    return `You can reach out to Sarthak via his verified LinkedIn profile: ${sarthakProfile.linkedin} or by using the Contact form at the bottom of this portfolio.`
  }

  // Projects
  if (query.includes('project') || query.includes('portfolio') || query.includes('work sample') || query.includes('case study')) {
    return `Sarthak works on full-stack applications and component architectures using C#, .NET Core, REST APIs, Angular, and TypeScript. You can review detailed project cards in the Projects section on this page.`
  }

  // Years of experience / salary / unverified details
  if (query.includes('years') || query.includes('how long') || query.includes('salary') || query.includes('age') || query.includes('cgpa') || query.includes('marks') || query.includes('gpa')) {
    return `I don't have that specific verified detail in Sarthak's current profile data. Only verified career milestones from his portfolio and LinkedIn are provided.`
  }

  // Fallback
  return `I don't have that specific information in Sarthak's verified profile data yet. You can ask about his skills, current company (GATTAVA SOFT SOLUTIONS), education (Gandhi Institute for Technological Advancement), location, or how to connect on LinkedIn.`
}
