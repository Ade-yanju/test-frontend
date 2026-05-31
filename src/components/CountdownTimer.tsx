interface Props {
  timeLeft: number
}

export function CountdownTimer({ timeLeft }: Props) {
  if (timeLeft === 0) {
    return (
      <div className="countdown-wrap">
        <div className="countdown-expired">
          <span>⚠</span>
          Reservation expired — stock has been released
        </div>
      </div>
    )
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const isUrgent = timeLeft <= 60

  const m1 = Math.floor(mins / 10).toString()
  const m2 = (mins % 10).toString()
  const s1 = Math.floor(secs / 10).toString()
  const s2 = (secs % 10).toString()

  return (
    <div className="countdown-wrap">
      <div className="countdown-label">Reservation expires in</div>
      <div className="countdown-digits">
        <div className="countdown-unit">
          <div className="countdown-digit-group">
            <div className={`countdown-digit${isUrgent ? ' urgent' : ''}`}>{m1}</div>
            <div className={`countdown-digit${isUrgent ? ' urgent' : ''}`}>{m2}</div>
          </div>
          <span className="countdown-unit-label">min</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-unit">
          <div className="countdown-digit-group">
            <div className={`countdown-digit${isUrgent ? ' urgent' : ''}`}>{s1}</div>
            <div className={`countdown-digit${isUrgent ? ' urgent' : ''}`}>{s2}</div>
          </div>
          <span className="countdown-unit-label">sec</span>
        </div>
      </div>
    </div>
  )
}
