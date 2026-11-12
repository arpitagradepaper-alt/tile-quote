import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Counter from '../../components/common/Counter.jsx'
import './MissedCall.css'

const STEPS = [
  {
    n: '01',
    t: 'Call rings the team',
    d: "One after another (customer's own salesperson first) or everyone at once.",
    ic: 'ring'
  },
  {
    n: '02',
    t: 'Press 1 to take it',
    d: "So a phone's voicemail never counts as answered.",
    ic: 'key'
  },
  {
    n: '03',
    t: 'Nobody free, or closed?',
    d: 'Caller presses 1 for a call-back or leaves a voice message.',
    ic: 'mic'
  },
  {
    n: '04',
    t: 'Call-back task created',
    d: 'Due in 15 minutes, with a red count until someone calls.',
    ic: 'task'
  }
]

const SCENARIOS = [
  { id: 'answered', label: 'Salesperson answers', path: [0, 1] },
  { id: 'busy', label: 'Nobody free', path: [0, 1, 2, 3] },
  { id: 'closed', label: 'Showroom closed', path: [2, 3] }
]

const TEAM = [
  { name: 'Arjun', role: "Customer's own salesperson" },
  { name: 'Neha', role: 'Salesperson' },
  { name: 'Sameer', role: 'Salesperson' }
]

const STATE_LABEL = {
  ring: 'Ringing',
  wait: 'Next in line',
  missed: 'No answer',
  answered: 'Pressed 1',
  stopped: 'Stopped ringing'
}

const REPORT = [
  { l: 'Calls received', v: 248, s: '41 of them after hours' },
  { l: 'Answered', v: 87, suf: '%', s: '216 of 248 calls' },
  { l: 'Missed calls', v: 32, s: '8 call-backs pending', bad: true },
  { l: 'Avg. time to call back', v: 11, suf: ' min', s: 'Goal: within 15 min' },
  { l: 'Quotes made from calls', v: 64, s: 'Started straight from a call' }
]

const PERF = [
  ['Arjun', 92],
  ['Neha', 85],
  ['Sameer', 78]
]

const GREETINGS = [
  ['Hindi', 'Namaste! Sharma Tiles mein aapka swagat hai. Hamari team se baat karne ke liye 1 dabayein.'],
  ['English', 'Welcome to Sharma Tiles. Press 1 to speak to our team.'],
  ['Gujarati', 'Namaste! Sharma Tiles ma aapnu swagat chhe. Amari team sathe vaat karva 1 dabavo.']
]

const BENEFITS = [
  ['No enquiry left behind', 'Closed or everyone busy, the caller can still ask for a call-back or leave a voice message.'],
  ['Call-back within 15 minutes', 'A task with a red count stays on the dashboard until someone calls the customer.'],
  ['Call and quote in one tap', 'From Calls and call-backs, tap to call and start a quote straight from the call.']
]

function Icon({ name }) {
  const p = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }

  if (name === 'ring') {
    return (
      <svg {...p}>
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
      </svg>
    )
  }

  if (name === 'key') {
    return (
      <svg {...p}>
        {[6, 12, 18].map(x =>
          [6, 12, 18].map(y => <circle key={x + '-' + y} cx={x} cy={y} r="1.6" />)
        )}
      </svg>
    )
  }

  if (name === 'mic') {
    return (
      <svg {...p}>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </svg>
    )
  }

  return (
    <svg {...p}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2M9 3h6" />
    </svg>
  )
}

function Wave({ on }) {
  return (
    <span className={'mc-wave' + (on ? ' on' : '')} aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <i key={i} style={{ animationDelay: i * 0.12 + 's' }} />
      ))}
    </span>
  )
}

function memberState(i, step, sc, mode, ring) {
  if (sc === 'answered') {
    if (step === 0) return mode === 'all' || i === 0 ? 'ring' : 'wait'
    return i === 0 ? 'answered' : mode === 'all' ? 'stopped' : 'wait'
  }

  if (step === 0) {
    if (mode === 'all') return 'ring'
    return i < ring ? 'missed' : i === ring ? 'ring' : 'wait'
  }

  return 'missed'
}

