import { observer } from 'mobx-react-lite'
import { useController } from '../../../core/useController'
import { TextField } from '../../../shared/ui/TextField'
import { AddBookFormController } from './AddBookFormController'

export const AddBookForm = observer(function AddBookForm() {
  const controller = useController(({ booksStore }) => new AddBookFormController(booksStore))

  return (
    <form
      className="add-book-form"
      aria-labelledby="add-book-title"
      onSubmit={controller.handleSubmit}
    >
      <h2 id="add-book-title">Add a book</h2>
      <TextField label="Title" value={controller.title} onChange={controller.changeTitle} />
      <TextField label="Author" value={controller.author} onChange={controller.changeAuthor} />
      <button
        type="submit"
        className="add-book-form__submit"
        disabled={controller.isSubmitDisabled}
      >
        {controller.submitButtonLabel}
      </button>
      <p role="alert" className="add-book-form__error">
        {controller.errorMessage}
      </p>
    </form>
  )
})
