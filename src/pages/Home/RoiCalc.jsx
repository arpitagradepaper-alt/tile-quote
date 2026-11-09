import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, animate, useMotionValue, useTransform } from 'framer-motion'
import Reveal from '../../components/common/Reveal.jsx'
import './RoiCalc.css'

// Sample assumptions. Change these to your own numbers.
const RATE_FOLLOW = 0.08
const RATE_CALL = 0.1
const MIN_SAVED = 15

function money(v) {
  const n = Math.round(v)
  if (n >= 10000000) return '\u20B9 ' + (n / 10000000).toFixed(2) + ' Cr'
  if (n >= 100000) return '\u20B9 ' + (n / 100000).toFixed(1) + ' L'
  return '\u20B9 ' + n.toLocaleString('en-IN')
}

function Num({ value, fmt }) {
  const mv = useMotionValue(0)
  const txt = useTransform(mv, v => fmt(v))
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.7, ease: 'easeOut' })
    return () => c.stop()
  }, [value])
  return <motion.span>{txt}</motion.span>
}

function Slide({ label, value, set, min, max, step, show }) {
  return (
    <div className="roi-s">
      <label><span>{label}</span><b>{show(value)}</b></label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(+e.target.value)} />
    </div>
  )
}

export default function RoiCalc() {
  const [enq, setEnq] = useState(120)
  const [aov, setAov] = useState(45000)
  const [forgot, setForgot] = useState(40)
  const [miss, setMiss] = useState(25)

  const fromFollow = enq * (forgot / 100) * RATE_FOLLOW
  const fromCalls = miss * RATE_CALL
  const orders = fromFollow + fromCalls
  const month = orders * aov
  const hours = (enq * MIN_SAVED) / 60
  const total = fromFollow + fromCalls || 1
  const pf = (fromFollow / total) * 100

  return (
    <section className="roi">
      <div className="roi-in">
        <Reveal>
          <span className="eyebrow">WHAT IS IT WORTH?</span>
          <h2>How much are you <span className="yl">leaving on the table?</span></h2>
          <p className="sub">Move the sliders to match your showroom. This is an estimate of sales that forgotten follow-ups and missed calls can cost you.</p>
        </Reveal>

        <div className="roi-grid">
          <Reveal>
            <div className="roi-card">
              <Slide label="Enquiries per month" value={enq} set={setEnq} min={20} max={500} step={10} show={v => v} />
              <Slide label="Average order value" value={aov} set={setAov} min={10000} max={200000} step={5000} show={money} />
              <Slide label="Follow-ups you forget" value={forgot} set={setForgot} min={10} max={80} step={5} show={v => v + '%'} />
              <Slide label="Missed calls per month" value={miss} set={setMiss} min={0} max={100} step={5} show={v => v} />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="roi-card roi-out">
              <small>Estimated extra sales every month</small>
              <div className="roi-big"><b><Num value={month} fmt={money} /></b></div>
              <div className="roi-mini">
                <div><small>Extra orders a year</small><b><Num value={orders * 12} fmt={v => Math.round(v)} /></b></div>
                <div><small>Hours saved a month</small><b><Num value={hours} fmt={v => Math.round(v)} /></b></div>
              </div>
              <div className="roi-split">
                <motion.div className="a" animate={{ width: pf + '%' }} transition={{ duration: 0.6 }} />
                <motion.div className="b" animate={{ width: 100 - pf + '%' }} transition={{ duration: 0.6 }} />
              </div>
              <div className="roi-leg"><span><i className="a" />From follow-ups</span><span><i className="b" />From missed calls</span></div>
              <Link to="/contact" className="btn roi-btn">Check my real numbers &rarr;</Link>
              <p className="roi-note">Estimate only. Assumes 8% of forgotten follow-ups and 10% of missed calls turn into orders, and 15 minutes saved per quote. Your real numbers will differ.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
