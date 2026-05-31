export interface Product {
  id: string
  name: string
  description?: string
  price: number
  currentStock: number
  totalStock: number
  imageUrl?: string
  updatedAt: string
}

export interface Reservation {
  reservationId: string
  expiresAt: string
  status: string
}

export interface Order {
  orderId: string
  status: string
  createdAt: string
}
