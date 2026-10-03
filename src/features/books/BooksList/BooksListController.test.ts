import { describe, expect, it } from 'vitest'
import { FakeBooksApi } from '../../../test/FakeBooksApi'
import { BooksRepository } from '../BooksRepository'
import { BooksStore } from '../BooksStore'
import { BOOKS_STATUS_MESSAGES, BooksListController } from './BooksListController'

function setup() {
  const booksApi = new FakeBooksApi()
  booksApi.privateBooks = [{ name: 'Dune', author: 'Frank Herbert' }]
  const booksStore = new BooksStore(new BooksRepository(booksApi))
  return { booksApi, booksStore, controller: new BooksListController(booksStore) }
}

function selectedOptionLabels(controller: BooksListController): string[] {
  return controller.filterOptions
    .filter((option) => option.isSelected)
    .map((option) => option.label)
}

function selectOption(controller: BooksListController, label: string): void {
  controller.filterOptions.find((option) => option.label === label)?.select()
}

describe('BooksListController', () => {
  it('offers mutually exclusive "All books" and "Private books" filters with "All books" selected', () => {
    const { controller } = setup()

    expect(controller.filterOptions.map((option) => option.label)).toEqual([
      'All books',
      'Private books',
    ])
    expect(selectedOptionLabels(controller)).toEqual(['All books'])
  })

  it('shows all books as "author: title" labels', async () => {
    const { booksStore, controller } = setup()

    await booksStore.loadBooks()

    expect(controller.books).toEqual([
      { key: '111', label: 'Kenneth Graeme: Wind in the willows' },
      { key: '121', label: 'Isaac Asimov: I, Robot' },
      { key: 'position-2', label: 'Frank Herbert: Dune' },
    ])
  })

  it('shows only private books when the private filter is selected', async () => {
    const { booksStore, controller } = setup()
    await booksStore.loadBooks()

    selectOption(controller, 'Private books')

    expect(selectedOptionLabels(controller)).toEqual(['Private books'])
    expect(controller.books.map((book) => book.label)).toEqual(['Frank Herbert: Dune'])
  })

  it('shows a loading message until the first books arrive', () => {
    const { controller } = setup()

    expect(controller.statusMessage).toBe(BOOKS_STATUS_MESSAGES.loading)
  })

  it('shows no message when books are displayed', async () => {
    const { booksStore, controller } = setup()

    await booksStore.loadBooks()

    expect(controller.statusMessage).toBe(BOOKS_STATUS_MESSAGES.none)
  })

  it('shows an empty message when the selected filter has no books', async () => {
    const { booksApi, booksStore, controller } = setup()
    booksApi.privateBooks = []
    await booksStore.loadBooks()

    selectOption(controller, 'Private books')

    expect(controller.statusMessage).toBe(BOOKS_STATUS_MESSAGES.empty)
  })

  it('shows an error message when loading fails', async () => {
    const { booksApi, booksStore, controller } = setup()
    booksApi.isFailing = true

    await booksStore.loadBooks()

    expect(controller.statusMessage).toBe(BOOKS_STATUS_MESSAGES.loadingFailed)
  })
})
