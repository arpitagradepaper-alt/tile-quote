import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import './Cta.css'

const PERKS = [
  'Quote faster, look more professional',
  'Follow up on every enquiry and call',
  'Know your sales and stock at any moment'
]

export default function Cta({ title = "Let's put it to work in your showroom" }) {
  return (
    <section className="sec">
      <Reveal>
        <div className="cta">
          <div>
            <h2>{title}</h2>
            <p>Book a live demo with your own tiles and prices and see your first quote in minutes.</p>
            <div className="cta-row">
              <Link to="/contact" className="btn white">Book a demo</Link>
              <a href="https://wa.me/" className="btn ghost">Chat on WhatsApp</a>
            </div>
          </div>
          <div className="perks">
            {PERKS.map(p => <div key={p}>{p}</div>)}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
