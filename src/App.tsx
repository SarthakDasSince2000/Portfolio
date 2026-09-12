import { ArrowDownRight, ArrowUpRight, Check, ChevronUp, Code2, GitFork, Link, Mail, Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ContactForm } from './components/ContactForm'
import { CosmicBackground } from './components/CosmicBackground'
import { Reveal } from './components/Reveal'
import { SectionHeading } from './components/SectionHeading'
import { AiAvatar } from './components/AiAvatar'
import { AiAssistantModal } from './components/AiAssistantModal'
import { SkillsHorizontalSection } from './components/SkillsHorizontalSection'
import { experience, expertise, profile, projects, skillGroups, stats } from './data/portfolio'
import './App.css'
import './motion.css'
import './theme-motion.css'

const nav = ['About', 'Experience', 'Skills', 'Projects', 'Contact']
const processSteps = [
  ['Understand', 'Clarify the user need, constraints, and the practical definition of success.'],
  ['Plan', 'Break the work into stable technical decisions and focused delivery milestones.'],
  ['Design', 'Translate the product direction into accessible interface patterns and system rules.'],
  ['Develop', 'Build maintainable, testable features with deliberate component and API boundaries.'],
  ['Test', 'Check behaviour, responsiveness, and edge cases before the work is handed over.'],
  ['Deploy', 'Ship through a clear release path with observability and a rollback plan when needed.'],
  ['Improve', 'Use feedback and real usage to make the next iteration more effective.'],
] as const

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('portfolio-theme') as 'light' | 'dark' ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const [active, setActive] = useState('')
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('portfolio-theme', theme) }, [theme])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const currentScrollY = window.scrollY
      const max = document.documentElement.scrollHeight - innerHeight
      const nextProgress = max ? currentScrollY / max : 0
      setProgress(nextProgress * 100)
      document.documentElement.style.setProperty('--page-progress', nextProgress.toString())
      setIsScrolled(currentScrollY > 20)

      // Section tracking
      const sectionIds = ['contact', 'process', 'expertise', 'projects', 'services', 'skills', 'toolkit', 'experience', 'about', 'home']
      const activeEl = sectionIds.find(id => {
        const el = document.getElementById(id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= 200 && rect.bottom >= 120
      })

      if (activeEl) {
        setActive(activeEl === 'toolkit' || activeEl === 'services' ? 'skills' : activeEl)
      } else {
        const fallback = [...document.querySelectorAll<HTMLElement>('section[id]')].findLast(item => item.offsetTop - 140 <= currentScrollY)
        const fallbackId = fallback?.id ?? ''
        setActive(fallbackId === 'toolkit' || fallbackId === 'services' ? 'skills' : fallbackId)
      }
    }

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [])

  const handleNavClick = (id: string) => {
    setMenuOpen(false)
    const target = document.getElementById(id)
    if (target) {
      const pinSpacer = target.closest('.pin-spacer') as HTMLElement | null
      if (pinSpacer) {
        window.scrollTo({ top: pinSpacer.offsetTop, behavior: 'smooth' })
      } else {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return <>
    <CosmicBackground theme={theme} />
    <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />
    <header className={isScrolled ? 'nav is-scrolled' : 'nav'}><a href="#home" className="logo" aria-label="Home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{profile.initials}<span>.</span></a><nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}>{nav.map(item => <a key={item} className={active === item.toLowerCase() ? 'active' : ''} href={`#${item.toLowerCase()}`} onClick={(e) => { e.preventDefault(); handleNavClick(item.toLowerCase()) }}>{item}</a>)}</nav><div className="nav-actions"><button className="theme-toggle" aria-label="Toggle colour theme" aria-pressed={theme === 'dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button><a className="nav-cta" href={`mailto:${profile.email}`}>Let&apos;s talk <ArrowUpRight size={15} /></a><button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div></header>

    <main>
      <section id="home" className="hero section">
        <Reveal className="hero-availability">
          <div className="availability"><span /> Available for opportunities</div>
        </Reveal>
        <div className="hero-layout">
          <div>
            <Reveal delay={80}><p className="hero-label">{profile.role} <b>·</b> {profile.location}</p></Reveal>
            <Reveal delay={160} className="hero-title"><h1><span>Engineering digital</span><span>products with <em>clarity</em></span><span>and character.</span></h1></Reveal>
          </div>
          <div className="hero-right-column">
            <Reveal delay={220} className="hero-ai-presentation">
              <AiAvatar onOpenChat={() => setAiModalOpen(true)} isSpeaking={isAiSpeaking} />
            </Reveal>
            <Reveal delay={300} className="hero-intro">
              <p>I build responsive, maintainable web applications across the frontend and API layer — with considered interfaces, clear architecture, and reliable delivery.</p>
              <div className="hero-actions">
                <a className="button button--primary" href="#projects" onClick={(e) => { e.preventDefault(); handleNavClick('projects') }}>View projects <ArrowDownRight size={17} /></a>
                <a className="button button--quiet" href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact') }}>Contact me <ArrowUpRight size={17} /></a>
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal delay={360} className="tech-strip">
          <Code2 size={17} /> <span>.NET Core</span><span>ASP.NET Core</span><span>C#</span><span>Angular</span><span>TypeScript</span><span>SQL Server</span><span>REST APIs</span>
        </Reveal>
        <Reveal delay={420} className="hero-resume">
          <a className="resume-link" href={profile.resumeUrl} aria-label="Download resume">Resume <ArrowDownRight size={17} /></a>
        </Reveal>
      </section>

      <section id="about" className="section about"><SectionHeading eyebrow="01 — Profile" title={<>A thoughtful approach to<br /><em>building on the web.</em></>} /><div className="about-layout"><Reveal className="about-reveal"><p className="about-copy">I turn product requirements into interfaces that are useful, fast, and straightforward to evolve. My work sits at the intersection of frontend engineering, API integration, and deliberate user experience.</p></Reveal><div className="stat-grid">{stats.map((stat, index) => <Reveal className="stat-reveal" key={stat.label} delay={index * 80}><div className="stat-card"><strong>{stat.value}</strong><span>{stat.label}</span></div></Reveal>)}</div></div></section>

      <section id="experience" className="section experience"><SectionHeading eyebrow="02 — Experience" title={<>Professional context,<br /><em>ready for your story.</em></>} copy="Replace the structured placeholders below with your verified experience." /><Reveal className="timeline"><div>{experience.map((item, index) => <Reveal className="timeline-item" delay={index * 100} key={`${item.company}-${item.period}`}><div className="timeline-dot" /><p className="timeline-period">{item.period}</p><div><h3>{item.role}</h3><h4>{item.company}</h4><p>{item.summary}</p><div className="tags">{item.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></div></Reveal>)}</div></Reveal></section>

      <section id="toolkit" className="section skills"><SectionHeading eyebrow="03 — Toolkit" title={<>A practical toolkit for<br /><em>modern product work.</em></>} /><div className="skill-groups">{skillGroups.map(([group, skills], index) => <Reveal className="skill-group" delay={index * 90} key={group}><h3>{group}</h3><div>{skills.map(skill => <span key={skill}><Check size={14} /> {skill}</span>)}</div></Reveal>)}</div></section>

      <SkillsHorizontalSection />

      <section id="projects" className="section projects"><SectionHeading eyebrow="05 — Selected projects" title={<>Project work, structured<br /><em>for a closer look.</em></>} copy="Each card is intentionally configured as a placeholder for your real case studies." /><div className="project-grid">{projects.map((project, index) => <Reveal className="project-reveal" delay={index * 90} key={project.title}><article className="project-card"><div className={`project-visual visual--${project.accent}`}><div className="visual-window"><i /><i /><i /><div /></div><span>{`0${index + 1}`}</span></div><div className="project-body"><div><p>{project.technologies.join(' · ')}</p><h3>{project.title}</h3></div><p>{project.description}</p><details><summary>Project details <ArrowDownRight size={16} /></summary><p><b>Problem:</b> {project.problem}</p><div className="tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></details></div></article></Reveal>)}</div></section>

      <section className="section expertise"><SectionHeading eyebrow="06 — Engineering focus" title={<>More than a set<br />of <em>technologies.</em></>} /><div className="expertise-grid">{expertise.map(({ title, detail, icon: Icon }, index) => <Reveal className="expertise-reveal" delay={index * 75} key={title}><article><Icon size={22} /><h3>{title}</h3><p>{detail}</p></article></Reveal>)}</div></section>

      <section className="section process"><SectionHeading eyebrow="07 — How I build" title={<>A clear path from<br /><em>brief to iteration.</em></>} /><ol>{processSteps.map(([step, detail], index) => <Reveal delay={index * 65} key={step}><li className={activeStep === index ? 'is-active' : ''}><button type="button" onClick={() => setActiveStep(index)} aria-expanded={activeStep === index}><span>0{index + 1}</span><b>{step}</b><ArrowUpRight size={17} /></button><p>{detail}</p></li></Reveal>)}</ol></section>

      <section id="contact" className="contact"><div className="contact-orb" /><div className="contact-content"><Reveal><span className="kicker">08 — Contact</span><h2>Let&apos;s build something<br /><em>useful together.</em></h2><p>Have a role, project, or idea to discuss? Send a message and make this portfolio yours by connecting the form to your preferred API.</p><div className="contact-links"><a href={`mailto:${profile.email}`}><Mail size={17} /> {profile.email}</a><a href={profile.social.linkedin}><Link size={17} /> LinkedIn</a><a href={profile.social.github}><GitFork size={17} /> GitHub</a></div></Reveal><Reveal delay={140}><ContactForm /></Reveal></div><footer><span>© {new Date().getFullYear()} {profile.name}</span><span>Designed & built with TypeScript</span><a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Back to top <ChevronUp size={15} /></a></footer></section>
    </main>

    <AiAssistantModal
      isOpen={aiModalOpen}
      onClose={() => setAiModalOpen(false)}
      onSpeakingChange={setIsAiSpeaking}
    />
  </>
}
export default App
