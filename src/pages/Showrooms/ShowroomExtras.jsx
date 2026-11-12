import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, animate } from 'framer-motion'
import Reveal from '../../components/common/Reveal.jsx'
import './ShowroomExtras.css'

/* runs 0..n-1 in a loop, only while the section is on screen */
function useLoop(n, ms, paused) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-80px' })
  const [i, setI] = useState(0)
  useEffect(() => {
    if (!inView || paused) return
    const t = setInterval(() => setI(v => (v + 1) % n), ms)
    return () => clearInterval(t)
  }, [inView, paused, n, ms])
  return [ref, i, setI]
}

function Num({ to, prefix = '', suffix = '', dur = 1.1 }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const c = animate(0, to, { duration: dur, ease: 'easeOut', onUpdate: v => setN(Math.round(v)) })
    return () => c.stop()
  }, [to])
  return <>{prefix}{n.toLocaleString('en-IN')}{suffix}</>
}

/* ---------- 1. QUOTE JOURNEY ---------- */
const STEPS = [
  ['\u{1F4DD}', 'Make the quote', 'Draft'],
  ['\u{1F4AC}', 'Share on WhatsApp', 'Sent'],
  ['\u{1F514}', 'Follow up', 'Sent'],
  ['\u260E\uFE0F', 'Close the sale', 'Replied'],
  ['\u2705', 'Mark won', 'Won']
]

function Stage({ i }) {
  if (i === 0) return (
    <div className="ex-quote">
      {[['Living room \u00B7 12 \u00D7 14 ft', 12], ['Bedroom \u00B7 10 \u00D7 11 ft', 8], ['Kitchen \u00B7 9 \u00D7 10 ft', 6]].map(([r, b], k) => (
        <motion.div key={r} className="ex-qrow" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.25 }}>
          <span>{r}</span><b>{b} boxes</b>
        </motion.div>
      ))}
      <motion.div className="ex-qtotal" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
        <span>Total with GST</span><b className="gt"><Num to={84500} prefix={'\u20B9 '} /></b>
      </motion.div>
    </div>
  )
  if (i === 1) return (
    <div className="ex-chat">
      <motion.div className="ex-bub me" initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.1 }}>Namaste Mr. Sharma, your tile quotation is ready.</motion.div>
      <motion.div className="ex-bub me pdf" initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <span className="ex-pdf">PDF</span><div><b>Quotation Q-0042</b><small>&#8377; 84,500 &middot; secure link</small></div>
        <em className="ex-ticks"><i>&#10003;</i><i>&#10003;</i></em>
      </motion.div>
      <motion.small className="ex-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>Marked as Sent &middot; follow-up dates set</motion.small>
    </div>
  )
  if (i === 2) return (
    <div className="ex-follow">
      {[['Day 2', 'First nudge'], ['Day 5', 'Second reminder'], ['Day 10', 'Final follow-up']].map(([d, t], k) => (
        <motion.div key={d} className="ex-fu" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + k * 0.25 }}>
          <b>{d}</b><span>{t}</span>
          {k === 0 && <button className="ex-remind" tabIndex={-1}>Remind</button>}
        </motion.div>
      ))}
    </div>
  )
  if (i === 3) return (
    <div className="ex-chat">
      <motion.div className="ex-bub them" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>Looks good! Can you deliver this week?</motion.div>
      <motion.div className="ex-callrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <span className="ex-ring"><i /><i /><b>&#9742;</b></span>
        <div><b>Customer replied</b><small>Tap to call and confirm the order</small></div>
      </motion.div>
    </div>
  )
  return (
    <div className="ex-won">
      <motion.svg viewBox="0 0 52 52" className="ex-check" initial="h" animate="s">
        <motion.circle cx="26" cy="26" r="23" fill="none" stroke="#2A9D8F" strokeWidth="3" variants={{ h: { pathLength: 0 }, s: { pathLength: 1 } }} transition={{ duration: 0.6 }} />
        <motion.path d="M15 27l8 8 14-16" fill="none" stroke="#2A9D8F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" variants={{ h: { pathLength: 0 }, s: { pathLength: 1 } }} transition={{ duration: 0.4, delay: 0.5 }} />
      </motion.svg>
      <b>Order won</b>
      <span>Stock reduced once: Matt Marble 24&times;24 &minus;<Num to={20} /> boxes</span>
      <div className="ex-conf">{Array.from({ length: 14 }).map((_, k) => <motion.i key={k} initial={{ y: 0, opacity: 1 }} animate={{ y: -60 - (k % 4) * 14, x: (k - 7) * 14, opacity: 0, rotate: k * 40 }} transition={{ duration: 1.2, delay: 0.7 }} style={{ background: ['#E9B44C', '#D9622B', '#2A9D8F'][k % 3] }} />)}</div>
    </div>
  )
}

