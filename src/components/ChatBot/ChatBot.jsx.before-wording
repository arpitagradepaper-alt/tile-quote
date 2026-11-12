import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import './ChatBot.css'

const GREET = 'Hello! I am the Tile Quote assistant. Ask me anything about the app, or pick a topic below.'
const FALLBACK = 'I am not sure about that yet. Pick a topic below, or book a free demo and our team will answer everything.'

// Edit or add questions and answers here.
// chip = button label, keys = words that trigger the answer, go = buttons that open a page
const KB = [
  {
    id: 'customer', chip: 'Does my customer need an app?',
    keys: ['customer', 'install', 'signup', 'sign up', 'sign-up'],
    text: 'No. The customer simply receives a clean PDF quotation on WhatsApp. No app, no sign-up.'
  },
  {
    id: 'about', chip: 'What is Tile Quote?',
    keys: ['what is', 'tile quote', 'tilequote', 'about', 'software', 'app', 'explain'],
    text: 'Tile Quote helps tile showrooms create professional quotations in minutes and share them with customers on WhatsApp. It also handles follow-ups, calls, stock and sales reports in one place.',
    go: [['See features', '/features'], ['How it works', '/how-it-works']]
  },
  {
    id: 'quote', chip: 'Smart quotations',
    keys: ['quote', 'quotation', 'estimate', 'boxes', 'gst', 'adhesive', 'grout', 'discount', 'delivery', 'room'],
    text: 'Quotes are made room by room. Enter the length and width and pick a tile. Tile Quote adds extra for cutting, rounds up to whole boxes, and adds adhesive, grout and GST from your own rates. You can also add a discount and a delivery charge.'
  },
  {
    id: 'whatsapp', chip: 'Share on WhatsApp',
    keys: ['whatsapp', 'share', 'pdf', 'send'],
    text: "Share a branded PDF quotation in your customer's WhatsApp chat in one tap. Each quote has a secure private link and is marked as sent automatically."
  },
  {
    id: 'followup', chip: 'Follow-up reminders',
    keys: ['follow', 'remind', 'reminder', 'nudge'],
    text: 'You can set up to five follow-up days on a quote. Due follow-ups show on your dashboard with a Remind button that opens WhatsApp with the message ready.'
  },
  {
    id: 'calls', chip: 'Call management',
    keys: ['call', 'calls', 'missed', 'voicemail', 'ring'],
    text: 'Incoming calls ring your team, one after another or all at once. If nobody is free, the caller hears a greeting or leaves a voice message, and a call-back task is created, due in 15 minutes.'
  },
  {
    id: 'stock', chip: 'Stock and Tally',
    keys: ['stock', 'tally', 'inventory', 'excel', 'csv', 'upload', 'catalogue', 'catalog'],
    text: 'Upload your stock from Tally as an Excel or CSV file, preview every change, then update. You also get low-stock alerts, price list import and cheaper old-stock suggestions while quoting. Stock reduces only once, when a quote is marked won.'
  },
  {
    id: 'reports', chip: 'Sales reports',
    keys: ['report', 'analytics', 'dashboard', 'sales', 'performance', 'conversion'],
    text: 'See orders won, conversion, top tiles and team performance by month, plus call reports for every team member.'
  },
  {
    id: 'devices', chip: 'iPhone and Android',
    keys: ['iphone', 'android', 'mobile', 'device', 'browser', 'computer', 'laptop', 'ios'],
    text: 'Yes. It runs in the browser on Android, iPhone and computers, and can be added to the home screen like an app.'
  },
  {
    id: 'privacy', chip: 'Is my data private?',
    keys: ['private', 'privacy', 'secure', 'security', 'safe', 'data'],
    text: "Yes. Each showroom's data is private, and salespersons see only their own quotes and customers."
  },
  {
    id: 'price', chip: 'Pricing',
    keys: ['price', 'pricing', 'cost', 'charge', 'fee', 'plan', 'subscription', 'how much'],
    text: 'I do not have pricing details here. Book a free demo and our team will share them with you.',
    go: [['Book a demo', '/contact']]
  },
  {
    id: 'demo', chip: 'Book a free demo',
    keys: ['demo', 'book', 'trial', 'contact', 'talk', 'reach', 'meeting'],
    text: 'A free live demo uses your own tiles and prices. Share your details on the Contact page and our team will reach out to you.',
    go: [['Book a demo', '/contact']]
  },
  {
    id: 'hello', keys: ['hi', 'hii', 'hello', 'hey', 'namaste'],
    text: 'Hello! How can I help you with Tile Quote today?'
  },
  {
    id: 'thanks', keys: ['thanks', 'thank', 'thankyou'],
    text: 'You are welcome! If you would like to see it live, you can book a free demo anytime.',
    go: [['Book a demo', '/contact']]
  }
]

const FEATURED = ['about', 'quote', 'whatsapp', 'stock', 'price', 'demo']
const byId = id => KB.find(e => e.id === id)

