import { useEffect, useState } from 'react'
import { motion, AnimatePresence, animate } from 'framer-motion'
import './DemoModal.css'

const DUR = 6500
const STEPS = [
  ['Make the quote', 'Rooms and tiles in, total out'],
  ['Share on WhatsApp', 'PDF opens in customer chat'],
  ['Follow up', 'Remind button, one tap'],
  ['Mark won', 'Stock reduces once']
]
const COLORS = ['#E9B44C', '#D9622B', '#2A9D8F', '#0F3D3E']

function useTyped(text, delay, speed) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let iv
    const t = setTimeout(() => {
      iv = setInterval(() => setN(v => (v >= text.length ? v : v + 1)), speed)
    }, delay * 1000)
    return () => { clearTimeout(t); clearInterval(iv) }
  }, [])
  return text.slice(0, n)
}

function useCount(to, delay, dur) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let c
    const t = setTimeout(() => {
      c = animate(0, to, { duration: dur, ease: 'easeOut', onUpdate: v => setN(Math.round(v)) })
    }, delay * 1000)
    return () => { clearTimeout(t); if (c) c.stop() }
  }, [])
  return n
}

function SceneQuote() {
  const name = useTyped('Sharma Residence', 0.3, 55)
  const total = useCount(48620, 2.7, 1.8)
  const rows = [
    ['Living room \u00B7 12 \u00D7 14 ft', 'Marble White', '12 boxes', 1.4],
    ['Bedroom \u00B7 10 \u00D7 11 ft', 'Rustic Grey', '8 boxes', 2]
  ]
  return (
    <div className="dm-sc">
      <div className="dm-h"><b>New quote</b><em>Salesperson</em></div>
      <div className="dm-in"><small>Customer</small><span>{name}<i className="dm-caret" /></span></div>
      {rows.map(([a, b, c, d]) => (
        <motion.div key={a} className="dm-row" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d }}>
          <div><b>{a}</b><small>{b}</small></div><em>{c}</em>
        </motion.div>
      ))}
      <div className="dm-tags">
        {['Adhesive + grout', 'GST 18%'].map((t, k) => (
          <motion.span key={t} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.5 + k * 0.3 }}>
            {t} added
          </motion.span>
        ))}
      </div>
      <motion.div className="dm-total" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6 }}>
        <span>Quote total</span><b>&#8377; {total.toLocaleString('en-IN')}</b>
      </motion.div>
    </div>
  )
}

function SceneShare() {
  const [sent, setSent] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setSent(true), 2900)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="dm-sc">
      <div className="dm-h"><b>Sharma Residence</b><em>WhatsApp</em></div>
      <div className="dm-chat">
        <motion.div className="dm-b" initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3 }}>
          Namaste Mr. Sharma, your tile quotation is ready.
        </motion.div>
        <motion.div className="dm-b pdf" initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1.1 }}>
          <i>PDF</i>
          <div><b>Quotation Q-0001</b><small>Total &#8377; 48,620 &middot; 20 boxes</small></div>
        </motion.div>
      </div>
      <motion.div className="dm-btn" initial={{ opacity: 0 }} animate={{ opacity: 1, scale: [1, 1, 0.94, 1] }} transition={{ delay: 1.8, duration: 1.2, times: [0, 0.5, 0.75, 1] }}>
        Share on WhatsApp
        <motion.span className="dm-ripple" initial={{ scale: 0, opacity: 0.6 }} animate={{ scale: 5, opacity: 0 }} transition={{ delay: 2.6, duration: 0.8 }} />
      </motion.div>
      {sent && (
        <motion.div className="dm-ok" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          &#10003;&#10003; Sent &middot; follow-ups set for Day 2, 5 and 10
        </motion.div>
      )}
    </div>
  )
}

