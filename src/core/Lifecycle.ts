export interface Lifecycle {
  mount(): void
  unmount(): void
}

export function hasLifecycle(controller: object): controller is Lifecycle {
  return 'mount' in controller && 'unmount' in controller
}
