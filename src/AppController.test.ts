import { describe, expect, it, vi } from 'vitest'
import { AppController } from './AppController'
import { BooksRepository } from './features/books/BooksRepository'
import { BooksStore } from './features/books/BooksStore'
import { FakeBooksApi } from './test/FakeBooksApi'

describe('AppController', () => {
  it('cancels loading on unmount and loads again on the next mount', async () => {
    const booksApi = new FakeBooksApi()
    booksApi.privateBooks = [{ name: 'Dune', author: 'Frank Herbert' }]
    const booksStore = new BooksStore(new BooksRepository(booksApi))
    const controller = new AppController(booksStore)

    controller.mount()
    controller.unmount()
    controller.mount()

    await vi.waitFor(() => {
      expect(booksStore.isLoading).toBe(false)
    })
    expect(booksApi.receivedSignals.map((signal) => signal?.aborted)).toEqual([
      true,
      true,
      false,
      false,
    ])
    expect(booksStore.privateBooksCount).toBe(1)
  })
})