function SceneFollow() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const a = setTimeout(() => setStep(1), 2300)
    const b = setTimeout(() => setStep(2), 4200)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])
  return (
    <div className="dm-sc">
      <div className="dm-h"><b>My dashboard</b><em>Follow-ups due: 1</em></div>
      <motion.div className="dm-due" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <motion.span className="dm-bell" animate={{ rotate: [0, -20, 20, -14, 14, 0] }} transition={{ delay: 0.9, duration: 1.1, repeat: 1, repeatDelay: 0.4 }}>
          &#128276;
        </motion.span>
        <div><b>Follow-up due: Day 2</b><small>Sharma Residence &middot; &#8377; 48,620</small></div>
        <motion.button type="button" className="dm-remind" animate={step === 0 ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={{ repeat: step === 0 ? Infinity : 0, duration: 1 }}>
          {step === 0 ? 'Remind' : 'Opening\u2026'}
        </motion.button>
      </motion.div>
      <div className="dm-chat">
        {step >= 1 && (
          <motion.div className="dm-b" initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
            Hi Mr. Sharma, just checking on your tile quotation.
          </motion.div>
        )}
        {step >= 2 && (
          <motion.div className="dm-b me" initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
            Looks good, please confirm the order!
          </motion.div>
        )}
      </div>
      {step >= 2 && (
        <motion.div className="dm-ok" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          &#10003; Customer replied &middot; moved to your call list
        </motion.div>
      )}
    </div>
  )
}

function SceneWon() {
  const [k, setK] = useState(-1)
  const [low, setLow] = useState(false)
  useEffect(() => {
    let n = -1
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        n += 1
        setK(n)
        if (n >= 3) clearInterval(iv)
      }, 600)
    }, 300)
    const s = setTimeout(() => setLow(true), 2600)
    return () => { clearTimeout(start); clearTimeout(s) }
  }, [])
  const pills = ['Draft', 'Sent', 'Replied', 'Won']
  return (
    <div className="dm-sc">
      <div className="dm-h"><b>Quote Q-0001</b><em>Sharma Residence</em></div>
      <div className="dm-pills">
        {pills.map((p, i) => (
          <span key={p} className={i === k ? 'on' : i < k ? 'done' : ''}>{p}</span>
        ))}
      </div>
      <motion.div className="dm-won" initial={{ opacity: 0, scale: 0.8 }} animate={k >= 3 ? { opacity: 1, scale: 1 } : {}} transition={{ type: 'spring', stiffness: 220, damping: 14 }}>
        <small>ORDER WON</small>
        <b>&#8377; 48,620</b>
        {k >= 3 && COLORS.concat(COLORS, COLORS, COLORS).map((c, i) => {
          const a = (i / 16) * Math.PI * 2
          return (
            <motion.i key={i} className="dm-conf" style={{ background: c }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: Math.cos(a) * 130, y: Math.sin(a) * 90, opacity: 0, rotate: 200 }}
              transition={{ duration: 1.1, ease: 'easeOut' }} />
          )
        })}
      </motion.div>
      <div className="dm-stock">
        <p><span>Marble White stock</span><b>{low ? '108' : '120'} boxes</b></p>
        <div className="dm-meter">
          <motion.div initial={{ width: '100%' }} animate={{ width: low ? '90%' : '100%' }} transition={{ duration: 0.8 }} />
        </div>
        {low && <motion.em initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Stock reduced once, automatically</motion.em>}
      </div>
    </div>
  )
}

const SCENES = [SceneQuote, SceneShare, SceneFollow, SceneWon]

export default function DemoModal({ open, onClose }) {
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(true)

  useEffect(() => { if (open) { setI(0); setPlay(true) } }, [open])

  useEffect(() => {
    if (!open) return
    const k = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open || !play) return
    const t = setTimeout(() => setI(v => (v + 1) % STEPS.length), DUR)
    return () => clearTimeout(t)
  }, [open, play, i])

  const Scene = SCENES[i]

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="dm-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="dm-box"
            role="dialog" aria-modal="true" aria-label="Tile Quote demo"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="dm-top">
              <b>Tile Quote &middot; live demo</b>
              <div className="dm-ctl">
                <button type="button" aria-label={play ? 'Pause' : 'Play'} onClick={() => setPlay(p => !p)}>{play ? '\u23F8' : '\u25B6'}</button>
                <button type="button" aria-label="Close" onClick={onClose}>&#10005;</button>
              </div>
            </div>
            <div className="dm-main">
              <div className="dm-steps">
                {STEPS.map(([t, d], k) => (
                  <button key={t} type="button" className={'dm-step' + (k === i ? ' on' : '')} onClick={() => { setI(k); setPlay(true) }}>
                    <i>{k + 1}</i>
                    <span><b>{t}</b><small>{d}</small></span>
                    {k === i && play && (
                      <motion.span key={'p' + i} className="dm-prog" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: DUR / 1000, ease: 'linear' }} />
                    )}
                  </button>
                ))}
              </div>
              <div className="dm-screen">
                <div className="dm-win">
                  <div className="dm-bar"><span /><span /><span /><em>tilequote.app</em></div>
                  <AnimatePresence mode="wait">
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                      <Scene />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
