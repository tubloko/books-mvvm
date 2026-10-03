import type { Lifecycle } from './core/Lifecycle'
import type { BooksStore } from './features/books/BooksStore'

export class AppController implements Lifecycle {
  readonly #booksStore: BooksStore

  constructor(booksStore: BooksStore) {
    this.#booksStore = booksStore
  }

  mount(): void {
    void this.#booksStore.loadBooks()
  }

  unmount(): void {
    this.#booksStore.cancelLoading()
  }
}
