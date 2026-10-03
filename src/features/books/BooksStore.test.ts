import { reaction } from 'mobx'
import { describe, expect, it } from 'vitest'
import { FakeBooksApi } from '../../test/FakeBooksApi'
import { BooksRepository } from './BooksRepository'
import { BooksStore } from './BooksStore'

function setup() {
  const booksApi = new FakeBooksApi()
  booksApi.privateBooks = [{ name: 'Dune', author: 'Frank Herbert' }]
  return { booksApi, booksStore: new BooksStore(new BooksRepository(booksApi)) }
}

describe('BooksStore', () => {
  it('loads all and private books', async () => {
    const { booksStore } = setup()

    await booksStore.loadBooks()

    expect(booksStore.allBooks.map((book) => book.title)).toEqual([
      'Wind in the willows',
      'I, Robot',
      'Dune',
    ])
    expect(booksStore.privateBooks.map((book) => book.title)).toEqual(['Dune'])
    expect(booksStore.privateBooksCount).toBe(1)
  })

  it('is loading until the books arrive', async () => {
    const { booksStore } = setup()

    const loading = booksStore.loadBooks()
    expect(booksStore.isLoading).toBe(true)
    await loading

    expect(booksStore.isLoading).toBe(false)
  })

  it('applies loaded books in a single batch', async () => {
    const { booksStore } = setup()
    let notificationsCount = 0
    const disposeReaction = reaction(
      () => [booksStore.allBooks, booksStore.privateBooks, booksStore.isLoading],
      () => {
        notificationsCount += 1
      },
    )

    await booksStore.loadBooks()
    disposeReaction()

    expect(notificationsCount).toBe(2)
  })

  it('reports a failed loading', async () => {
    const { booksApi, booksStore } = setup()
    booksApi.isFailing = true

    await booksStore.loadBooks()

    expect(booksStore.hasLoadingFailed).toBe(true)
    expect(booksStore.isLoading).toBe(false)
  })

  it('ignores the result of a cancelled loading', async () => {
    const { booksStore } = setup()

    const loading = booksStore.loadBooks()
    booksStore.cancelLoading()
    await loading

    expect(booksStore.allBooks).toEqual([])
    expect(booksStore.hasLoadingFailed).toBe(false)
    expect(booksStore.isLoading).toBe(false)
  })

  it('keeps only the latest loading when a new one starts', async () => {
    const { booksApi, booksStore } = setup()

    const outdatedLoading = booksStore.loadBooks()
    booksApi.privateBooks = []
    await Promise.all([outdatedLoading, booksStore.loadBooks()])

    expect(booksStore.privateBooksCount).toBe(0)
  })

  it('reloads books after adding one', async () => {
    const { booksStore } = setup()
    await booksStore.loadBooks()

    await booksStore.addBook({ title: 'Solaris', author: 'Stanislaw Lem' })

    expect(booksStore.privateBooks.map((book) => book.title)).toEqual(['Dune', 'Solaris'])
    expect(booksStore.privateBooksCount).toBe(2)
  })
})
