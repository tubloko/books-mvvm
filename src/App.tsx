import { AddBookForm } from './features/books/AddBookForm/AddBookForm'
import { BooksList } from './features/books/BooksList/BooksList'
import { Header } from './features/header/Header'

export function App() {
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
