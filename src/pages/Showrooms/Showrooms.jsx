import { useRef, useState, useEffect } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import PageHero from '../../components/common/PageHero.jsx'
import Words from '../../components/common/Words.jsx'
import Reveal from '../../components/common/Reveal.jsx'
import Tilt from '../../components/common/Tilt.jsx'
import Counter from '../../components/common/Counter.jsx'
import Cta from '../../components/common/Cta.jsx'
import { Journey, Calls } from './ShowroomExtras.jsx'
import './Showrooms.css'

const OWNER = [
  'Dashboard and sales reports',
  'Tiles, prices and stock',
  'Your sales team',
  'Calculation rules and quote terms',
  'Every quote and customer'
]
const SALES = [
  'Quotes from room sizes',
  'One-tap WhatsApp sharing',
  'Follow-up reminders',
  'Own customers and call-backs',
  'Works from their own phone'
]

const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
const QUOTED = [10, 12, 9, 14, 11, 13, 10, 15, 12, 16, 14, 18]
const WON = [5, 6, 4, 7, 5, 6, 5, 8, 6, 8, 7, 9]

const LOW = [
  ['Matt Marble 24\u00D724', 6],
  ['Wood Plank 8\u00D748', 4],
  ['Anti-skid 12\u00D712', 8],
  ['Glossy White 12\u00D718', 3]
]

const TEAM = [
  ['\u{1F465}', 'Add and manage salespersons', 'Own login for each person. Reset passwords or switch someone off in a tap.'],
  ['\u{1F4CA}', 'Track each person', 'Quotes and orders won in the last 30 days, last login, status.'],
  ['\u2699\uFE0F', 'Calculation rules', 'GST %, extra for cutting %, adhesive and grout rates, quote validity.'],
  ['\u{1F4C4}', 'Your shop on every quote', 'Shop details and your own terms and conditions printed on the PDF.'],
  ['\u{1F514}', 'Follow-up schedule', 'Choose the days your team is reminded to chase customers.'],
  ['\u{1F441}\uFE0F', 'See everything', 'All quotes, customers and WhatsApp messages across the showroom. Create quotes for your team and delete quotes. Won quotes stay protected.']
]

const WHY = [
  ['Quotes in minutes', 'not hours of hand work'],
  ['Fewer lost enquiries', 'every follow-up reminded'],
  ['Delight customers', 'clean PDF on WhatsApp']
]

const SAFE = [
  ['\u{1F4F1}', 'Phone-first design', 'Tab bar, card lists and a live total bar. Runs in the browser on Android, iPhone and computers.'],
  ['\u{1F512}', 'Secure logins', 'Strong password storage, lockout after wrong attempts, temporary passwords that must be changed.'],
  ['\u{1F6E1}\uFE0F', 'Your data stays yours', "Each showroom's data is private. Salespersons see only their own work."],
  ['\u2705', 'Thoroughly tested', 'automated tests cover calculations, workflows and security.']
]

function Dec({ to, suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    const c = animate(0, to, { duration: 2, ease: 'easeOut', onUpdate: v => setN(v) })
    return () => c.stop()
  }, [seen])
  return <span ref={ref}>{prefix}{n.toFixed(1)}{suffix}</span>
}

function Roles() {
  return (
    <section className="sec sr-roles">
      <Reveal>
        <Tilt className="role own">
          <span className="role-chip">For the owner</span>
          <h2>Full control of the <span className="ph-y">business</span></h2>
          <ul>
            {OWNER.map((t, i) => (
              <motion.li key={t}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.09 }}>
                <i>&#10003;</i>{t}
              </motion.li>
            ))}
          </ul>
        </Tilt>
      </Reveal>
      <Reveal delay={0.15}>
        <Tilt className="role sal">
          <span className="role-chip">For the salesperson</span>
          <h2>Everything needed to <span className="gt">close</span></h2>
          <ul>
            {SALES.map((t, i) => (
              <motion.li key={t}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.09 }}>
                <i>&#10003;</i>{t}
              </motion.li>
            ))}
          </ul>
        </Tilt>
      </Reveal>
    </section>
  )
}

