import { makeAutoObservable } from 'mobx'
import type { Lifecycle } from '../../../core/Lifecycle'
import type { SegmentedControlOption } from '../../../shared/ui/SegmentedControl'
import type { Book } from '../Book'
import type { BooksStore } from '../BooksStore'

export interface BookListItemViewModel {
  key: string
  label: string
}

interface BooksFilter {
  key: string
  label: string
  selectBooks: (booksStore: BooksStore) => Book[]
}

const BOOKS_FILTERS: BooksFilter[] = [
  { key: 'all', label: 'All books', selectBooks: (booksStore) => booksStore.allBooks },
  { key: 'private', label: 'Private books', selectBooks: (booksStore) => booksStore.privateBooks },
]

const [DEFAULT_FILTER] = BOOKS_FILTERS

export const BOOKS_STATUS_MESSAGES = {
  loading: 'Loading books…',
  loadingFailed: 'Could not load books. Please try again later.',
  empty: 'No books yet.',
  none: '',
}

export class BooksListController implements Lifecycle {
  selectedFilterKey = DEFAULT_FILTER.key

  readonly #booksStore: BooksStore

  constructor(booksStore: BooksStore) {
    this.#booksStore = booksStore
    makeAutoObservable(this)
  }

  get filterOptions(): SegmentedControlOption[] {
    return BOOKS_FILTERS.map((filter) => ({
      key: filter.key,
      label: filter.label,
      isSelected: filter === this.#selectedFilter,
      select: () => {
        this.selectFilter(filter.key)
      },
    }))
  }

  get books(): BookListItemViewModel[] {
    return this.#selectedFilter.selectBooks(this.#booksStore).map((book) => ({
      key: book.id,
      label: `${book.author}: ${book.title}`,
    }))
  }

  get #selectedFilter(): BooksFilter {
    return BOOKS_FILTERS.find((filter) => filter.key === this.selectedFilterKey) ?? DEFAULT_FILTER
  }

  get isLoading(): boolean {
    return this.#booksStore.isLoading
  }

  get statusMessage(): string {
    if (this.#booksStore.hasLoadingFailed) {
      return BOOKS_STATUS_MESSAGES.loadingFailed
    }
    if (this.books.length > 0) {
      return BOOKS_STATUS_MESSAGES.none
    }
    return this.isLoading ? BOOKS_STATUS_MESSAGES.loading : BOOKS_STATUS_MESSAGES.empty
  }

  selectFilter(filterKey: string): void {
    this.selectedFilterKey = filterKey
  }

  mount(): void {
    void this.#booksStore.loadBooks()
  }

  unmount(): void {
    this.#booksStore.cancelLoading()
  }
}
