import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../../components/common/Reveal.jsx'
import './RoomVisualizer.css'

const TILES = [
  ['Marble White', '#eeece6', '#e1ded6', '#c4c1b8'],
  ['Rustic Grey', '#8d9598', '#7d8689', '#586063'],
  ['Beige Stone', '#d8c4a0', '#cbb58c', '#a38f6a'],
  ['Charcoal Slate', '#3d4a4c', '#324042', '#1c2627']
]
const PATTERNS = [['Straight', 5], ['Diagonal', 10], ['Herringbone', 15]]
const A = 16

function herringbone(c1, c2) {
  const out = []
  for (let s = -3; s <= 3; s++) {
    for (let k = -4; k <= 4; k++) {
      out.push(['h', 2 * k - s, 2 * k + s, c1])
      out.push(['v', 2 * k + 1 - s, 2 * k + 1 + s, c2])
    }
  }
  return out.filter(([t, x, y]) => {
    const w = t === 'h' ? 2 : 1
    const h = t === 'h' ? 1 : 2
    return x < 4 && y < 4 && x + w > 0 && y + h > 0
  })
}

function Floor({ pat, tile }) {
  const c1 = tile[1]
  const c2 = tile[2]
  const g = tile[3]
  const id = 'fp' + pat
  let def
  if (pat < 2) {
    def = (
      <pattern id={id} width="44" height="44" patternUnits="userSpaceOnUse" patternTransform={pat === 1 ? 'rotate(45)' : undefined}>
        <rect width="44" height="44" fill={g} />
        <rect x="1.5" y="1.5" width="41" height="41" rx="1.5" fill={c1} />
      </pattern>
    )
  } else {
    def = (
      <pattern id={id} width={4 * A} height={4 * A} patternUnits="userSpaceOnUse">
        <rect width={4 * A} height={4 * A} fill={g} />
        {herringbone(c1, c2).map(([t, x, y, c], i) => (
          <rect key={i} x={x * A + 0.8} y={y * A + 0.8}
            width={(t === 'h' ? 2 : 1) * A - 1.6} height={(t === 'h' ? 1 : 2) * A - 1.6}
            rx="1" fill={c} />
        ))}
      </pattern>
    )
  }
  return (
    <svg viewBox="0 0 1100 480" preserveAspectRatio="none">
      <defs>{def}</defs>
      <rect width="1100" height="480" fill={'url(#' + id + ')'} />
    </svg>
  )
}

function Deco() {
  return (
    <svg className="rv-deco" viewBox="0 0 800 500" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rvsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe3ee" />
          <stop offset="1" stopColor="#eef8f6" />
        </linearGradient>
      </defs>
      <rect x="470" y="45" width="170" height="125" rx="6" fill="url(#rvsky)" stroke="#ffffff" strokeWidth="8" />
      <rect x="552" y="45" width="6" height="125" fill="#ffffff" />
      <rect x="470" y="104" width="170" height="6" fill="#ffffff" />
      <rect x="460" y="170" width="190" height="9" rx="3" fill="#ffffff" />
      <rect x="0" y="205" width="800" height="10" fill="#ffffff" opacity="0.95" />
      <ellipse cx="195" cy="242" rx="150" ry="13" fill="rgba(0,0,0,0.2)" />
      <rect x="80" y="118" width="230" height="64" rx="14" fill="#248a7d" />
      <rect x="70" y="150" width="250" height="80" rx="16" fill="#2A9D8F" />
      <rect x="58" y="140" width="38" height="92" rx="14" fill="#248a7d" />
      <rect x="294" y="140" width="38" height="92" rx="14" fill="#248a7d" />
      <rect x="102" y="156" width="92" height="40" rx="10" fill="#33b0a1" />
      <rect x="196" y="156" width="92" height="40" rx="10" fill="#33b0a1" />
      <rect x="86" y="228" width="12" height="12" rx="3" fill="#0F3D3E" />
      <rect x="292" y="228" width="12" height="12" rx="3" fill="#0F3D3E" />
      <ellipse cx="712" cy="246" rx="42" ry="9" fill="rgba(0,0,0,0.2)" />
      <path d="M690 190 H734 L728 242 H696 Z" fill="#D9622B" />
      <ellipse cx="702" cy="160" rx="14" ry="38" fill="#2f8f5b" transform="rotate(-24 702 160)" />
      <ellipse cx="722" cy="156" rx="14" ry="40" fill="#3aa56b" transform="rotate(22 722 156)" />
      <ellipse cx="712" cy="148" rx="12" ry="40" fill="#2f8f5b" />
    </svg>
  )
}

