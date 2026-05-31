import { useState, useEffect, useCallback } from 'react'
import { apiClient } from './api/client'
import type { Product } from './types'
import { useAuth } from './hooks/useAuth'
import { AuthForm } from './components/AuthForm'
import { ProductCard } from './components/ProductCard'
import { Toast, type ToastData } from './components/Toast'

export default function App() {
  const { isAuthenticated, user, login, register, logout } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [toasts, setToasts]     = useState<ToastData[]>([])

  const fetchProducts = useCallback(() => {
    setLoading(true)
    apiClient
      .get<{ data: Product[] }>('/products')
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (isAuthenticated) fetchProducts()
  }, [isAuthenticated, fetchProducts])

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  if (!isAuthenticated) {
    return <AuthForm onLogin={login} onRegister={register} />
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const inStock    = products.filter((p) => p.currentStock > 0).length
  const totalUnits = products.reduce((acc, p) => acc + p.currentStock, 0)

  return (
    <>
      {/* ── Nav ── */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">D</div>
          <span className="nav-logo-text">Drop System</span>
        </div>
        <div className="nav-right">
          <div className="live-badge">
            <span className="live-dot" />
            Live
          </div>
          <div className="nav-user">
            <span className="nav-user-name">
              {user?.name ?? user?.email}
            </span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero fade-in">
        <div className="hero-eyebrow">
          <span className="hero-tag">Limited Drop</span>
          <span className="hero-date">{today}</span>
        </div>
        <h1 className="hero-title">
          Exclusive <span>Drops</span>.<br />
          Reserve Yours.
        </h1>
        <p className="hero-subtitle">
          Limited stock. First come, first served. Reserve now — your spot holds
          for exactly 5 minutes while you checkout.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">{products.length}</span>
            <span className="hero-stat-label">Active Drops</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">{inStock}</span>
            <span className="hero-stat-label">In Stock</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">{totalUnits}</span>
            <span className="hero-stat-label">Units Left</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">5 min</span>
            <span className="hero-stat-label">Reservation Window</span>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Products ── */}
      <main className="products-section">
        <div className="products-section-header">
          <h2 className="section-title">Today's Drops</h2>
          {!loading && (
            <span className="section-count">
              {products.length} item{products.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="products-grid">
            {[1, 2].map((i) => (
              <div className="skeleton-card" key={i}>
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" style={{ height: 6, borderRadius: 100, marginTop: 4 }} />
                  <div className="skeleton-line btn" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <div className="empty-state-title">No drops right now</div>
            <div className="empty-state-sub">Check back soon for the next drop.</div>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                addToast={addToast}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <span className="footer-text">© 2026 Drop System — All rights reserved.</span>
        <span className="footer-powered">
          <span className="footer-dot" />
          Stock updates every 5s
          <span className="footer-dot" />
          Reservations expire in 5 min
        </span>
      </footer>

      <Toast toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </>
  )
}