function findAnswer(input) {
  const s = input.toLowerCase()
  const tokens = s.match(/[a-z0-9]+/g) || []
  let best = null
  let top = 0
  for (const e of KB) {
    let score = 0
    for (const k of e.keys) {
      if (k.includes(' ')) { if (s.includes(k)) score += 2 }
      else if (tokens.some(t => (k.length < 4 ? t === k : t.startsWith(k)))) score += 1
    }
    if (score > top) { top = score; best = e }
  }
  return best
}

let uid = 0
const stamp = () => new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
const mk = (from, text, extra) => ({ id: ++uid, from, text, time: stamp(), ...extra })
const start = () => [mk('bot', GREET, { grid: true })]

export default function ChatBot() {
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState(start)
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const [teaser, setTeaser] = useState('wait')
  const body = useRef(null)
  const input = useRef(null)
  const timer = useRef(null)

  // Small "Need help?" bubble after a few seconds
  useEffect(() => {
    const t = setTimeout(() => setTeaser(s => (s === 'wait' ? 'show' : s)), 4000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  // Keep the newest message in view
  useEffect(() => {
    const el = body.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, open])

  // Close with the Esc key
  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Focus the input on desktop (not on phones, it would pop the keyboard)
  useEffect(() => {
    if (!open || window.innerWidth <= 600) return
    const t = setTimeout(() => input.current?.focus(), 250)
    return () => clearTimeout(t)
  }, [open])

  const toggle = () => { setOpen(o => !o); setTeaser('gone') }

  const reply = entry => {
    setTyping(true)
    timer.current = setTimeout(() => {
      setTyping(false)
      setMsgs(m => [...m, entry
        ? mk('bot', entry.text, { go: entry.go })
        : mk('bot', FALLBACK, { grid: true, go: [['Book a demo', '/contact']] })])
    }, 700)
  }

  const ask = entry => {
    if (typing) return
    setMsgs(m => [...m, mk('me', entry.chip)])
    reply(entry)
  }

  const send = e => {
    e.preventDefault()
    const q = text.trim()
    if (!q || typing) return
    setMsgs(m => [...m, mk('me', q)])
    setText('')
    reply(findAnswer(q))
  }

  const restart = () => {
    clearTimeout(timer.current)
    setTyping(false)
    setMsgs(start())
  }

  const go = to => {
    nav(to)
    if (window.innerWidth <= 600) setOpen(false)
  }

  const chips = KB.filter(e => e.chip)

  return (
    <div className={'cb' + (open ? ' open' : '')}>
      <AnimatePresence>
        {open && (
          <motion.section className="cb-win" role="dialog" aria-label="Tile Quote assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>

            <header className="cb-head">
              <span className="cb-av">TQ</span>
              <div className="cb-id">
                <b>Tile Quote Assistant</b>
                <small><i className="cb-dot" />Online now</small>
              </div>
              <button type="button" aria-label="Restart chat" title="Restart chat" onClick={restart}>&#8635;</button>
              <button type="button" aria-label="Close chat" title="Close" onClick={() => setOpen(false)}>&times;</button>
            </header>

            <div className="cb-body" ref={body} role="log" aria-live="polite">
              {msgs.map(m => (
                <div key={m.id} className={'cb-row ' + m.from}>
                  <div className="cb-m">
                    {m.text}
                    {m.grid && (
                      <div className="cb-grid">
                        {FEATURED.map(id => (
                          <button key={id} type="button" onClick={() => ask(byId(id))}>{byId(id).chip}</button>
                        ))}
                      </div>
                    )}
                    {m.go && (
                      <div className="cb-go">
                        {m.go.map(([label, to]) => (
                          <button key={to + label} type="button" onClick={() => go(to)}>{label} &rarr;</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <small>{m.time}</small>
                </div>
              ))}
              {typing && (
                <div className="cb-row bot">
                  <div className="cb-m cb-typing" aria-label="Typing"><i /><i /><i /></div>
                </div>
              )}
            </div>

            <div className="cb-chips">
              {chips.map(e => (
                <button key={e.id} type="button" disabled={typing} onClick={() => ask(e)}>{e.chip}</button>
              ))}
            </div>

            <form className="cb-form" onSubmit={send}>
              <input ref={input} value={text} onChange={e => setText(e.target.value)}
                placeholder="Type your question..." aria-label="Type your question" maxLength={200} />
              <button type="submit" aria-label="Send" disabled={!text.trim() || typing}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" /></svg>
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {teaser === 'show' && !open && (
          <motion.div className="cb-tease"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}>
            <button type="button" className="cb-tx" onClick={toggle}>Need help with Tile Quote? <b>Ask me</b></button>
            <button type="button" className="cb-tc" aria-label="Dismiss" onClick={() => setTeaser('gone')}>&times;</button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button type="button" className="cb-fab" aria-label={open ? 'Close chat' : 'Open chat'}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} onClick={toggle}>
        {!open && <span className="cb-ring" />}
        {open ? (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /><path d="M8.5 11h7M8.5 14h4.5" /></svg>
        )}
      </motion.button>
    </div>
  )
}
