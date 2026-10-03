import { makeAutoObservable, observableRef } from 'mobx'
import type { SegmentedControlOption } from '../../../shared/ui/SegmentedControl'
import type { Book } from '../Book'
import type { BooksStore } from '../BooksStore'

export interface BookListItemViewModel {
  key: string
  label: string
}

interface BooksFilter {
  label: string
  selectBooks: (booksStore: BooksStore) => Book[]
}

const ALL_BOOKS_FILTER: BooksFilter = {
  label: 'All books',
  selectBooks: (booksStore) => booksStore.allBooks,
}

const PRIVATE_BOOKS_FILTER: BooksFilter = {
  label: 'Private books',
  selectBooks: (booksStore) => booksStore.privateBooks,
}

const BOOKS_FILTERS = [ALL_BOOKS_FILTER, PRIVATE_BOOKS_FILTER]

export const BOOKS_STATUS_MESSAGES = {
  loading: 'Loading books…',
  loadingFailed: 'Could not load books. Please try again later.',
  empty: 'No books yet.',
  none: '',
}

export class BooksListController {
  selectedFilter = ALL_BOOKS_FILTER

  readonly #booksStore: BooksStore

  constructor(booksStore: BooksStore) {
    this.#booksStore = booksStore
    makeAutoObservable(this, { selectedFilter: observableRef })
  }

  get filterOptions(): SegmentedControlOption[] {
    return BOOKS_FILTERS.map((filter) => ({
      key: filter.label,
      label: filter.label,
      isSelected: filter === this.selectedFilter,
      select: () => {
        this.selectFilter(filter)
      },
    }))
  }

  get books(): BookListItemViewModel[] {
    return this.selectedFilter.selectBooks(this.#booksStore).map((book) => ({
      key: book.id,
      label: `${book.author}: ${book.title}`,
    }))
  }

  get statusMessage(): string {
    if (this.#booksStore.hasLoadingFailed) {
      return BOOKS_STATUS_MESSAGES.loadingFailed
    }
    if (this.books.length > 0) {
      return BOOKS_STATUS_MESSAGES.none
    }
    return this.#booksStore.isLoading ? BOOKS_STATUS_MESSAGES.loading : BOOKS_STATUS_MESSAGES.empty
  }

  selectFilter(filter: BooksFilter): void {
    this.selectedFilter = filter
  }
}
