import { describe, expect, it } from 'vitest'
import { FakeBooksApi } from '../../test/FakeBooksApi'
import { BooksRepository } from './BooksRepository'

function setup() {
  const booksApi = new FakeBooksApi()
  return { booksApi, booksRepository: new BooksRepository(booksApi) }
}

describe('BooksRepository', () => {
  it('maps api books to domain books', async () => {
    const { booksRepository } = setup()

    const books = await booksRepository.getAllBooks()

    expect(books).toEqual([
      { id: '111', title: 'Wind in the willows', author: 'Kenneth Graeme' },
      { id: '121', title: 'I, Robot', author: 'Isaac Asimov' },
    ])
  })

  it('uses the list position as the id of books returned without an id', async () => {
    const { booksApi, booksRepository } = setup()
    booksApi.privateBooks = [
      { name: 'Dune', author: 'Frank Herbert' },
      { name: 'Solaris', author: 'Stanislaw Lem' },
    ]

    const books = await booksRepository.getPrivateBooks()

    expect(books.map((book) => book.id)).toEqual(['position-0', 'position-1'])
  })

  it('sends a new book in the api format', async () => {
    const { booksApi, booksRepository } = setup()

    await booksRepository.addBook({ title: 'Dune', author: 'Frank Herbert' })

    expect(booksApi.postedBodies).toEqual([{ name: 'Dune', author: 'Frank Herbert' }])
  })

  it('rejects when the api does not confirm adding a book', async () => {
    const { booksApi, booksRepository } = setup()
    booksApi.addBookStatus = 'error'

    await expect(
      booksRepository.addBook({ title: 'Dune', author: 'Frank Herbert' }),
    ).rejects.toThrow('Adding a book failed with status "error"')
  })
})
