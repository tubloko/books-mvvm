import { observer } from 'mobx-react-lite'
import { useController } from '../../core/useController'
import { HeaderController } from './HeaderController'

export const Header = observer(function Header() {
  const controller = useController(({ booksStore }) => new HeaderController(booksStore))

  return (
    <header className="header">
      <h1 className="header__title">Library</h1>
      <span className="header__counter">{controller.privateBooksCounterLabel}</span>
    </header>
  )
})
