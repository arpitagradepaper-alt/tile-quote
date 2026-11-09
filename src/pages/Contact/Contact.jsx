import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHero from '../../components/common/PageHero.jsx'
import Words from '../../components/common/Words.jsx'
import Reveal from '../../components/common/Reveal.jsx'
import Tilt from '../../components/common/Tilt.jsx'
import Cta from '../../components/common/Cta.jsx'
import './Contact.css'

const WHATSAPP_NUMBER = '91 98XXX XXXXX'
const PHONE_NUMBER = '91 98XXX XXXXX'
const EMAIL = 'hello@domain.com'

const REACH = [
  ['\u{1F4AC}', 'Chat on WhatsApp', '+' + WHATSAPP_NUMBER, 'https://wa.me/'],
  ['\u{1F4DE}', 'Call us', '+' + PHONE_NUMBER, 'tel:+91'],
  ['\u2709\uFE0F', 'Email', EMAIL, 'mailto:' + EMAIL]
]

const SEE = [
  'A quote built with your own tiles',
  'Your prices and GST rates applied',
  'WhatsApp sharing, live'
]

const STEPS = [
  ['1', 'Share your details', 'Tell us about your showroom, tiles and team.'],
  ['2', 'Live demo', 'A live demo with your own tiles and prices.'],
  ['3', 'Start quoting', 'Add your team and send your first quote on WhatsApp.']
]

const FAQ = [
  ['Does my customer need to install an app?', 'No. The customer simply receives a clean PDF quotation on WhatsApp. No app, no sign-up.'],
  ['Does it work on iPhone and Android?', 'Yes. It runs in the browser on Android, iPhone and computers, and can be added to the home screen like an app.'],
  ['Can I upload my stock from Tally?', 'Yes. Upload an Excel or CSV file, preview every change, then update.'],
  ["Is my showroom's data private?", "Yes. Each showroom's data is private, and salespersons see only their own quotes and customers."]
]

const EMPTY = { name: '', showroom: '', phone: '', city: '', team: '', message: '' }

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name'
  if (v.showroom.trim().length < 2) e.showroom = 'Please enter your showroom name'
  if (!/^[6-9]\d{9}$/.test(v.phone)) e.phone = 'Enter a valid 10-digit mobile number'
  if (v.city.trim().length < 2) e.city = 'Please enter your city'
  return e
}

function Field({ label, error, children }) {
  return (
    <label className={'ct-f' + (error ? ' bad' : '')}>
      <span>{label}</span>
      <motion.div
        key={error ? 'e' : 'ok'}
        animate={error ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.em
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.em>
        )}
      </AnimatePresence>
    </label>
  )
}

function Success({ name, onReset }) {
  return (
    <motion.div
      className="ct-ok"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      <motion.div
        className="ct-circle"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
      >
        <svg viewBox="0 0 52 52" width="52" height="52">
          <motion.path
            d="M14 27 L23 36 L39 17"
            fill="none"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          />
        </svg>
      </motion.div>
      <h3>Thank you, {name.split(' ')[0]}!</h3>
      <p>We have your details. Our team will contact you on WhatsApp shortly to set up your live demo.</p>
      <button type="button" className="btn" onClick={onReset}>Book another demo</button>
    </motion.div>
  )
}

