import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CountdownTimer } from '../components/CountdownTimer'

describe('CountdownTimer', () => {
  it('renders minutes and seconds correctly', () => {
    render(<CountdownTimer timeLeft={299} />)
    // 299s = 04:59 — each digit is its own div
    const digits = document.querySelectorAll('.countdown-digit')
    const values = Array.from(digits).map((d) => d.textContent)
    expect(values).toEqual(['0', '4', '5', '9'])
    expect(screen.getByText('min')).toBeInTheDocument()
    expect(screen.getByText('sec')).toBeInTheDocument()
  })

  it('renders 00:00 at exactly 0', () => {
    render(<CountdownTimer timeLeft={0} />)
    expect(screen.getByText(/reservation expired/i)).toBeInTheDocument()
  })

  it('shows expiry message when timeLeft is 0', () => {
    render(<CountdownTimer timeLeft={0} />)
    expect(screen.getByText(/stock has been released/i)).toBeInTheDocument()
  })

  it('applies urgent styling in last 60 seconds', () => {
    const { container } = render(<CountdownTimer timeLeft={45} />)
    const urgentDigits = container.querySelectorAll('.countdown-digit.urgent')
    expect(urgentDigits.length).toBe(4)
  })

  it('does not apply urgent styling above 60 seconds', () => {
    const { container } = render(<CountdownTimer timeLeft={61} />)
    const urgentDigits = container.querySelectorAll('.countdown-digit.urgent')
    expect(urgentDigits.length).toBe(0)
  })

  it('shows the correct label', () => {
    render(<CountdownTimer timeLeft={120} />)
    expect(screen.getByText(/reservation expires in/i)).toBeInTheDocument()
  })

  it('renders full 5 minutes correctly', () => {
    render(<CountdownTimer timeLeft={300} />)
    // 300s = 05:00 — each digit is its own div
    const digits = document.querySelectorAll('.countdown-digit')
    const values = Array.from(digits).map((d) => d.textContent)
    expect(values).toEqual(['0', '5', '0', '0'])
  })
})
