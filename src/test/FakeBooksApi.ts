import type { HttpGateway } from '../core/HttpGateway'
import { HttpError } from '../core/HttpError'
import type { AddBookResponseDto, BookDto } from '../features/books/BooksRepository'

export const SHARED_BOOKS: BookDto[] = [
  { id: 111, name: 'Wind in the willows', author: 'Kenneth Graeme', ownerId: 'postnikov' },
  { id: 121, name: 'I, Robot', author: 'Isaac Asimov', ownerId: 'postnikov' },
]

export class FakeBooksApi implements HttpGateway {
  sharedBooks: BookDto[] = [...SHARED_BOOKS]
  privateBooks: BookDto[] = []
  addBookStatus = 'ok'
  isFailing = false
  readonly postedBodies: unknown[] = []

  async get<ResponseBody>(path: string, signal?: AbortSignal): Promise<ResponseBody> {
    await Promise.resolve()
    signal?.throwIfAborted()
    this.#throwIfFailing(path)
    const booksByPath: Record<string, BookDto[]> = {
      '/': [...this.sharedBooks, ...this.privateBooks],
      '/private': this.privateBooks,
    }
    return booksByPath[path] as ResponseBody
  }

  async post<ResponseBody>(path: string, body: unknown): Promise<ResponseBody> {
    await Promise.resolve()
    this.#throwIfFailing(path)
    this.postedBodies.push(body)
    this.privateBooks.push(body as BookDto)
    const response: AddBookResponseDto = { status: this.addBookStatus }
    return response as ResponseBody
  }

  #throwIfFailing(path: string): void {
    if (this.isFailing) {
      throw new HttpError(500, path)
    }
  }
}
