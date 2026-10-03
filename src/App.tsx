import { AppController } from './AppController'
import { useController } from './core/useController'
import { AddBookForm } from './features/books/AddBookForm/AddBookForm'
import { BooksList } from './features/books/BooksList/BooksList'
import { Header } from './features/header/Header'

export function App() {
  useController(({ booksStore }) => new AppController(booksStore))

  return (
    <>
      <Header />
      <main className="page">
        <BooksList />
        <AddBookForm />
      </main>
    </>
  )
}
