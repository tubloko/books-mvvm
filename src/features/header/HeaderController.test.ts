import { describe, expect, it } from 'vitest'
import { FakeBooksApi } from '../../test/FakeBooksApi'
import { BooksRepository } from '../books/BooksRepository'
import { BooksStore } from '../books/BooksStore'
import { HeaderController } from './HeaderController'

describe('HeaderController', () => {
  it('shows the number of private books', async () => {
    const booksApi = new FakeBooksApi()
    booksApi.privateBooks = [
      { name: 'Dune', author: 'Frank Herbert' },
      { name: 'Solaris', author: 'Stanislaw Lem' },
    ]
    const booksStore = new BooksStore(new BooksRepository(booksApi))
    const controller = new HeaderController(booksStore)
    expect(controller.privateBooksCounter).toBe('Your books: 0')

    await booksStore.loadBooks()

    expect(controller.privateBooksCounter).toBe('Your books: 2')
  })
})
