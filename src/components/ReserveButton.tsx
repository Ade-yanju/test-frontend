import type { ReservationState } from '../hooks/useReservation'

interface Props {
  state: ReservationState
  soldOut: boolean
  onReserve: () => void
  onCheckout: () => void
}

export function ReserveButton({ state, soldOut, onReserve, onCheckout }: Props) {
  if (soldOut && state !== 'completed') {
    return (
      <div className="reserve-btn-wrap">
        <button className="reserve-btn reserve-btn-soldout" disabled>
          Sold Out
        </button>
      </div>
    )
  }

  if (state === 'completed') {
    return (
      <div className="reserve-btn-wrap">
        <button className="reserve-btn reserve-btn-completed" disabled>
          ✓ Order Confirmed
        </button>
      </div>
    )
  }

  if (state === 'expired') {
    return (
      <div className="reserve-btn-wrap">
        <button className="reserve-btn reserve-btn-expired" disabled>
          Reservation Expired
        </button>
        <div className="reserve-hint">Stock has been released back</div>
      </div>
    )
  }

  if (state === 'loading') {
    return (
      <div className="reserve-btn-wrap">
        <button className="reserve-btn reserve-btn-loading" disabled>
          <span className="btn-spinner" />
          Reserving...
        </button>
      </div>
    )
  }

  if (state === 'checkingout') {
    return (
      <div className="reserve-btn-wrap">
        <button className="reserve-btn reserve-btn-loading" disabled>
          <span className="btn-spinner" />
          Processing...
        </button>
      </div>
    )
  }

  if (state === 'reserved') {
    return (
      <div className="reserve-btn-wrap">
        <button className="reserve-btn reserve-btn-checkout" onClick={onCheckout}>
          Complete Purchase →
        </button>
        <div className="reserve-hint">⏳ Your spot is held — complete checkout before timer expires</div>
      </div>
    )
  }

  return (
    <div className="reserve-btn-wrap">
      <button className="reserve-btn reserve-btn-idle" onClick={onReserve}>
        Reserve Now
      </button>
      <div className="reserve-hint">🔒 Locks your spot for 5 minutes</div>
    </div>
  )
}
