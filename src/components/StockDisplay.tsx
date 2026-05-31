interface Props {
  currentStock: number
  totalStock: number
}

export function StockDisplay({ currentStock, totalStock }: Props) {
  const pct = totalStock > 0 ? (currentStock / totalStock) * 100 : 0
  const isSoldOut = currentStock === 0
  const isLow     = !isSoldOut && pct <= 20
  const isMedium  = !isSoldOut && pct > 20 && pct <= 50

  const fillClass = isSoldOut ? '' : isLow ? 'low' : isMedium ? 'medium' : 'high'
  const countClass = isSoldOut ? 'sold' : isLow ? 'urgent' : ''

  return (
    <div className="stock-display">
      <div className="stock-display-header">
        <span className="stock-label">Availability</span>
        <span className={`stock-count ${countClass}`}>
          {isSoldOut
            ? 'Sold out'
            : isLow
            ? `⚡ Only ${currentStock} left`
            : `${currentStock} / ${totalStock} units`}
        </span>
      </div>
      <div className="stock-bar-track">
        {!isSoldOut && (
          <div
            className={`stock-bar-fill ${fillClass}`}
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        )}
      </div>
    </div>
  )
}
