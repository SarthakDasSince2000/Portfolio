import { useEffect, useRef, useState } from 'react'
import { X, Send, Bot, User, Sparkles, ExternalLink } from 'lucide-react'
import { sarthakProfile, quickPrompts, answerQuestion } from '../data/sarthakProfile'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
}

interface AiAssistantModalProps {
  isOpen: boolean
  onClose: () => void
  onSpeakingChange?: (isSpeaking: boolean) => void
}

export function AiAssistantModal({ isOpen, onClose, onSpeakingChange }: AiAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hi, I'm Sarthak's AI assistant. Ask me anything about Sarthak's professional background, verified skills, and experience.`,
      timestamp: 'Just now',
    },
  ])
  const [inputVal, setInputVal] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  // Focus input & handle ESC
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    const timeout = setTimeout(() => inputRef.current?.focus(), 150)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timeout)
    }
  }, [isOpen, onClose])

  const messageCounter = useRef(1)

  const handleSend = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    messageCounter.current += 1
    const userMsgId = `user-${messageCounter.current}`
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: trimmed,
      timestamp: 'Just now',
    }

    setMessages((prev) => [...prev, userMsg])
    setInputVal('')
    setIsTyping(true)
    onSpeakingChange?.(true)

    // Simulate natural AI thinking & response
    setTimeout(() => {
      messageCounter.current += 1
      const aiMsgId = `ai-${messageCounter.current}`
      const reply = answerQuestion(trimmed)
      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: reply,
        timestamp: 'Just now',
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)

      // Keep speaking indicator active briefly while reading
      setTimeout(() => {
        onSpeakingChange?.(false)
      }, 1200)
    }, 450)
  }

  if (!isOpen) return null

  return (
    <div className="ai-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="ai-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-modal-title"
      >
        {/* Header */}
        <div className="ai-modal-header">
          <div className="ai-modal-profile">
            <div className="ai-modal-avatar">
              <Bot size={18} />
            </div>
            <div>
              <h2 id="ai-modal-title" className="ai-modal-title">
                {sarthakProfile.name}&apos;s AI
              </h2>
              <div className="ai-modal-status">
                <span className="status-dot-pulse" />
                <span className="status-dot" />
                <span>Online · Verified Profile</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="ai-modal-close"
            onClick={onClose}
            aria-label="Close AI dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Feed */}
        <div className="ai-modal-body">
          <div className="ai-messages-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-message-row ${msg.sender === 'user' ? 'is-user' : 'is-ai'}`}
              >
                <div className="ai-message-avatar">
                  {msg.sender === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                </div>
                <div className="ai-message-content">
                  <p className="ai-message-text">{msg.text}</p>
                  <span className="ai-message-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ai-message-row is-ai">
                <div className="ai-message-avatar">
                  <Sparkles size={14} />
                </div>
                <div className="ai-message-content">
                  <div className="ai-typing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="ai-quick-prompts-section">
            <span className="quick-prompts-label">Suggested questions:</span>
            <div className="quick-prompts-grid">
              {quickPrompts.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="quick-prompt-chip"
                  onClick={() => handleSend(p.query)}
                  disabled={isTyping}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Footer */}
        <form
          className="ai-modal-footer"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(inputVal)
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="ai-chat-input"
            placeholder="Ask about Sarthak's skills, experience, or projects..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            className="ai-send-btn"
            disabled={!inputVal.trim() || isTyping}
            aria-label="Send question"
          >
            <Send size={16} />
          </button>
        </form>

        {/* Grounding Attribution Footer */}
        <div className="ai-modal-disclaimer">
          <span>Answers grounded strictly in verified profile data.</span>
          <a
            href={sarthakProfile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="ai-linkedin-link"
          >
            LinkedIn <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  )
}
