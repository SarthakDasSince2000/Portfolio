import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'

type Status = 'idle' | 'success' | 'error'
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) { setStatus('error'); form.reportValidity(); return }
    setStatus('success')
  }
  return <form className="contact-form" onSubmit={onSubmit} noValidate>
    <div className="form-row"><label>Name<input name="name" required autoComplete="name" placeholder="Your name" /></label><label>Email<input name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label></div>
    <label>Subject<input name="subject" required placeholder="How can I help?" /></label><label>Message<textarea name="message" required rows={4} placeholder="Tell me a little about your project." /></label>
    <div className="form-actions"><button type="submit">Send message <Send size={16} /></button>{status === 'success' && <span role="status">Thanks — your message is ready for API integration.</span>}{status === 'error' && <span role="alert">Please complete the required fields.</span>}</div>
  </form>
}
