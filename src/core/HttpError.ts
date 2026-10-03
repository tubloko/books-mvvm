export class HttpError extends Error {
  readonly status: number

  constructor(status: number, url: string) {
    super(`Request to ${url} failed with status ${String(status)}`)
    this.name = 'HttpError'
    this.status = status
  }
}
