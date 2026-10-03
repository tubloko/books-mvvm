import { useEffect, useState } from 'react'
import { type Dependencies, useDependencies } from './Dependencies'
import { hasLifecycle } from './Lifecycle'

export function useController<TController extends object>(
  createController: (dependencies: Dependencies) => TController,
): TController {
  const dependencies = useDependencies()
  const [controller] = useState(() => createController(dependencies))

  useEffect(() => {
    if (!hasLifecycle(controller)) {
      return
    }
    controller.mount()
    return () => {
      controller.unmount()
    }
  }, [controller])

  return controller
}
