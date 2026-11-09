const TILES = [[50, 22, '#0F3D3E'], [22, 50, '#E9B44C'], [78, 50, '#2A9D8F'], [50, 78, '#D9622B']]

export default function Logo({ size = 36, top = '#0F3D3E' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {TILES.map(([x, y, c], i) => (
        <rect key={i} x={x - 14} y={y - 14} width="28" height="28" rx="6"
          fill={i === 0 ? top : c} transform={'rotate(45 ' + x + ' ' + y + ')'} />
      ))}
    </svg>
  )
}
