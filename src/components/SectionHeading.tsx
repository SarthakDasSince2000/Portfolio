import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: ReactNode; copy?: string }) {
  return <Reveal className="section-heading"><span className="kicker">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</Reveal>
}
