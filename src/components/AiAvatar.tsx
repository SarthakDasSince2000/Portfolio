import { useEffect, useRef, useState } from 'react'
import { Sparkles, MessageSquareCode } from 'lucide-react'
import { AI_PROFILE_IMAGE, sarthakProfile } from '../data/sarthakProfile'

interface AiAvatarProps {
  onOpenChat: () => void
  isSpeaking?: boolean
}

export function AiAvatar({ onOpenChat, isSpeaking = false }: AiAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const targetOffset = useRef({ x: 0, y: 0 })
  const currentOffset = useRef({ x: 0, y: 0 })
  const animationFrameId = useRef<number | null>(null)
  const [imgSrc, setImgSrc] = useState(AI_PROFILE_IMAGE)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Maximum subtle shift is between -6px and +6px
      const deltaX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2)))
      const deltaY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2)))

      targetOffset.current = {
        x: deltaX * 6,
        y: deltaY * 6,
      }
    }

    const handleMouseLeave = () => {
      targetOffset.current = { x: 0, y: 0 }
    }

    const animate = () => {
      // Smooth spring inertia
      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * 0.08
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * 0.08

      setOffset({
        x: Number(currentOffset.current.x.toFixed(2)),
        y: Number(currentOffset.current.y.toFixed(2)),
      })

      animationFrameId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  return (
    <div className="hero-ai-wrapper" ref={containerRef}>
      {/* Full Body Interactive Avatar */}
      <div
        className={`hero-ai-avatar ${isSpeaking ? 'is-speaking' : ''}`}
        onClick={onOpenChat}
        role="button"
        tabIndex={0}
        aria-label="Open Sarthak's AI assistant conversation"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpenChat()
          }
        }}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        }}
      >
        {/* Ambient Halo behind character */}
        <div
          className="ai-ambient-glow"
          style={{
            transform: `translate3d(${offset.x * 1.4}px, ${offset.y * 1.4}px, 0)`,
          }}
        />

        {/* Full Character Artwork Container */}
        <div className="ai-portrait-frame">
          {!imgError ? (
            <img
              src={imgSrc}
              alt={`${sarthakProfile.name} AI Digital Twin`}
              className="ai-portrait-img"
              onError={() => {
                if (imgSrc.endsWith('.png')) {
                  setImgSrc('/images/sarthak-das.svg')
                } else {
                  setImgError(true)
                }
              }}
            />
          ) : (
            <div className="ai-portrait-fallback">
              <span className="fallback-initials">{sarthakProfile.initials}</span>
              <span className="fallback-tag">AI TWIN</span>
            </div>
          )}
        </div>

        {/* Live Speaking / Audio Pulse Indicator */}
        {isSpeaking ? (
          <div className="ai-speaking-indicator" title="Speaking">
            <span className="wave-bar bar-1" />
            <span className="wave-bar bar-2" />
            <span className="wave-bar bar-3" />
            <span className="wave-bar bar-4" />
          </div>
        ) : (
          <div className="ai-online-indicator" title="AI Twin Online">
            <span className="status-dot-pulse" />
            <span className="status-dot" />
          </div>
        )}
      </div>

      {/* Meet Sarthak's AI Action Button */}
      <button
        type="button"
        className="hero-ai-badge"
        onClick={onOpenChat}
        aria-label="Meet Sarthak's AI Assistant"
      >
        <span className="badge-sparkle">
          <Sparkles size={13} />
        </span>
        <span className="badge-text">Meet Sarthak&apos;s AI</span>
        <span className="badge-arrow">
          <MessageSquareCode size={13} />
        </span>
      </button>
    </div>
  )
}
