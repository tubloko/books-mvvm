import { makeAutoObservable } from 'mobx'
import type { BooksStore } from '../books/BooksStore'

export class HeaderController {
  readonly #booksStore: BooksStore

  constructor(booksStore: BooksStore) {
    this.#booksStore = booksStore
    makeAutoObservable(this)
  }

  get privateBooksCounter(): string {
    return `Your books: ${String(this.#booksStore.privateBooksCount)}`
  }
}
