import { afterEach, describe, expect, it, vi } from 'vitest'
import { FetchHttpGateway } from './FetchHttpGateway'
import { HttpError } from './HttpError'

const BASE_URL = 'https://api.example.com/v1/books/tester'

function stubFetch(response: Response) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('FetchHttpGateway', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the path relative to the base url and returns the parsed body', async () => {
    const fetchMock = stubFetch(Response.json([{ id: 1 }]))
    const abortController = new AbortController()

    const body = await new FetchHttpGateway(BASE_URL).get('/private', abortController.signal)

    expect(body).toEqual([{ id: 1 }])
    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/private`, {
      signal: abortController.signal,
    })
  })

  it('posts the body as json', async () => {
    const fetchMock = stubFetch(Response.json({ status: 'ok' }))

    await new FetchHttpGateway(BASE_URL).post('/', { name: 'Dune' })

    expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Dune' }),
    })
  })

  it('throws an HttpError when the response is not successful', async () => {
    stubFetch(new Response('Not found', { status: 404 }))

    const request = new FetchHttpGateway(BASE_URL).post('/books', {})

    await expect(request).rejects.toBeInstanceOf(HttpError)
    await expect(request).rejects.toMatchObject({ status: 404 })
  })
})