export function Journey() {
  const [paused, setPaused] = useState(false)
  const [ref, i, setI] = useLoop(STEPS.length, 3200, paused)
  const pick = k => { setI(k); setPaused(true); clearTimeout(pick.t); pick.t = setTimeout(() => setPaused(false), 9000) }
  return (
    <section className="sec ex" ref={ref}>
      <Reveal>
        <span className="eyebrow">QUOTE TO ORDER</span>
        <h2>Watch one quote travel from enquiry to <span className="gt">won order</span></h2>
        <p className="sub">Tap any step. Every quote has a clear status: Draft, Sent, Replied, then Won or Lost.</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="ex-jr">
          <div className="ex-steps">
            <div className="ex-track"><motion.div className="ex-fill" animate={{ scaleX: i / (STEPS.length - 1) }} transition={{ duration: 0.6 }} /></div>
            {STEPS.map(([ic, t], k) => (
              <button key={t} className={'ex-step' + (k === i ? ' on' : k < i ? ' done' : '')} onClick={() => pick(k)}>
                <span className="ex-dot">{k < i ? '\u2713' : ic}</span>
                <small>{t}</small>
              </button>
            ))}
          </div>
          <div className="ex-pills">
            {['Draft', 'Sent', 'Replied', 'Won'].map(s => <span key={s} className={'ex-pill' + (s === STEPS[i][2] ? ' on' : '')}>{s}</span>)}
          </div>
          <div className="ex-stage">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
                <Stage i={i} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ---------- 2. MISSED CALLS ---------- */
const CALL = [
  ['Incoming call', 'Ringing Ravi first (the customer\u2019s own salesperson)', 'ring'],
  ['No one pressed 1', 'Voicemail never counts as answered. Trying the next person', 'warn'],
  ['Caller chose a call-back', 'Or left a voice message in Hindi or any language', 'warn'],
  ['Call-back task created', 'Due in 15 minutes, red count until someone calls', 'task']
]

export function Calls() {
  const [ref, i] = useLoop(CALL.length, 2600, false)
  const [sec, setSec] = useState(900)
  useEffect(() => {
    if (i !== 3) { setSec(900); return }
    const t = setInterval(() => setSec(s => Math.max(0, s - 37)), 400)
    return () => clearInterval(t)
  }, [i])
  const mm = String(Math.floor(sec / 60)).padStart(2, '0'), ss = String(sec % 60).padStart(2, '0')
  const rep = [['Answered', 82, '%'], ['After-hours calls', 14, ''], ['Avg call-back', 9, ' min'], ['Quotes from calls', 11, '']]
  return (
    <div className="alt">
      <section className="sec ex" ref={ref}>
        <Reveal>
          <span className="eyebrow">TEAM &middot; CALLS</span>
          <h2>Never lose a customer to a <span className="gt">missed call</span></h2>
          <p className="sub">The call rings your team. If nobody picks up, it becomes a call-back task. The owner sees the full report. Needs a phone number and a one-time setup.</p>
        </Reveal>
        <div className="ex-two">
          <Reveal>
            <div className="ex-phone">
              <div className="ex-notch" />
              <AnimatePresence mode="wait">
                <motion.div key={i} className={'ex-call ' + CALL[i][2]} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
                  <span className="ex-ring big"><i /><i /><b>{i === 3 ? '\u23F0' : '\u260E\uFE0F'}</b></span>
                  <h3>{CALL[i][0]}</h3>
                  <p>{CALL[i][1]}</p>
                  {i === 3 && <div className="ex-timer"><b>{mm}:{ss}</b><small>call-back due</small></div>}
                </motion.div>
              </AnimatePresence>
              <div className="ex-dots">{CALL.map((c, k) => <i key={c[0]} className={k === i ? 'on' : ''} />)}</div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="ex-card">
              <div className="ex-head"><b>Owner&apos;s call report</b><span>last 30 days &middot; sample</span></div>
              {rep.map(([l, v, u], k) => (
                <div key={l} className="ex-rep">
                  <div className="ex-rtop"><span>{l}</span><b><Num to={v} suffix={u} /></b></div>
                  {u === '%' && <div className="ex-meter"><motion.i initial={{ width: 0 }} whileInView={{ width: v + '%' }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 }} /></div>}
                  {u !== '%' && <div className="ex-meter"><motion.i initial={{ width: 0 }} whileInView={{ width: Math.min(100, v * (k === 2 ? 6 : 5)) + '%' }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 + k * 0.1 }} /></div>}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

/* ---------- 3. STOCK FROM TALLY ---------- */
const ROWS = [
  ['Matt Marble 24\u00D724', '42 \u2192 36 boxes', 'Updated', 'up'],
  ['Wood Plank 8\u00D748', '9 \u2192 4 boxes', 'Low stock', 'low'],
  ['Stone Grey 16\u00D716', 'New tile', 'New', 'new'],
  ['Glossy White 12\u00D718', 'Size missing', 'Flagged', 'flag']
]

export function StockUpload() {
  const [ref, i] = useLoop(6, 1300, false)
  const shown = Math.max(0, Math.min(ROWS.length, i - 1))
  return (
    <section className="sec ex" ref={ref}>
      <Reveal>
        <span className="eyebrow">OWNER &middot; STOCK</span>
        <h2>Stock from Tally, <span className="gt">checked before it changes</span></h2>
        <p className="sub">Upload an Excel or CSV file, preview every change, then update. Old stock is pushed first with cheaper same-size options.</p>
      </Reveal>
      <div className="ex-two">
        <Reveal>
          <div className="ex-card">
            <div className="ex-head"><b>Upload preview</b><span>boxes &middot; sq ft &middot; sq m</span></div>
            <motion.div className="ex-file" animate={{ y: i === 0 ? [-30, 0] : 0, opacity: i === 0 ? [0, 1] : 1 }} transition={{ duration: 0.5 }}>
              <span>&#128196;</span><div><b>tally-stock.xlsx</b><small>128 rows checked line by line</small></div>
            </motion.div>
            <div className="ex-rows">
              {ROWS.map(([n, c, tag, cls], k) => (
                <motion.div key={n} className="ex-urow" animate={{ opacity: k < shown ? 1 : 0.12, x: k < shown ? 0 : 20 }} transition={{ duration: 0.4 }}>
                  <div><b>{n}</b><small>{c}</small></div><em className={cls}>{tag}</em>
                </motion.div>
              ))}
            </div>
            <div className="ex-apply">
              <span>{i >= 5 ? '1 flagged row skipped' : 'Checking\u2026'}</span>
              <button className={i >= 5 ? 'go' : ''} tabIndex={-1}>{i >= 5 ? '\u2713 Applied' : 'Apply changes'}</button>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="ex-card">
            <div className="ex-head"><b>Old stock suggested while quoting</b></div>
            <div className="ex-sug">
              <div className="ex-tile a"><small>Customer asked for</small><b>Glossy White 24&times;24</b><span>&#8377; 68 / sq ft</span></div>
              <motion.div className="ex-arrow" animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>&rarr;</motion.div>
              <div className="ex-tile b"><small>Old stock, same size</small><b>Ivory Gloss 24&times;24</b><span>&#8377; 52 / sq ft</span></div>
            </div>
            <div className="ex-save">
              <span>Customer saves on 400 sq ft</span><b className="gt"><Num to={6400} prefix={'\u20B9 '} /></b>
            </div>
            <ul className="ex-safe">
              <li>Low-stock alert under 10 boxes</li>
              <li>Stock reduces once, when a quote is won</li>
              <li>Warning if a quote needs more than you hold</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}