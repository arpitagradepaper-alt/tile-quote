import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../common/Logo.jsx'
import './Navbar.css'

const LINKS = [
  ['/', 'Home'],
  ['/features', 'Features'],
  ['/how-it-works', 'How It Works'],
  ['/showrooms', 'For Showrooms'],
  ['/contact', 'Contact']
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <nav className="nav">
      <Link to="/" className="logo"><Logo top="#ffffff" /><b>Tile<span>Quote</span></b></Link>

      <div className={'links' + (open ? ' open' : '')}>
        {LINKS.map(([p, t]) => (
          <NavLink key={p} to={p} end={p === '/'}>
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="pill" className="pill" />}
                {t}
              </>
            )}
          </NavLink>
        ))}
        
        <Link to="/contact" className="btn mbtn">Book a demo</Link>
      </div>

      <Link to="/contact" className="btn nbtn">Book a demo</Link>

      <button
        className={'burger' + (open ? ' x' : '')}
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span /><span /><span />
      </button>
    </nav>
  )
}
