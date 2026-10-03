import type { HttpGateway } from './HttpGateway'

export class FetchHttpGateway implements HttpGateway {
  readonly #baseUrl: string

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl
  }

  get<ResponseBody>(path: string, signal?: AbortSignal): Promise<ResponseBody> {
    return this.#request<ResponseBody>(path, { signal })
  }

  post<ResponseBody>(path: string, body: unknown): Promise<ResponseBody> {
    return this.#request<ResponseBody>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  async #request<ResponseBody>(path: string, requestInit: RequestInit): Promise<ResponseBody> {
    const url = `${this.#baseUrl}${path}`
    const response = await fetch(url, requestInit)
    if (!response.ok) {
      throw new Error(`Request to ${url} failed with status ${String(response.status)}`)
    }
    return (await response.json()) as ResponseBody
  }
}
