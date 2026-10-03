import { makeAutoObservable, runInAction } from 'mobx'
import type { Book, NewBook } from './Book'
import type { BooksRepository } from './BooksRepository'

export class BooksStore {
  allBooks: Book[] = []
  privateBooks: Book[] = []
  isLoading = false
  hasLoadingFailed = false

  readonly #booksRepository: BooksRepository
  #loadingAbortController: AbortController | null = null

  constructor(booksRepository: BooksRepository) {
    this.#booksRepository = booksRepository
    makeAutoObservable(this)
  }

  get privateBooksCount(): number {
    return this.privateBooks.length
  }

  async loadBooks(): Promise<void> {
    this.cancelLoading()
    const abortController = new AbortController()
    this.#loadingAbortController = abortController
    this.isLoading = true
    this.hasLoadingFailed = false

    try {
      const [allBooks, privateBooks] = await Promise.all([
        this.#booksRepository.getAllBooks(abortController.signal),
        this.#booksRepository.getPrivateBooks(abortController.signal),
      ])
      runInAction(() => {
        this.allBooks = allBooks
        this.privateBooks = privateBooks
        this.isLoading = false
      })
    } catch (error) {
      if (abortController.signal.aborted) {
        return
      }
      console.debug('Loading books failed', error)
      runInAction(() => {
        this.hasLoadingFailed = true
        this.isLoading = false
      })
    }
  }

  cancelLoading(): void {
    this.#loadingAbortController?.abort()
    this.#loadingAbortController = null
    this.isLoading = false
  }

  async addBook(newBook: NewBook): Promise<void> {
    await this.#booksRepository.addBook(newBook)
    await this.loadBooks()
  }
}
