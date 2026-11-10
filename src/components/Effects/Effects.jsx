import { useEffect } from 'react'
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion'
import './Effects.css'

export default function Effects() {
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  const x = useMotionValue(-500)
  const y = useMotionValue(-500)
  const gx = useSpring(x, { stiffness: 80, damping: 20 })
  const gy = useSpring(y, { stiffness: 80, damping: 20 })

  useEffect(() => {
    const m = e => { x.set(e.clientX - 210); y.set(e.clientY - 210) }
    window.addEventListener('mousemove', m)
    return () => window.removeEventListener('mousemove', m)
  }, [])

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: bar }} />
      <motion.div className="glow" style={{ x: gx, y: gy }} />
    </>
  )
}
