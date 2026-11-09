import { motion } from 'framer-motion'

export default function Words({ text, className = '', delay = 0 }) {
  return (
    <span className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="mask">
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', rotate: 6 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ delay: delay + i * 0.09, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  )
}
