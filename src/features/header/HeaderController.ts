import { makeAutoObservable } from 'mobx'
import type { BooksStore } from '../books/BooksStore'

export class HeaderController {
  readonly #booksStore: BooksStore

  constructor(booksStore: BooksStore) {
    this.#booksStore = booksStore
    makeAutoObservable(this)
  }

  get privateBooksCounterLabel(): string {
    return `Your books: ${this.#privateBooksCountText}`
  }

  get #privateBooksCountText(): string {
    if (this.#booksStore.hasLoadingFailed) {
      return '—'
    }
    return this.#booksStore.isLoading ? '…' : String(this.#booksStore.privateBooksCount)
  }
}
