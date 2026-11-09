import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './MissedCall.css'

const callSteps = [
  {
    number: '01',
    title: 'Call rings the team',
    description: 'The customer call reaches your sales team. Try the salesperson first or ring everyone together.',
    icon: '📞'
  },
  {
    number: '02',
    title: 'Press 1 to take it',
    description: 'The salesperson confirms by pressing 1. Voicemail does not count as an answered call.',
    icon: '👆'
  },
  {
    number: '03',
    title: 'Nobody available?',
    description: 'The customer can request a callback or leave a voice message, even after showroom hours.',
    icon: '🎙️'
  },
  {
    number: '04',
    title: 'Callback task created',
    description: 'A callback task appears on the dashboard, due within 15 minutes.',
    icon: '⏱️'
  }
]

const reports = [
  { label: 'Calls received', value: '248', icon: '📲' },
  { label: 'Answered calls', value: '216', icon: '✓' },
  { label: 'Missed calls', value: '32', icon: '📵' },
  { label: 'Pending callbacks', value: '08', icon: '↗' }
]

export default function MissedCall() {
  const [active, setActive] = useState(0)
  const [showReport, setShowReport] = useState(false)

  return (
    <section className="mc-section">
      <div className="mc-container">

        <motion.div
          className="mc-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="mc-eyebrow">
            <span className="mc-live-dot" />
            SMART CALL MANAGEMENT
          </span>

          <h2>
            Never lose a customer
            <br />
            to a <span>missed call.</span>
          </h2>

          <p>
            Every incoming enquiry matters. Tile Quote helps your showroom
            answer calls, organise callbacks and turn missed opportunities
            into potential orders.
          </p>
        </motion.div>

        <div className="mc-layout">

          {/* LEFT: CALL FLOW */}

          <div className="mc-flow">

            <div className="mc-flow-top">
              <div>
                <small>HOW IT WORKS</small>
                <h3>One call. Four smart steps.</h3>
              </div>
              <span className="mc-flow-badge">AUTOMATED FLOW</span>
            </div>

            <div className="mc-steps">
              {callSteps.map((step, index) => (
                <motion.button
                  type="button"
                  key={step.number}
                  className={`mc-step ${active === index ? 'active' : ''}`}
                  onClick={() => setActive(index)}
                  whileHover={{ x: 5 }}
                >
                  <span className="mc-step-number">
                    {step.number}
                  </span>

                  <span className="mc-step-icon">
                    {step.icon}
                  </span>

                  <span className="mc-step-content">
                    <strong>{step.title}</strong>
                    <small>{step.description}</small>
                  </span>

                  <span className="mc-step-arrow">↗</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="mc-detail"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <span>STEP {active + 1} / 4</span>
                <strong>{callSteps[active].title}</strong>
                <p>{callSteps[active].description}</p>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* RIGHT: CALL DASHBOARD */}

          <motion.div
            className="mc-dashboard"
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >

            <div className="mc-dash-header">
              <div>
                <small>SHOWROOM OVERVIEW</small>
                <h3>Call activity</h3>
              </div>

              <span className="mc-online">
                <i /> Live preview
              </span>
            </div>

            <div className="mc-call-card">
              <div className="mc-call-icon">📞</div>

              <div className="mc-caller">
                <small>INCOMING CUSTOMER</small>
                <strong>Rahul Sharma</strong>
                <span>+91 98765 43210</span>
              </div>

              <span className="mc-call-status">Incoming</span>
            </div>

            <div className="mc-routing">
              <span className="mc-routing-line" />
              <div>
                <small>CALL ROUTING</small>
                <strong>Sales team notification</strong>
              </div>
              <span className="mc-routing-count">03 members</span>
            </div>

            <div className="mc-members">

              <div className="mc-member">
                <span className="mc-avatar av1">A</span>
                <div>
                  <strong>Arjun</strong>
                  <small>Salesperson</small>
                </div>
                <span className="mc-member-state answered">
                  Available
                </span>
              </div>

              <div className="mc-member">
                <span className="mc-avatar av2">R</span>
                <div>
                  <strong>Rahul</strong>
                  <small>Salesperson</small>
                </div>
                <span className="mc-member-state busy">
                  Busy
                </span>
              </div>

              <div className="mc-member">
                <span className="mc-avatar av3">S</span>
                <div>
                  <strong>Sameer</strong>
                  <small>Salesperson</small>
                </div>
                <span className="mc-member-state answered">
                  Available
                </span>
              </div>

            </div>

            <div className="mc-callback">
              <div className="mc-callback-icon">⏰</div>

              <div>
                <small>CALLBACK TASK CREATED</small>
                <strong>Rahul Sharma</strong>
                <span>Customer waiting for a callback</span>
              </div>

              <div className="mc-timer">
                <strong>15</strong>
                <small>MIN</small>
              </div>
            </div>

            <button
              className="mc-report-btn"
              type="button"
              onClick={() => setShowReport(!showReport)}
            >
              {showReport ? 'Hide call report' : 'View call report'}
              <span>↗</span>
            </button>

            <AnimatePresence>
              {showReport && (
                <motion.div
                  className="mc-report"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {reports.map(item => (
                    <div className="mc-report-item" key={item.label}>
                      <span>{item.icon}</span>
                      <small>{item.label}</small>
                      <strong>{item.value}</strong>
                    </div>
                  ))}

                  <p>Illustrative showroom call report.</p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

        </div>

        {/* BOTTOM BENEFITS */}

        <div className="mc-benefits">

          <div>
            <span>01</span>
            <strong>No enquiry left behind</strong>
            <small>Capture missed calls and callback requests.</small>
          </div>

          <div>
            <span>02</span>
            <strong>15-minute callbacks</strong>
            <small>Give your team a clear response deadline.</small>
          </div>

          <div>
            <span>03</span>
            <strong>Owner's call report</strong>
            <small>Track calls and team performance.</small>
          </div>

        </div>

      </div>
    </section>
  )
}
