import type { HttpGateway } from '../core/HttpGateway'
import { HttpError } from '../core/HttpError'
import type { AddBookResponseDto, BookDto } from '../features/books/BooksRepository'

export class FakeBooksApi implements HttpGateway {
  sharedBooks: BookDto[] = [
    { id: 111, name: 'Wind in the willows', author: 'Kenneth Graeme', ownerId: 'postnikov' },
    { id: 121, name: 'I, Robot', author: 'Isaac Asimov', ownerId: 'postnikov' },
  ]
  privateBooks: BookDto[] = []
  addBookStatus = 'ok'
  isFailing = false
  readonly postedBodies: unknown[] = []
  readonly receivedSignals: (AbortSignal | undefined)[] = []

  async get<ResponseBody>(path: string, signal?: AbortSignal): Promise<ResponseBody> {
    this.receivedSignals.push(signal)
    await Promise.resolve()
    signal?.throwIfAborted()
    const booksByPath: Partial<Record<string, BookDto[]>> = {
      '/': [...this.sharedBooks, ...this.privateBooks],
      '/private': this.privateBooks,
    }
    return this.#respond(path, booksByPath[path]) as ResponseBody
  }

  async post<ResponseBody>(path: string, body: unknown): Promise<ResponseBody> {
    await Promise.resolve()
    const response: AddBookResponseDto = { status: this.addBookStatus }
    const result = this.#respond(path, path === '/' ? response : undefined)
    this.postedBodies.push(body)
    this.privateBooks.push(body as BookDto)
    return result as ResponseBody
  }

  #respond(path: string, body: unknown): unknown {
    if (this.isFailing) {
      throw new HttpError(500, path)
    }
    if (body === undefined) {
      throw new HttpError(404, path)
    }
    return body
  }
}
