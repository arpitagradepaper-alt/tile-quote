import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Effects from './components/Effects/Effects.jsx'
import Intro from './components/common/Intro.jsx'
import ChatBot from './components/ChatBot/ChatBot.jsx'
import Home from './pages/Home/Home.jsx'
import Features from './pages/Features/Features.jsx'
import HowItWorks from './pages/HowItWorks/HowItWorks.jsx'
import Showrooms from './pages/Showrooms/Showrooms.jsx'
import Contact from './pages/Contact/Contact.jsx'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function introSeen() {
  try { return sessionStorage.getItem('tq-intro') === '1' } catch (e) { return true }
}

export default function App() {
  const [ready, setReady] = useState(introSeen)

  return (
    <>
      <Intro onReveal={() => setReady(true)} />
      {ready && (
        <>
          <ScrollTop />
          <Effects />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/showrooms" element={<Showrooms />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
          <ChatBot />
        </>
      )}
    </>
  )
}