function DemoForm() {
  const [v, setV] = useState(EMPTY)
  const [err, setErr] = useState({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const set = k => e => {
    let val = e.target.value
    if (k === 'phone') val = val.replace(/\D/g, '').slice(0, 10)
    setV(s => ({ ...s, [k]: val }))
    if (err[k]) setErr(s => ({ ...s, [k]: undefined }))
  }

  const submit = e => {
    e.preventDefault()
    const found = validate(v)
    setErr(found)
    if (Object.keys(found).length) return
    setBusy(true)
    setTimeout(() => { setBusy(false); setDone(true) }, 1300)
  }

  const reset = () => { setV(EMPTY); setErr({}); setDone(false) }

  return (
    <div className="ct-card">
      <AnimatePresence mode="wait">
        {done ? (
          <Success key="ok" name={v.name} onReset={reset} />
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
            <h2>Book a free demo</h2>
            <p className="ct-sub">Tell us about your showroom and we will get back to you.</p>

            <div className="ct-row">
              <Field label="Full name" error={err.name}>
                <input value={v.name} onChange={set('name')} placeholder="Your name" autoComplete="name" />
              </Field>
              <Field label="Showroom name" error={err.showroom}>
                <input value={v.showroom} onChange={set('showroom')} placeholder="Your showroom" />
              </Field>
            </div>

            <div className="ct-row">
              <Field label="Phone / WhatsApp" error={err.phone}>
                <div className="ct-ph">
                  <b>+91</b>
                  <input value={v.phone} onChange={set('phone')} placeholder="98XXX XXXXX" inputMode="numeric" autoComplete="tel-national" />
                </div>
              </Field>
              <Field label="City" error={err.city}>
                <input value={v.city} onChange={set('city')} placeholder="Your city" autoComplete="address-level2" />
              </Field>
            </div>

            <Field label="Team size">
              <input value={v.team} onChange={set('team')} placeholder="Owner + number of salespersons" />
            </Field>

            <Field label="Message (optional)">
              <textarea rows="4" value={v.message} onChange={set('message')} placeholder="Tell us what you want to see in the demo" />
            </Field>

            <button type="submit" className="btn ct-submit" disabled={busy}>
              {busy ? <span className="ct-spin" /> : 'Book my demo \u2192'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function Side() {
  return (
    <div className="ct-side">
      {REACH.map(([ic, t, d, href], i) => (
        <Reveal key={t} delay={i * 0.1}>
          <motion.a href={href} className="ct-reach" whileHover={{ x: 8 }}>
            <span className="ct-ic">{ic}</span>
            <div><b>{t}</b><small>{d}</small></div>
          </motion.a>
        </Reveal>
      ))}
      <Reveal delay={0.3}>
        <div className="dark ct-see">
          <h3>In your demo, you will see</h3>
          <ul>
            {SEE.map((s, i) => (
              <motion.li key={s}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12 }}>
                <i>&#10003;</i>{s}
              </motion.li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  )
}

function Steps() {
  return (
    <div className="alt">
      <section className="sec">
        <Reveal>
          <span className="eyebrow">YOUR DEMO</span>
          <h2>What happens <span className="gt">after you book</span></h2>
        </Reveal>
        <div className="ct-steps">
          {STEPS.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 0.12}>
              <Tilt className="card">
                <b className="ct-num gt">{n}</b>
                <h3>{t}</h3>
                <p>{d}</p>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="sec">
      <Reveal>
        <span className="eyebrow">FAQ</span>
        <h2>Questions <span className="gt">we often hear</span></h2>
      </Reveal>
      <div className="ct-faq">
        {FAQ.map(([q, a], i) => {
          const on = open === i
          return (
            <Reveal key={q} delay={i * 0.08}>
              <div className={'ct-q' + (on ? ' on' : '')}>
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                  <span>{q}</span>
                  <motion.i animate={{ rotate: on ? 135 : 0 }} transition={{ duration: 0.3 }}>+</motion.i>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p>{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

export default function Contact() {
  return (
    <>
      <PageHero chip="Get in touch" sub="Book a live demo with your own tiles and prices, or ask us anything about Tile Quote.">
        <Words text="Let's put it to work in" />
        <Words className="ph-y" text="your showroom" delay={0.4} />
      </PageHero>

      <section className="sec ct-main">
        <Reveal><DemoForm /></Reveal>
        <Side />
      </section>

      <Steps />
      <Faq />
      <Cta title="Ready to quote faster?" />
    </>
  )
}
