import type { ChangeEvent, SubmitEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { FakeBooksApi } from '../../../test/FakeBooksApi'
import { HeaderController } from '../../header/HeaderController'
import { BooksRepository } from '../BooksRepository'
import { BooksStore } from '../BooksStore'
import { ADD_BOOK_MESSAGES, AddBookFormController } from './AddBookFormController'

function setup() {
  const booksApi = new FakeBooksApi()
  const booksStore = new BooksStore(new BooksRepository(booksApi))
  return { booksApi, booksStore, controller: new AddBookFormController(booksStore) }
}

function inputEvent(value: string): ChangeEvent<HTMLInputElement> {
  return { target: { value } } as ChangeEvent<HTMLInputElement>
}

function fillForm(controller: AddBookFormController, title: string, author: string): void {
  controller.changeTitle(inputEvent(title))
  controller.changeAuthor(inputEvent(author))
}

describe('AddBookFormController', () => {
  it('disables submitting until both fields have text', () => {
    const { controller } = setup()
    expect(controller.isSubmitDisabled).toBe(true)

    fillForm(controller, 'Dune', '   ')
    expect(controller.isSubmitDisabled).toBe(true)

    fillForm(controller, 'Dune', 'Frank Herbert')
    expect(controller.isSubmitDisabled).toBe(false)
  })

  it('adds a trimmed book and clears the form', async () => {
    const { booksApi, controller } = setup()
    fillForm(controller, '  Dune ', ' Frank Herbert  ')

    await controller.submit()

    expect(booksApi.postedBodies).toEqual([{ name: 'Dune', author: 'Frank Herbert' }])
    expect(controller.title).toBe('')
    expect(controller.author).toBe('')
  })

  it('updates the private books counter after adding a book', async () => {
    const { booksStore, controller } = setup()
    const headerController = new HeaderController(booksStore)
    fillForm(controller, 'Dune', 'Frank Herbert')

    await controller.submit()

    expect(headerController.privateBooksCounterLabel).toBe('Your books: 1')
  })

  it('shows the submitting state while the book is being added', async () => {
    const { controller } = setup()
    fillForm(controller, 'Dune', 'Frank Herbert')

    const submitting = controller.submit()
    expect(controller.isSubmitDisabled).toBe(true)
    expect(controller.submitButtonLabel).toBe(ADD_BOOK_MESSAGES.submitting)
    await submitting

    expect(controller.submitButtonLabel).toBe(ADD_BOOK_MESSAGES.submit)
  })

  it('ignores repeated submits while the book is being added', async () => {
    const { booksApi, controller } = setup()
    fillForm(controller, 'Dune', 'Frank Herbert')

    await Promise.all([controller.submit(), controller.submit()])

    expect(booksApi.postedBodies).toHaveLength(1)
  })

  it('keeps the entered values and shows an error when adding fails', async () => {
    const { booksApi, controller } = setup()
    booksApi.isFailing = true
    fillForm(controller, 'Dune', 'Frank Herbert')

    await controller.submit()

    expect(controller.errorMessage).toBe(ADD_BOOK_MESSAGES.failed)
    expect(controller.title).toBe('Dune')
    expect(controller.isSubmitDisabled).toBe(false)
  })

  it('clears the previous error on a new submit', async () => {
    const { booksApi, controller } = setup()
    booksApi.isFailing = true
    fillForm(controller, 'Dune', 'Frank Herbert')
    await controller.submit()

    booksApi.isFailing = false
    await controller.submit()

    expect(controller.errorMessage).toBe('')
  })

  it('prevents the native form submission', () => {
    const { controller } = setup()
    const preventDefault = vi.fn()

    controller.submitForm({ preventDefault } as unknown as SubmitEvent<HTMLFormElement>)

    expect(preventDefault).toHaveBeenCalled()
  })
})
