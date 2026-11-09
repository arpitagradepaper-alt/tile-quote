import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useInView } from 'framer-motion'
import PageHero from '../../components/common/PageHero.jsx'
import Words from '../../components/common/Words.jsx'
import Reveal from '../../components/common/Reveal.jsx'
import Tilt from '../../components/common/Tilt.jsx'
import Counter from '../../components/common/Counter.jsx'
import Cta from '../../components/common/Cta.jsx'
import './HowItWorks.css'

const STATUS = ['Draft', 'Sent', 'Replied', 'Won']

const STEPS = [
  ['\u{1F4DD}', 'Make the Quote', 'Room sizes and tiles in, full price out.',
    ['Length x width for every room', 'Boxes, cutting extra, adhesive, grout and GST added', 'Live total as you build']],
  ['\u{1F4AC}', 'Share on WhatsApp', 'PDF link opens in the customer chat.',
    ['Branded PDF with your terms', 'Marked as sent automatically', 'Secure private link for each quote']],
  ['\u{1F514}', 'Follow Up', 'Due follow-ups show with a Remind button.',
    ['Up to five follow-up days', 'Due ones show on the dashboard', 'Remind opens WhatsApp with the message ready']],
  ['\u260E\uFE0F', 'Close the Sale', 'Customer replied? Call them to confirm.',
    ['Tap Customer replied', 'Customer moves to your call list', 'Tap to call and confirm the order']],
  ['\u2705', 'Mark Won', 'Stock reduces automatically, once.',
    ['One tap to mark won', 'Stock reduces only once', 'Counts in your sales reports']]
]

const MSGS = [
  { me: true, text: 'Namaste Mr. Sharma, your tile quotation is ready.' },
  { me: true, pdf: true },
  { me: false, text: 'Looks good! Can you deliver this week?' },
  { me: true, text: 'Yes, delivery in 3 days. Valid for 15 days.' }
]

const FOLLOW = [
  [2, '1st', 'First nudge'],
  [5, '2nd', 'Second reminder'],
  [10, 'Final', 'Final follow-up']
]

function Pipeline() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % (STATUS.length + 1)), 1300)
    return () => clearInterval(t)
  }, [])
  return (
    <Reveal>
      <div className="hw-pipe">
        <b>Every quote has a clear status:</b>
        {STATUS.map((s, k) => (
          <span key={s} className="hw-pl">
            <span className={'pill-s' + (k === i ? ' on' : k < i ? ' done' : '')}>{s}</span>
            {k < STATUS.length - 1 && <span className="arr">&rarr;</span>}
          </span>
        ))}
        <span className="arr">or</span>
        <span className="pill-s lost">Lost</span>
      </div>
    </Reveal>
  )
}

function Timeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })

  return (
    <section className="sec">
      <Reveal>
        <span className="eyebrow">THE FLOW</span>
        <h2>Five steps, <span className="gt">zero confusion</span></h2>
        <p className="sub">Scroll down and follow a quote from the first enquiry to a won order.</p>
      </Reveal>

      <div className="tl" ref={ref}>
        <div className="tl-track"><motion.div className="tl-fill" style={{ scaleY: fill }} /></div>
        {STEPS.map(([ic, t, d, pts], i) => (
          <div key={t} className={'tl-step ' + (i % 2 ? 'r' : 'l')}>
            <motion.div
              className="tl-card"
              initial={{ opacity: 0, x: i % 2 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="tl-ic">{ic}</span>
              <small>STEP {i + 1}</small>
              <h3>{t}</h3>
              <p>{d}</p>
              <ul>{pts.map(p => <li key={p}>{p}</li>)}</ul>
            </motion.div>
            <motion.div
              className="tl-node"
              initial={{ scale: 0.6 }}
              whileInView={{ scale: 1, backgroundColor: '#D9622B', color: '#ffffff' }}
              viewport={{ once: true, margin: '-35% 0px -35% 0px' }}
              transition={{ duration: 0.5 }}
            >
              {i + 1}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Typing({ side }) {
  return (
    <div className={'b ' + side + ' typing'}>
      {[0, 1, 2].map(k => (
        <motion.span key={k} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: k * 0.15 }} />
      ))}
    </div>
  )
}

function ChatDemo() {
  const ref = useRef(null)
  const seen = useInView(ref, { amount: 0.4 })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!seen) return
    const wait = n >= MSGS.length ? 3800 : 1500
    const t = setTimeout(() => setN(v => (v >= MSGS.length ? 0 : v + 1)), wait)
    return () => clearTimeout(t)
  }, [seen, n])

  const next = MSGS[n]

  return (
    <div className="alt">
      <section className="sec hw-split">
        <Reveal>
          <Tilt className="phone">
            <div ref={ref} className="phone-in">
              <div className="phead">Sharma Residence</div>
              <div className="pbody">
                {MSGS.slice(0, n).map((m, k) => (
                  <motion.div
                    key={k}
                    className={'b ' + (m.me ? 'l' : 'r') + (m.pdf ? ' pdf' : '')}
                    initial={{ opacity: 0, y: 18, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    {m.pdf ? (
                      <>
                        <i>PDF</i>
                        <div><b>Quotation Q-0001</b><small>Total &#8377; 48,620 &middot; 20 boxes</small></div>
                      </>
                    ) : m.text}
                  </motion.div>
                ))}
                {next && seen && <Typing side={next.me ? 'l' : 'r'} />}
              </div>
              <motion.div className="pbtn" animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                Share on WhatsApp
              </motion.div>
            </div>
          </Tilt>
        </Reveal>

        <Reveal delay={0.15}>
          <span className="ph-chip2">Step 2 &middot; Share on WhatsApp</span>
          <h2>A professional quote, <span className="gt">sent in seconds</span></h2>
          <p className="lead2">Your shop details, itemised rooms, totals, validity and your own terms, in a branded PDF your customer opens straight from WhatsApp.</p>
          <ul className="hw-ticks">
            <li><i>&#10003;</i><div><b>Branded PDF quotation</b><span>Itemised rooms, totals and your terms and conditions.</span></div></li>
            <li><i>&#10003;</i><div><b>Marked as sent automatically</b><span>Follow-up dates are set the moment you share.</span></div></li>
            <li><i>&#10003;</i><div><b>Secure private link</b><span>Each quote has its own unguessable link for the customer.</span></div></li>
          </ul>
        </Reveal>
      </section>
    </div>
  )
}

function Follow() {
  return (
    <section className="sec">
      <Reveal>
        <span className="eyebrow">STEP 3 &middot; FOLLOW UP</span>
        <h2>Follow-ups <span className="gt">nobody forgets</span></h2>
        <p className="sub">Your showroom sets the follow-up days (up to five). Due ones show on the dashboard with a Remind button that opens WhatsApp with the message ready.</p>
      </Reveal>

      <div className="fbar">
        <motion.div
          className="ffill"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
        />
      </div>

      <div className="fgrid">
        {FOLLOW.map(([day, big, small], i) => (
          <Reveal key={big} delay={i * 0.15}>
            <Tilt className={'fcard' + (i === 2 ? ' last' : '')}>
              <motion.span
                className="fbell"
                animate={{ rotate: [0, -18, 18, -12, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, repeatDelay: 2.5 + i }}
              >
                &#128276;
              </motion.span>
              <small>DAY <Counter to={day} dur={1.4} /></small>
              <h3>{big}</h3>
              <p>{small}</p>
            </Tilt>
          </Reveal>
        ))}
      </div>

      <div className="finfo">
        <Reveal><div className="card"><span className="ic">&#128222;</span><p><b>Customer replied?</b> Tap &quot;Customer replied&quot; and they move to your Customers call list.</p></div></Reveal>
        <Reveal delay={0.1}><div className="card"><span className="ic">&#128172;</span><p>The customer simply receives a clean PDF quotation on WhatsApp. No app, no sign-up.</p></div></Reveal>
      </div>
    </section>
  )
}

export default function HowItWorks() {
  return (
    <>
      <PageHero chip="Simple workflow" sub="A clear path your whole team can follow, with every quote tracked from first enquiry to won order.">
        <Words text="From enquiry to order in" />
        <Words className="ph-y" text="five steps" delay={0.4} />
      </PageHero>
      <Pipeline />
      <Timeline />
      <ChatDemo />
      <Follow />
      <Cta />
    </>
  )
}
