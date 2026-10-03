import { BooksRepository } from '../features/books/BooksRepository'
import { BooksStore } from '../features/books/BooksStore'
import { API_BASE_URL } from './config'
import type { Dependencies } from './Dependencies'
import { FetchHttpGateway } from './FetchHttpGateway'

export function createDependencies(): Dependencies {
  const httpGateway = new FetchHttpGateway(API_BASE_URL)
  const booksRepository = new BooksRepository(httpGateway)
  return { booksStore: new BooksStore(booksRepository) }
}
