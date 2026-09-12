import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionHeading } from './SectionHeading'
import { services } from '../data/portfolio'

gsap.registerPlugin(ScrollTrigger)

export function SkillsHorizontalSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const wrapper = wrapperRef.current
    const track = trackRef.current

    if (!section || !wrapper || !track) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 851px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions as {
          isDesktop: boolean
          reduceMotion: boolean
        }

        if (!isDesktop || reduceMotion) {
          gsap.set(track, { clearProps: 'all' })
          track.style.paddingLeft = '0px'
          track.style.paddingRight = '0px'
          return
        }

        const setupTrackLayout = () => {
          const cards = track.querySelectorAll<HTMLElement>('.service-card')
          if (cards.length === 0) return 0
          const firstCard = cards[0]
          const cardWidth = firstCard.offsetWidth
          
          // Symmetrical focus offset centering active card in the wrapper
          const focusOffset = Math.max(32, (wrapper.clientWidth - cardWidth) / 2)
          track.style.paddingLeft = `${focusOffset}px`
          track.style.paddingRight = `${focusOffset}px`
          
          // Total distance to move Card 1 in focus -> Card 3 in focus
          return Math.max(0, track.scrollWidth - wrapper.clientWidth)
        }

        const tween = gsap.to(track, {
          x: () => -setupTrackLayout(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: 'top top',
            end: () => `+=${Math.max(window.innerHeight * 1.5, setupTrackLayout() * 1.5)}`,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
          track.style.paddingLeft = ''
          track.style.paddingRight = ''
        }
      }
    )

    return () => {
      mm.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="section services skills-horizontal-section"
      aria-label="Skills & Services"
    >
      <span id="services" className="skills-legacy-anchor" aria-hidden="true" />
      <div className="skills-section-content">
        <SectionHeading
          eyebrow="04 — What I do"
          title={
            <>
              From interface to
              <br />
              <em>implementation.</em>
            </>
          }
        />
      </div>

      <div className="skills-track-wrapper" ref={wrapperRef}>
        <div className="skills-track" ref={trackRef}>
          {services.map(({ title, description, icon: Icon }, index) => (
            <article className="service-card" key={title}>
              <Icon />
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <ArrowUpRight className="service-arrow" size={20} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
