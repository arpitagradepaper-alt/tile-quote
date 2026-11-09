import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function Tilt({ children, className = '' }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 })

  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={{ scale: 1.03 }}
      onMouseMove={e => {
        const b = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - b.left) / b.width - 0.5)
        y.set((e.clientY - b.top) / b.height - 0.5)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}