/* tiny pattern icons for the layout buttons */
function PatIcon({ i }) {
  return (
    <svg className="rv-ico" viewBox="0 0 28 28" aria-hidden="true">
      {i === 0 && (
        <g fill="currentColor">
          <rect x="2" y="2" width="11" height="11" rx="2" />
          <rect x="15" y="2" width="11" height="11" rx="2" />
          <rect x="2" y="15" width="11" height="11" rx="2" />
          <rect x="15" y="15" width="11" height="11" rx="2" />
        </g>
      )}
      {i === 1 && (
        <g fill="currentColor">
          <rect x="10" y="1" width="8" height="8" rx="1.5" transform="rotate(45 14 5)" />
          <rect x="1" y="10" width="8" height="8" rx="1.5" transform="rotate(45 5 14)" />
          <rect x="19" y="10" width="8" height="8" rx="1.5" transform="rotate(45 23 14)" />
          <rect x="10" y="19" width="8" height="8" rx="1.5" transform="rotate(45 14 23)" />
        </g>
      )}
      {i === 2 && (
        <g fill="currentColor">
          <rect x="2" y="3" width="14" height="6" rx="1.5" />
          <rect x="12" y="11" width="6" height="14" rx="1.5" />
          <rect x="20" y="3" width="6" height="14" rx="1.5" />
          <rect x="2" y="11" width="8" height="6" rx="1.5" />
        </g>
      )}
    </svg>
  )
}

export default function RoomVisualizer() {
  const [p, setP] = useState(2)
  const [t, setT] = useState(0)
  const tile = TILES[t]
  const waste = PATTERNS[p][1]

  return (
    <section className="sec rv">
      <Reveal>
        <span className="eyebrow">ROOM VISUALIZER</span>
        <h2>See the floor <span className="gt">before you quote</span></h2>
        <p className="sub">Pick a tile and a laying pattern. Your customer sees the room, you see the cutting wastage to put in the quote.</p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="rv-grid">
          <div className="rv-stage">
            <div className="rv-room">
              <div className="rv-wall" />
              <div className="rv-fw">
                <div className="rv-fl">
                  <motion.div className="rv-fade" key={p + '-' + t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <Floor pat={p} tile={tile} />
                  </motion.div>
                </div>
                <div className="rv-shade" />
              </div>
              <Deco />
            </div>

            <div className="rv-bar">
              <div className="rv-seg" role="group" aria-label="Laying pattern">
                {PATTERNS.map(([n], i) => (
                  <button key={n} type="button" aria-pressed={p === i} className={p === i ? 'on' : ''} onClick={() => setP(i)}>
                    {p === i && <motion.span layoutId="rvseg" className="rv-bg" />}
                    <PatIcon i={i} />
                    <span>{n}</span>
                  </button>
                ))}
              </div>
              <span className="rv-div" />
              <div className="rv-sw" role="group" aria-label="Tile">
                {TILES.map((x, i) => (
                  <button key={x[0]} type="button" title={x[0]} aria-label={x[0]} aria-pressed={t === i} className={t === i ? 'on' : ''} onClick={() => setT(i)}>
                    <i style={{ background: x[1], boxShadow: 'inset 0 0 0 4px ' + x[3] }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="rv-slip" aria-live="polite">
            <h3>Quote preview</h3>
            <p className="rv-row"><span>Tile</span><i /><b>{tile[0]}</b></p>
            <p className="rv-row"><span>Laying</span><i /><b>{PATTERNS[p][0]}</b></p>
            <p className="rv-row"><span>Cutting extra</span><i /><b>+{waste}%</b></p>
            <div className="rv-meter">
              <motion.div animate={{ width: (waste / 20) * 100 + '%' }} transition={{ duration: 0.6 }} />
            </div>
            <small>Illustrative figure. In Tile Quote you set your own extra-for-cutting % in Calculation rules.</small>
            <Link to="/contact" className="btn rv-btn">Quote this room &rarr;</Link>
          </aside>
        </div>
      </Reveal>
    </section>
  )
}