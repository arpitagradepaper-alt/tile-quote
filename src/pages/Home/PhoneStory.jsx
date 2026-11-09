import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'
import Counter from '../../components/common/Counter.jsx'
import './PhoneStory.css'

const STEPS = [
  ['\u{1F4DD}', 'Make the quote', 'Type room sizes and pick a tile. Boxes, extra for cutting, adhesive, grout and GST are worked out for you.', ['Live total as you build', 'Cheaper old stock suggested']],
  ['\u{1F4AC}', 'Share on WhatsApp', 'A branded PDF opens straight in the customer chat. No app, no sign-up for them.', ['Marked as sent automatically', 'Secure private link']],
  ['\u{1F514}', 'Follow up', 'Due follow-ups show on your dashboard with a Remind button that opens WhatsApp with the message ready.', ['Up to five follow-up days', 'Customer replied? One tap']],
  ['\u2705', 'Close and mark won', 'Call to confirm, tap won, and stock reduces once, automatically. It all counts in your reports.', ['Stock reduces only once', 'Owner sees every result']]
]

const pop = (d) => ({ initial: { opacity: 0, y: 16, scale: 0.92 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { delay: d, type: 'spring', stiffness: 240, damping: 20 } })

function S1() {
  const rows = [['Living room \u00B7 12 \u00D7 14 ft', 'Marble White', '12 boxes'], ['Bedroom \u00B7 10 \u00D7 11 ft', 'Rustic Grey', '8 boxes']]
  return (
    <div className="pss">
      <div className="pss-h"><b>New quote</b><em>Live</em></div>
      <div className="pss-in"><small>Customer</small><span>Sharma Residence</span></div>
      {rows.map(([a, b, c], i) => (
        <motion.div key={a} className="pss-row" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.2 }}>
          <div><b>{a}</b><small>{b}</small></div><em>{c}</em>
        </motion.div>
      ))}
      <div className="pss-tags"><span>Adhesive + grout</span><span>GST 18%</span></div>
      <motion.div className="pss-total" {...pop(0.8)}>
        <span>Quote total</span><b><Counter to={48620} prefix={'\u20B9 '} dur={1.4} /></b>
      </motion.div>
    </div>
  )
}

function S2() {
  return (
    <div className="pss">
      <div className="pss-h"><b>Sharma Residence</b><em>WhatsApp</em></div>
      <motion.div className="pss-b" {...pop(0.2)}>Namaste Mr. Sharma, your tile quotation is ready.</motion.div>
      <motion.div className="pss-b pdf" {...pop(0.6)}>
        <i>PDF</i><div><b>Quotation Q-0001</b><small>Total &#8377; 48,620 &middot; 20 boxes</small></div>
      </motion.div>
      <motion.div className="pss-b me" {...pop(1.1)}>Looks good! Can you deliver this week?</motion.div>
      <motion.div className="pss-btn" animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2 }}>Share on WhatsApp</motion.div>
      <motion.div className="pss-ok" {...pop(1.5)}>&#10003;&#10003; Sent &middot; follow-ups set</motion.div>
    </div>
  )
}

function S3() {
  return (
    <div className="pss">
      <div className="pss-h"><b>My dashboard</b><em>Due: 1</em></div>
      <motion.div className="pss-due" {...pop(0.2)}>
        <motion.span animate={{ rotate: [0, -18, 18, -12, 12, 0] }} transition={{ repeat: Infinity, duration: 1.2, repeatDelay: 1.4 }}>&#128276;</motion.span>
        <div><b>Follow-up due: Day 2</b><small>Sharma Residence</small></div>
        <i>Remind</i>
      </motion.div>
      <motion.div className="pss-b" {...pop(0.8)}>Hi Mr. Sharma, just checking on your tile quotation.</motion.div>
      <motion.div className="pss-b me" {...pop(1.4)}>Looks good, please confirm the order!</motion.div>
      <motion.div className="pss-ok" {...pop(1.9)}>&#10003; Customer replied &middot; call list</motion.div>
    </div>
  )
}

function S4() {
  const pills = ['Draft', 'Sent', 'Replied', 'Won']
  return (
    <div className="pss">
      <div className="pss-h"><b>Quote Q-0001</b><em>Sharma Residence</em></div>
      <div className="pss-pills">
        {pills.map((p, i) => (
          <motion.span key={p} className={i === 3 ? 'on' : 'done'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.18 }}>{p}</motion.span>
        ))}
      </div>
      <motion.div className="pss-won" {...pop(0.8)}>
        <small>ORDER WON</small><b>&#8377; 48,620</b>
      </motion.div>
      <div className="pss-stock">
        <p><span>Marble White stock</span><b>120 &rarr; 108</b></p>
        <div className="pss-meter"><motion.div initial={{ width: '100%' }} animate={{ width: '90%' }} transition={{ delay: 1.2, duration: 0.8 }} /></div>
        <small>Stock reduced once, automatically</small>
      </div>
    </div>
  )
}

const SCENES = [S1, S2, S3, S4]

export default function PhoneStory() {
  const ref = useRef(null)
  const [i, setI] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  useMotionValueEvent(scrollYProgress, 'change', v => {
    const n = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)))
    setI(prev => (prev === n ? prev : n))
  })

  const Scene = SCENES[i]

  return (
    <section className="ps" ref={ref}>
      <div className="ps-stick">
        <div className="ps-in">
          <div className="ps-text">
            <span className="ps-eye">SEE IT WORK &middot; SCROLL</span>
            <h2>From room sizes to <span className="yl">a won order</span></h2>
            <div className="ps-list">
              <div className="ps-track"><motion.div className="ps-fill" style={{ scaleY: bar }} /></div>
              {STEPS.map(([ic, t, d, pts], k) => (
                <div key={t} className={'ps-item' + (k === i ? ' on' : '')}>
                  <span>{ic}</span>
                  <div>
                    <small>STEP {k + 1}</small>
                    <b>{t}</b>
                    <p>{d}</p>
                    <ul>{pts.map(x => <li key={x}>{x}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="ps-dots">
              {STEPS.map((s, k) => <i key={k} className={k === i ? 'on' : ''} />)}
            </div>
          </div>

          <div className="ps-wrap">
            <span className="ps-d d1" /><span className="ps-d d2" />
            <div className="ps-phone">
              <div className="ps-screen">
                <AnimatePresence mode="wait">
                  <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.3 }}>
                    <Scene />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
