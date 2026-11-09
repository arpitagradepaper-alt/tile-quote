import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'

export default function Counter({ to, prefix = '', dur = 2 }) {
  const ref = useRef()
  const seen = useInView(ref, { once: true })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!seen) return
    const c = animate(0, to, { duration: dur, ease: 'easeOut', onUpdate: v => setN(Math.round(v)) })
    return () => c.stop()
  }, [seen])

  return <span ref={ref}>{prefix}{n.toLocaleString('en-IN')}</span>
}
