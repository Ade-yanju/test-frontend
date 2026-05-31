import { useState, useEffect, useRef } from 'react'
import { apiClient } from '../api/client'
import type { Reservation } from '../types'

export type ReservationState =
  | 'idle'
  | 'loading'
  | 'reserved'
  | 'checkingout'
  | 'completed'
  | 'expired'
  | 'error'

export function useReservation(productId: string) {
  const [state, setState]        = useState<ReservationState>('idle')
  const [reservation, setReserv] = useState<Reservation | null>(null)
  const [timeLeft, setTimeLeft]  = useState(0)
  const [errorMessage, setError] = useState<string | null>(null)
  const [orderId, setOrderId]    = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startCountdown = (expiresAt: string) => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
      )
      setTimeLeft(remaining)
      if (remaining === 0) {
        clearInterval(timerRef.current!)
        setState('expired')
      }
    }, 1000)
  }

  const reserve = async () => {
    setState('loading')
    setError(null)
    try {
      const data = await apiClient.post<Reservation>('/reservations/reserve', {
        productId,
        quantity: 1,
      })
      setReserv(data)
      setState('reserved')
      startCountdown(data.expiresAt)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reservation failed')
      setState('error')
    }
  }

  const checkout = async () => {
    if (!reservation) return
    setState('checkingout')
    try {
      const order = await apiClient.post<{ orderId: string; status: string }>(
        '/reservations/checkout',
        { reservationId: reservation.reservationId }
      )
      if (timerRef.current) clearInterval(timerRef.current)
      setOrderId(order.orderId)
      setState('completed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
      setState('reserved')
    }
  }

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setState('idle')
    setReserv(null)
    setTimeLeft(0)
    setError(null)
    setOrderId(null)
  }

  useEffect(
    () => () => { if (timerRef.current) clearInterval(timerRef.current) },
    []
  )

  return { state, reservation, timeLeft, errorMessage, orderId, reserve, checkout, reset }
}