export default function MissedCall() {
  const [mode, setMode] = useState('seq')
  const [sc, setSc] = useState('answered')
  const [pos, setPos] = useState(0)
  const [auto, setAuto] = useState(true)
  const [ring, setRing] = useState(0)
  const [left, setLeft] = useState(900)
  const [greet, setGreet] = useState('text')
  const [lang, setLang] = useState(0)

  const path = SCENARIOS.find(s => s.id === sc).path
  const safePos = Math.min(pos, path.length - 1)
  const step = path[safePos]

  const chooseScenario = id => {
    setSc(id)
    setPos(0)
    setRing(0)
  }

  useEffect(() => {
    if (!auto) return
    const t = setTimeout(() => setPos(p => (p + 1) % path.length), 3600)
    return () => clearTimeout(t)
  }, [auto, pos, sc])

  useEffect(() => {
    if (step !== 0 || sc !== 'busy' || mode !== 'seq') return
    const t = setInterval(() => setRing(r => (r + 1) % TEAM.length), 1000)
    return () => clearInterval(t)
  }, [step, sc, mode])

  useEffect(() => {
    if (step !== 3) {
      setLeft(900)
      return
    }
    const t = setInterval(() => setLeft(l => Math.max(l - 1, 0)), 1000)
    return () => clearInterval(t)
  }, [step])

  let chip = ['Ringing team', 'ring']
  if (step === 1) chip = sc === 'answered' ? ['Answered', 'ok'] : ['Not answered', 'bad']
  if (step === 2) chip = sc === 'closed' ? ['Showroom closed', 'warn'] : ['Nobody free', 'warn']
  if (step === 3) chip = ['Call-back due', 'bad']

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')

  const team = (
    <div className="mc-route">
      <div className="mc-route-head">
        <small>CALL ROUTING</small>
        <b>
          {mode === 'seq'
            ? "One after another, customer's salesperson first"
            : 'Everyone rings at once'}
        </b>
      </div>

      {TEAM.map((m, i) => {
        const st = memberState(i, step, sc, mode, ring)
        const label =
          step === 1 && sc === 'busy' ? 'Voicemail, not counted' : STATE_LABEL[st]

        return (
          <div key={m.name} className={'mc-mem ' + st}>
            <span className={'mc-av av' + (i + 1)}>{m.name[0]}</span>
            <div>
              <b>{m.name}</b>
              <small>{m.role}</small>
            </div>
            <span className="mc-mem-st">{label}</span>
          </div>
        )
      })}
    </div>
  )

  let panel = team

  if (step === 1) {
    panel = (
      <>
        {team}
        <div className={'mc-press ' + (sc === 'answered' ? 'ok' : 'no')}>
          <span className="mc-key">1</span>
          <p>
            {sc === 'answered'
              ? 'Arjun pressed 1. The call is connected and counted as answered.'
              : 'Nobody pressed 1. A phone voicemail does not count as an answered call.'}
          </p>
        </div>
      </>
    )
  }

  if (step === 2) {
    panel = (
      <div className="mc-ivr">
        {sc === 'closed' && <span className="mc-closed">Showroom closed, after hours</span>}
        <small>THE CALLER HEARS YOUR GREETING</small>
        <p className="mc-say">&ldquo;Our team cannot take your call right now.&rdquo;</p>

        <div className="mc-opt">
          <span className="mc-key">1</span>
          <div>
            <b>Press 1 for a call-back</b>
            <small>A task is created for your team</small>
          </div>
        </div>

        <div className="mc-opt">
          <span className="mc-key mic">
            <Icon name="mic" />
          </span>
          <div>
            <b>Or leave a voice message</b>
            <small>Works even after showroom hours</small>
          </div>
          <Wave on />
        </div>
      </div>
    )
  }

  if (step === 3) {
    panel = (
      <div className="mc-task">
        <div className="mc-task-top">
          <span className="mc-task-badge">1</span>
          <div>
            <small>CALL-BACK TASK CREATED</small>
            <b>Rahul Sharma</b>
            <em>Customer is waiting for a call-back</em>
          </div>
        </div>

        <div className="mc-timer">
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" className="bg" />
            <circle
              cx="40"
              cy="40"
              r="34"
              className="fg"
              strokeDasharray="213.6"
              strokeDashoffset={213.6 * (1 - left / 900)}
            />
          </svg>
          <b>
            {mm}:{ss}
          </b>
          <small>DUE IN</small>
        </div>

        <div className="mc-task-act">
          <button type="button" className="mc-btn solid">
            Call now
          </button>
          <button type="button" className="mc-btn">
            Quote from call
          </button>
        </div>

        <p className="mc-note">
          The red count stays on the dashboard until someone calls back.
        </p>
      </div>
    )
  }

  return (
    <section className="mc-sec">
      <div className="mc-wrap">
        <motion.div
          className="mc-head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="mc-eye">
            <i />
            CALL MANAGEMENT
          </span>

          <h2>
            Never lose a customer <br />
            to a <span className="gt">missed call.</span>
          </h2>

          <p>
            A call that rings out is a customer who calls the next showroom.
            Tile Quote rings your team, makes sure a real person answers, and
            turns every missed call into a call-back task. Needs a phone number and a one-time setup.
          </p>
        </motion.div>

        <div className="mc-ctrl">
          <div className={'mc-seg' + (sc === 'closed' ? ' dim' : '')}>
            <small>RING MODE</small>
            <div>
              {[
                ['seq', 'One after another'],
                ['all', 'Everyone at once']
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={mode === id ? 'on' : ''}
                  onClick={() => setMode(id)}
                >
                  {mode === id && <motion.span layoutId="mc-mode-bg" className="mc-seg-bg" />}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mc-seg">
            <small>WHAT HAPPENS?</small>
            <div>
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={sc === s.id ? 'on' : ''}
                  onClick={() => chooseScenario(s.id)}
                >
                  {sc === s.id && <motion.span layoutId="mc-sc-bg" className="mc-seg-bg" />}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mc-layout">
          <div className="mc-flow">
            <div className="mc-flow-top">
              <h3>One call. Four safe steps.</h3>
              <button type="button" className="mc-play" onClick={() => setAuto(a => !a)}>
                {auto ? 'Pause demo' : 'Play demo'}
              </button>
            </div>

            {STEPS.map((s, i) => {
              const idx = path.indexOf(i)
              const cls = idx === -1 ? 'skip' : i === step ? 'on' : idx < safePos ? 'done' : ''

              return (
                <button
                  key={s.n}
                  type="button"
                  disabled={idx === -1}
                  className={'mc-step ' + cls}
                  onClick={() => {
                    setPos(idx)
                    setAuto(false)
                  }}
                >
                  <span className="mc-step-ic">
                    <Icon name={s.ic} />
                  </span>

                  <span className="mc-step-tx">
                    <small>STEP {s.n}</small>
                    <b>{s.t}</b>
                    <em>{s.d}</em>
                  </span>

                  {idx === -1 && <span className="mc-skip">Not needed here</span>}

                  {i === step && auto && (
                    <span className="mc-step-prog">
                      <motion.i
                        key={sc + safePos}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3.6, ease: 'linear' }}
                      />
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mc-console">
            <div className="mc-con-top">
              <span className="mc-con-live">
                <i /> LIVE PREVIEW
              </span>
              <span className={'mc-chip ' + chip[1]}>{chip[0]}</span>
            </div>

            <div className="mc-caller">
              <span className="mc-caller-av">RS</span>
              <div>
                <small>INCOMING CUSTOMER</small>
                <b>Rahul Sharma</b>
                <em>+91 98765 43210</em>
              </div>
              <Wave on={step < 2} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={sc + step + mode}
                className="mc-panel"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {panel}
              </motion.div>
            </AnimatePresence>

            <div className="mc-dots">
              {path.map((s, i) => (
                <i key={s} className={i <= safePos ? 'on' : ''} />
              ))}
            </div>
          </div>
        </div>

        <div className="mc-lower">
          <motion.div
            className="mc-report"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
          >
            <div className="mc-card-head">
              <div>
                <small>FOR THE OWNER</small>
                <h3>Owner&apos;s call report</h3>
              </div>
              <span className="mc-tag">Illustrative</span>
            </div>

            <div className="mc-rep-grid">
              {REPORT.map(r => (
                <div key={r.l} className={'mc-rep' + (r.bad ? ' bad' : '')}>
                  <small>{r.l}</small>
                  <b>
                    <Counter to={r.v} dur={1.6} />
                    {r.suf || ''}
                  </b>
                  <em>{r.s}</em>
                </div>
              ))}

              <div className="mc-rep perf">
                <small>Results for each team member</small>
                {PERF.map(([n, v], i) => (
                  <p key={n}>
                    <span>{n}</span>
                    <u>
                      <motion.i
                        initial={{ width: 0 }}
                        whileInView={{ width: v + '%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + i * 0.15 }}
                      />
                    </u>
                    <b>{v}%</b>
                  </p>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mc-greet"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="mc-card-head">
              <div>
                <small>YOUR GREETING</small>
                <h3>In Hindi or any language</h3>
              </div>
            </div>

            <div className="mc-gtabs">
              {[
                ['text', 'Text greeting'],
                ['voice', 'Own recording']
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={greet === id ? 'on' : ''}
                  onClick={() => setGreet(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mc-langs">
              {GREETINGS.map(([l], i) => (
                <button
                  key={l}
                  type="button"
                  className={lang === i ? 'on' : ''}
                  onClick={() => setLang(i)}
                >
                  {l}
                </button>
              ))}
              <span>+ any language</span>
            </div>

            <div className="mc-bubble">
              {greet === 'text' ? (
                <p>&ldquo;{GREETINGS[lang][1]}&rdquo;</p>
              ) : (
                <div className="mc-rec">
                  <Wave on />
                  <p>Your own voice recording plays here, in your own words.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mc-benefits">
          {BENEFITS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <span>{'0' + (i + 1)}</span>
              <b>{t}</b>
              <small>{d}</small>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}