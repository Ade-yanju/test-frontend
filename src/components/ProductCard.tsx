import { useEffect } from 'react'
import { useStockPolling } from '../hooks/useStockPolling'
import { useReservation } from '../hooks/useReservation'
import { StockDisplay } from './StockDisplay'
import { ReserveButton } from './ReserveButton'
import { CountdownTimer } from './CountdownTimer'
import type { ToastData } from './Toast'

interface Props {
  productId: string
  addToast: (toast: Omit<ToastData, 'id'>) => void
}

export function ProductCard({ productId, addToast }: Props) {
  const { product, loading, error } = useStockPolling(productId)
  const { state, timeLeft, errorMessage, orderId, reserve, checkout } = useReservation(productId)

  useEffect(() => {
    if (state === 'completed' && orderId) {
      addToast({
        type: 'success',
        title: 'Order confirmed!',
        message: `Order ${orderId.slice(-8).toUpperCase()} placed successfully.`,
      })
    }
  }, [state, orderId, addToast])

  useEffect(() => {
    if (state === 'expired') {
      addToast({
        type: 'error',
        title: 'Reservation expired',
        message: 'Your spot has been released. Try again.',
      })
    }
  }, [state, addToast])

  useEffect(() => {
    if (errorMessage) {
      addToast({ type: 'error', title: 'Error', message: errorMessage })
    }
  }, [errorMessage, addToast])

  if (loading) {
    return (
      <div className="skeleton-card">
        <div className="skeleton-img" />
        <div className="skeleton-body">
          <div className="skeleton-line medium" />
          <div className="skeleton-line short" />
          <div className="skeleton-line" style={{ height: 4, borderRadius: 100, marginTop: 8 }} />
          <div className="skeleton-line btn" style={{ marginTop: 8 }} />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-card">
        <div style={{ padding: 24, color: 'var(--text-3)', fontSize: 13 }}>
          Failed to load product
        </div>
      </div>
    )
  }

  const soldOut    = product.currentStock === 0
  const pct        = product.totalStock > 0 ? (product.currentStock / product.totalStock) * 100 : 0
  const isLow      = !soldOut && pct <= 20
  const isReserved = state === 'reserved'
  const isComplete = state === 'completed'

  return (
    <div className={`product-card${soldOut ? ' sold-out' : ''} fade-in`}>
      {/* Image */}
      <div className="product-card-image-wrap">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card-image-placeholder">📦</div>
        )}

        {/* Badges */}
        <div className="product-badges">
          {soldOut ? (
            <span className="badge badge-soldout">Sold Out</span>
          ) : isReserved ? (
            <span className="badge badge-reserved">Reserved</span>
          ) : isLow ? (
            <span className="badge badge-lowstock">Low Stock</span>
          ) : (
            <span className="badge badge-limited">Limited</span>
          )}
        </div>

        {/* Live indicator */}
        <div className="product-card-live">
          <span className="live-dot" style={{ width: 5, height: 5 }} />
          Live
        </div>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <div className="product-card-meta">
          <div>
            <div className="product-name">{product.name}</div>
            {product.description && (
              <div className="product-desc">{product.description}</div>
            )}
          </div>
          <div className="product-price">${product.price.toFixed(2)}</div>
        </div>

        <StockDisplay
          currentStock={product.currentStock}
          totalStock={product.totalStock}
        />

        {isReserved && <CountdownTimer timeLeft={timeLeft} />}

        {isComplete && orderId && (
          <div className="checkout-success">
            <div className="checkout-success-icon">✓</div>
            <div className="checkout-success-text">
              <div className="checkout-success-title">Order Confirmed</div>
              <div className="checkout-success-sub">
                #{orderId.slice(-10).toUpperCase()}
              </div>
            </div>
          </div>
        )}

        <ReserveButton
          state={state}
          soldOut={soldOut}
          onReserve={reserve}
          onCheckout={checkout}
        />
      </div>
    </div>
  )
}
