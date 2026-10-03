import { makeAutoObservable, runInAction } from 'mobx'
import type { ChangeEvent, SubmitEvent } from 'react'
import type { BooksStore } from '../BooksStore'

export const ADD_BOOK_MESSAGES = {
  submit: 'Add book',
  submitting: 'Adding…',
  failed: 'Could not add the book. Please try again.',
}

export class AddBookFormController {
  title = ''
  author = ''
  isSubmitting = false
  errorMessage = ''

  readonly #booksStore: BooksStore

  constructor(booksStore: BooksStore) {
    this.#booksStore = booksStore
    makeAutoObservable(this)
  }

  get isSubmitDisabled(): boolean {
    return this.isSubmitting || this.title.trim() === '' || this.author.trim() === ''
  }

  get submitButtonLabel(): string {
    return this.isSubmitting ? ADD_BOOK_MESSAGES.submitting : ADD_BOOK_MESSAGES.submit
  }

  changeTitle = (event: ChangeEvent<HTMLInputElement>): void => {
    this.title = event.target.value
  }

  changeAuthor = (event: ChangeEvent<HTMLInputElement>): void => {
    this.author = event.target.value
  }

  submitForm = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault()
    void this.submit()
  }

  async submit(): Promise<void> {
    if (this.isSubmitDisabled) {
      return
    }
    this.isSubmitting = true
    this.errorMessage = ''

    try {
      await this.#booksStore.addBook({ title: this.title.trim(), author: this.author.trim() })
      runInAction(() => {
        this.title = ''
        this.author = ''
        this.isSubmitting = false
      })
    } catch (error) {
      console.debug('Adding a book failed', error)
      runInAction(() => {
        this.errorMessage = ADD_BOOK_MESSAGES.failed
        this.isSubmitting = false
      })
    }
  }
}
