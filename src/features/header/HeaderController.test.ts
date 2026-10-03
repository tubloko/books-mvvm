import { describe, expect, it } from 'vitest'
import { FakeBooksApi } from '../../test/FakeBooksApi'
import { BooksRepository } from '../books/BooksRepository'
import { BooksStore } from '../books/BooksStore'
import { HeaderController } from './HeaderController'

function setup() {
  const booksApi = new FakeBooksApi()
  booksApi.privateBooks = [
    { name: 'Dune', author: 'Frank Herbert' },
    { name: 'Solaris', author: 'Stanislaw Lem' },
  ]
  const booksStore = new BooksStore(new BooksRepository(booksApi))
  return { booksApi, booksStore, controller: new HeaderController(booksStore) }
}

describe('HeaderController', () => {
  it('shows a placeholder until the books are loaded', () => {
    const { controller } = setup()

    expect(controller.privateBooksCounterLabel).toBe('Your books: …')
  })

  it('shows the number of private books', async () => {
    const { booksStore, controller } = setup()

    await booksStore.loadBooks()

    expect(controller.privateBooksCounterLabel).toBe('Your books: 2')
  })

  it('does not show a count when loading fails', async () => {
    const { booksApi, booksStore, controller } = setup()
    booksApi.isFailing = true

    await booksStore.loadBooks()

    expect(controller.privateBooksCounterLabel).toBe('Your books: —')
  })
})
