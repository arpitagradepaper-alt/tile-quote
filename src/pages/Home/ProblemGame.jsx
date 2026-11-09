import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './ProblemGame.css'

const COLORS = ['#E9B44C', '#2A9D8F', '#D9622B']
const ITEMS = [
  { t: 'Slow, manual quotes', bad: 'Box counts, cutting extra and GST by hand. Total: \u20B9 48,6?0, recheck.', ok: 'Quote ready in 5 seconds, GST included.',
    d: ['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z', 'M14 3v5h5', 'M9 13h6', 'M9 17h4'] },
  { t: 'Follow-ups forgotten', bad: 'Quote sent 3 days ago. Seen. No reply, and nobody chased.', ok: 'Reminder ready on WhatsApp, one tap.',
    d: ['M6 9a6 6 0 0 1 12 0c0 6 2 7 2 8H4c0-1 2-2 2-8z', 'M10 21h4'] },
  { t: 'Missed calls', bad: 'Rang out at 11:42. The customer called the next showroom.', ok: 'Call-back task created, due in 15 minutes.',
    d: ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'] },
  { t: 'Stock surprises', bad: 'Promised Matt Marble 24x24. The godown has 0 boxes.', ok: 'Low stock alert, old stock pushed first.',
    d: ['M21 8l-9-5-9 5v8l9 5 9-5z', 'M3 8l9 5 9-5', 'M12 13v8'] }
]

function Typed({ text }) {
  const [n, setN] = useState(text.length)
  const first = useRef(true)
  useEffect(() => {
    if (!first.current) setN(0)
    first.current = false
  }, [text])
  useEffect(() => {
    if (n >= text.length) return
    const id = setTimeout(() => setN(n + 1), 45)
    return () => clearTimeout(id)
  }, [n, text])
  return <>{text.slice(0, n)}</>
}

function Burst() {
  return (
    <span className="pg-burst" aria-hidden="true">
      <motion.span className="pg-rip" initial={{ scale: 0, opacity: 0.7 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 0.9 }} />
      {Array.from({ length: 10 }, (_, k) => {
        const a = (k / 10) * Math.PI * 2
        return (
          <motion.i key={k} style={{ background: COLORS[k % 3] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: Math.cos(a) * 90, y: Math.sin(a) * 70, opacity: 0, rotate: 200 }}
            transition={{ duration: 0.9, ease: 'easeOut' }} />
        )
      })}
    </span>
  )
}

export default function ProblemGame() {
  const [done, setDone] = useState([false, false, false, false])
  const [fx, setFx] = useState([0, 0, 0, 0])
  const [over, setOver] = useState(-1)
  const [hint, setHint] = useState(false)
  const refs = useRef([])
  const n = done.filter(Boolean).length
  const all = n === 4

  useEffect(() => {
    if (n > 0) return
    const t = setTimeout(() => setHint(true), 6000)
    return () => clearTimeout(t)
  }, [n])

  const fix = i => {
    if (done[i]) return
    setDone(d => d.map((v, k) => (k === i ? true : v)))
    setFx(f => f.map((v, k) => (k === i ? Date.now() : v)))
    setHint(false)
  }
  const at = e => {
    const p = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e
    return refs.current.findIndex(el => {
      if (!el) return false
      const r = el.getBoundingClientRect()
      return p.clientX >= r.left && p.clientX <= r.right && p.clientY >= r.top && p.clientY <= r.bottom
    })
  }
  const reset = () => { setDone([false, false, false, false]); setFx([0, 0, 0, 0]) }

  return (
    <section className={'pg ' + (all ? 'ok' : 'bad')}>
      <div className="pg-in">
        <div className="pg-top">
          <span className="eyebrow">THE PROBLEM</span>
          <h2><Typed text={all ? 'Tile Quote fixes all four.' : 'Four small leaks in every showroom'} /><span className="pg-cur" /></h2>
          <p className="sub">{all ? 'Quotes, follow-ups, calls and stock, handled in one tool.' : 'Drag the Tile Quote chip onto a card, or tap a card, to fix it.'}</p>
          <div className="pg-prog">
            <span>{n} / 4 fixed</span>
            <div className="pg-bar"><motion.i animate={{ width: n * 25 + '%' }} transition={{ duration: 0.5 }} /></div>
          </div>
        </div>

        <div className="pg-grid">
          {ITEMS.map((it, i) => (
            <motion.div key={it.t} ref={el => { refs.current[i] = el }}
              className={'pg-card ' + (done[i] ? 'ok' : 'bad') + (over === i && !done[i] ? ' over' : '')}
              onClick={() => fix(i)}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1, duration: 0.6 }}>
              <div className="pg-j">
                <span className="pg-ic">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {it.d.map((d, k) => (
                      <motion.path key={(done[i] ? 'o' : 'b') + k} d={d}
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: k * 0.12 }} />
                    ))}
                  </svg>
                </span>
                <h3>{it.t}</h3>
                <AnimatePresence mode="wait">
                  <motion.p key={done[i] ? 'o' : 'b'} className={done[i] ? 'pg-f' : 'pg-b'}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    {done[i] ? it.ok : it.bad}
                  </motion.p>
                </AnimatePresence>
                <span className="pg-tag">{done[i] ? 'Fixed' : 'Leaking'}</span>
              </div>
              {fx[i] > 0 && <Burst key={fx[i]} />}
            </motion.div>
          ))}
        </div>

        <div className="pg-foot">
          {all ? (
            <>
              <Link to="/contact" className="btn">Book a demo &rarr;</Link>
              <button type="button" className="pg-reset" onClick={reset}>Play again</button>
            </>
          ) : (
            <>
              <motion.div className="pg-chip" drag dragSnapToOrigin dragElastic={0.2} whileDrag={{ scale: 1.1 }}
                animate={hint ? { rotate: [0, -8, 8, -8, 0] } : { rotate: 0 }}
                transition={hint ? { duration: 1.2, repeat: Infinity, repeatDelay: 1.5 } : undefined}
                onDrag={e => setOver(at(e))}
                onDragEnd={e => { const i = at(e); setOver(-1); if (i >= 0) fix(i) }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>
                Tile Quote
              </motion.div>
              <span className="pg-hint">Drag me onto a leaking card</span>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