function Reports() {
  const [range, setRange] = useState(6)
  const labels = MONTHS.slice(-range)
  const q = QUOTED.slice(-range)
  const w = WON.slice(-range)
  const max = 20

  return (
    <div className="alt">
      <section className="sec">
        <Reveal>
          <span className="eyebrow">OWNER &middot; SALES REPORTS</span>
          <h2>See your whole showroom <span className="gt">at a glance</span></h2>
          <p className="sub">Last 3, 6 or 12 months. Average quote and win rate, top tiles sold by boxes, team performance, and one-click CSV export.</p>
        </Reveal>

        <div className="sr-kpis">
          {[
            ['Sales from quotes', <Dec key="a" to={8.4} prefix={'\u20B9 '} suffix=" L" />, 'Orders won, in rupees'],
            ['Quotes made', <Counter key="b" to={142} />, 'Sent and drafts waiting'],
            ['Open quotes', <Dec key="c" to={12.1} prefix={'\u20B9 '} suffix=" L" />, 'Value waiting for reply'],
            ['Conversion', <><Counter key="d" to={31} />%</>, 'Quotes turned into orders']
          ].map(([k, v, s], i) => (
            <Reveal key={k} delay={i * 0.08}>
              <Tilt className="kpi"><small>{k}</small><h3 className="gt">{v}</h3><p>{s}</p></Tilt>
            </Reveal>
          ))}
        </div>

        <div className="sr-rep">
          <Reveal>
            <div className="card chart">
              <div className="chart-top">
                <b>Quoted vs won value</b>
                <div className="seg">
                  {[3, 6, 12].map(r => (
                    <button key={r} className={range === r ? 'on' : ''} onClick={() => setRange(r)}>
                      {range === r && <motion.span layoutId="seg" className="seg-bg" />}
                      <span>{r}M</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bars">
                {labels.map((m, i) => (
                  <div key={m} className="bcol">
                    <div className="bpair">
                      <motion.div className="bar q" initial={{ height: 0 }} animate={{ height: (q[i] / max) * 100 + '%' }} transition={{ duration: 0.7, delay: i * 0.05 }} />
                      <motion.div className="bar w" initial={{ height: 0 }} animate={{ height: (w[i] / max) * 100 + '%' }} transition={{ duration: 0.7, delay: i * 0.05 + 0.1 }} />
                    </div>
                    <small>{m}</small>
                  </div>
                ))}
              </div>
              <div className="legend"><span><i className="q" />Quoted</span><span><i className="w" />Won</span><em>Sample data</em></div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="card low">
              <b>Low stock</b>
              {LOW.map(([n, c], i) => (
                <motion.p key={n}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.12 }}>
                  <span>{n}</span><em>{c} boxes</em>
                </motion.p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function Team() {
  return (
    <section className="sec">
      <Reveal>
        <span className="eyebrow">TEAM AND RULES</span>
        <h2>Your team, <span className="gt">your rules</span></h2>
      </Reveal>
      <div className="sr-g3">
        {TEAM.map(([ic, t, d], i) => (
          <Reveal key={t} delay={(i % 3) * 0.1}>
            <Tilt className="card"><span className="ic">{ic}</span><h3>{t}</h3><p>{d}</p></Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Why() {
  return (
    <div className="alt">
      <section className="sec sr-why">
        <Reveal>
          <span className="ph-chip2">Why choose Tile Quote?</span>
          <h2>Work smarter. <span className="gt">Grow faster.</span></h2>
          <p className="lead2">Powerful features designed to save time, improve follow-through and boost your showroom&apos;s sales.</p>
          <ul className="why-ticks">
            {['Save time with automatic calculations', 'Never forget a customer follow-up', 'Know your stock before you promise'].map(t => (
              <li key={t}><i>&#10003;</i>{t}</li>
            ))}
          </ul>
        </Reveal>
        <div className="why-cards">
          {WHY.map(([t, d], i) => (
            <motion.div key={t}
              className={'why-c c' + i}
              initial={{ opacity: 0, x: i % 2 ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}>
              <b>{t}</b><span>{d}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Safe() {
  return (
    <section className="sec">
      <Reveal>
        <span className="eyebrow">SAFE AND RELIABLE</span>
        <h2>Works on every phone, <span className="gt">built to be safe</span></h2>
      </Reveal>
      <div className="sr-g4">
        {SAFE.map(([ic, t, d], i) => (
          <Reveal key={t} delay={i * 0.1}>
            <Tilt className="card">
              <span className="ic">{ic}</span>
              <h3>{t}</h3>
              <p>{i === 3 ? <><b className="gt big"><Counter to={106} /></b> {d}</> : d}</p>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default function Showrooms() {
  return (
    <>
      <PageHero chip="For owners and teams" sub="Full control for the owner. Everything needed to close for the salesperson.">
        <Words text="One app, two roles," />
        <Words className="ph-y" text="one showroom" delay={0.4} />
      </PageHero>
      <Roles />
      <Journey />
      <Reports />
      <Calls />
      <Team />
      <Why />
      <Safe />
      <Cta />
    </>
  )
}
