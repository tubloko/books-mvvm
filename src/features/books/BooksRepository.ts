import type { HttpGateway } from '../../core/HttpGateway'
import type { Book, NewBook } from './Book'

export interface BookDto {
  id?: number
  name: string
  author: string
  ownerId?: string
}

export interface AddBookResponseDto {
  status: string
}

const SUCCESS_STATUS = 'ok'

export class BooksRepository {
  readonly #httpGateway: HttpGateway

  constructor(httpGateway: HttpGateway) {
    this.#httpGateway = httpGateway
  }

  getAllBooks(signal?: AbortSignal): Promise<Book[]> {
    return this.#getBooks('/', signal)
  }

  getPrivateBooks(signal?: AbortSignal): Promise<Book[]> {
    return this.#getBooks('/private', signal)
  }

  async addBook(newBook: NewBook): Promise<void> {
    const response = await this.#httpGateway.post<AddBookResponseDto>('/', toNewBookDto(newBook))
    if (response.status !== SUCCESS_STATUS) {
      throw new Error(`Adding a book failed with status "${response.status}"`)
    }
  }

  async #getBooks(path: string, signal?: AbortSignal): Promise<Book[]> {
    const bookDtos = await this.#httpGateway.get<BookDto[]>(path, signal)
    return bookDtos.map(toBook)
  }
}

function toBook(bookDto: BookDto, index: number): Book {
  return {
    // Books created through the API come back without an id, so their position is the only key.
    id: bookDto.id === undefined ? `position-${String(index)}` : String(bookDto.id),
    title: bookDto.name,
    author: bookDto.author,
  }
}

function toNewBookDto(newBook: NewBook): Pick<BookDto, 'name' | 'author'> {
  return { name: newBook.title, author: newBook.author }
}
