import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiClient } from '../api/client'

describe('apiClient — error handling', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

  it('throws a typed error on non-2xx response', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ error: 'Insufficient stock' }),
    } as Response)

    await expect(apiClient.post('/reservations/reserve', {})).rejects.toThrow(
      'Insufficient stock'
    )
  })

  it('falls back to status code message when no error body', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => { throw new Error('bad json') },
    } as unknown as Response)

    await expect(apiClient.post('/reservations/reserve', {})).rejects.toThrow(
      'Request failed: 500'
    )
  })

  it('throws timeout error when request exceeds 10s', async () => {
    global.fetch = vi.fn().mockImplementationOnce(
      (_url: string, opts: RequestInit) =>
        new Promise((_resolve, reject) => {
          opts.signal?.addEventListener('abort', () => {
            const err = new DOMException('The operation was aborted.', 'AbortError')
            reject(err)
          })
        })
    )

    const promise = apiClient.get('/products')
    vi.advanceTimersByTime(10_001)
    await expect(promise).rejects.toThrow(/timed out/i)
  })

  it('resolves and returns parsed JSON on success', async () => {
    const mockData = { data: [{ id: '1', name: 'Sneaker' }] }
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response)

    const result = await apiClient.get<typeof mockData>('/products')
    expect(result).toEqual(mockData)
  })

  it('throws when network is completely unavailable', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new TypeError('Failed to fetch'))

    await expect(apiClient.get('/products')).rejects.toThrow('Failed to fetch')
  })
})
