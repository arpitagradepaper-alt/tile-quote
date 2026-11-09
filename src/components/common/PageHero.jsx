import Reveal from './Reveal.jsx'
import './PageHero.css'

export default function PageHero({ chip, children, sub }) {
  return (
    <section className="ph">
      <div className="ph-in">
        <Reveal><span className="ph-chip">{chip}</span></Reveal>
        <h1>{children}</h1>
        <Reveal delay={0.4}><p>{sub}</p></Reveal>
      </div>
    </section>
  )
}
