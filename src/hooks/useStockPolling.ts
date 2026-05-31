import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../api/client'
import type { Product } from '../types'

export function useStockPolling(productId: string, intervalMs = 5000) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    try {
      const data = await apiClient.get<Product>(`/products/${productId}`)
      setProduct(data)
      setError(null)
    } catch {
      setError('Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchProduct()
    const interval = setInterval(fetchProduct, intervalMs)
    return () => clearInterval(interval)
  }, [fetchProduct, intervalMs])

  return { product, loading, error, refetch: fetchProduct }
}
