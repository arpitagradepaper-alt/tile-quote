import './OwnerBenefit.css'

const BENEFITS = [
  [
    'Quotes ready in minutes',
    'Staff work out boxes, extra for cutting, adhesive, grout and GST by hand on every enquiry.',
    'Enter room sizes and tiles. The full price is ready, and a PDF quote goes to the customer on WhatsApp.'
  ],
  [
    'More quotes turn into orders',
    'Customers go quiet after a quote and nobody remembers to chase them.',
    'Follow-up reminders appear on the days you set, with the WhatsApp message already typed.'
  ],
  [
    'No customer lost to a missed call',
    'A call that rings out is a customer who calls the next showroom.',
    'The call rings your team. If nobody picks up, a call-back task is created.'
  ],
  [
    'Stock you can trust',
    'Tiles get promised that are not in the godown, while old stock sits unsold.',
    'Stock reduces automatically when an order is won, and old stock is suggested when it fits.'
  ]
]

const DASHBOARD = [
  'Sales in rupees',
  'Quotes sent and waiting for reply',
  'Orders won and conversion',
  'Missed calls and call-backs'
]

export default function OwnerBenefit() {
  return (
    <section className="ob">
      <div className="ob-in">
        <h2>What you get as the owner</h2>
        <p className="ob-sub">
          Four things Tile Quote does for your showroom, in plain words.
        </p>

        <div className="ob-grid">
          {BENEFITS.map(([title, today, now]) => (
            <div className="ob-card" key={title}>
              <h3>{title}</h3>
              <p className="ob-row">
                <b className="ob-tag before">Today</b>
                {today}
              </p>
              <p className="ob-row">
                <b className="ob-tag after">With Tile Quote</b>
                {now}
              </p>
            </div>
          ))}
        </div>

        <div className="ob-dash">
          <h3>On your dashboard you see</h3>
          <ul>
            {DASHBOARD.map(d => (
              <li key={d}>
                <span aria-hidden="true">&#10003;</span> {d}
              </li>
            ))}
          </ul>
          <p>Your customer only gets a PDF on WhatsApp. No app, no sign-up.</p>
        </div>
      </div>
    </section>
  )
}