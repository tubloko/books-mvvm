import { observer } from 'mobx-react-lite'
import { useController } from '../../../core/useController'
import { SegmentedControl } from '../../../shared/ui/SegmentedControl'
import { BooksListController } from './BooksListController'

export const BooksList = observer(function BooksList() {
  const controller = useController(({ booksStore }) => new BooksListController(booksStore))

  return (
    <section className="books-list" aria-labelledby="books-list-title">
      <h2 id="books-list-title">Books</h2>
      <SegmentedControl label="Books filter" options={controller.filterOptions} />
      <p role="status" className="books-list__status">
        {controller.statusMessage}
      </p>
      <ul className="books-list__items" aria-busy={controller.isLoading}>
        {controller.books.map((book) => (
          <li key={book.key}>{book.label}</li>
        ))}
      </ul>
    </section>
  )
})
