import { Link } from 'react-router-dom'
import Logo from '../common/Logo.jsx'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="fg">
        <div>
          <Link to="/" className="logo"><Logo top="#ffffff" /><b>Tile<span>Quote</span></b></Link>
          <p className="fabout">
            Quotation, follow-up, stock and call management for tile showrooms and tile business owners.
          </p>
        </div>
        <div>
          <h4>Product</h4>
          <Link to="/features">Smart Quoting</Link>
          <Link to="/features">WhatsApp Follow-ups</Link>
          <Link to="/features">Stock Management</Link>
          <Link to="/features">Call Management</Link>
        </div>
        <div>
          <h4>Pages</h4>
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/showrooms">For Showrooms</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/contact">Contact</Link>
          <Link to="/contact">Book a Demo</Link>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
        </div>
      </div>
      <div className="copy">
        <span>&copy; 2026 Tile Quote. All rights reserved.</span>
        <span>Made in India</span>
      </div>
    </footer>
  )
}
