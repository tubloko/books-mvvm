import { createContext, useContext } from 'react'
import type { BooksStore } from '../features/books/BooksStore'

export interface Dependencies {
  booksStore: BooksStore
}

export const DependenciesContext = createContext<Dependencies | null>(null)

export function useDependencies(): Dependencies {
  const dependencies = useContext(DependenciesContext)
  if (!dependencies) {
    throw new Error('useDependencies must be used inside DependenciesContext')
  }
  return dependencies
}
