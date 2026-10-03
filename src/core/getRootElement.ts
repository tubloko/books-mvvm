export function getRootElement(): HTMLElement {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element "#root" is missing in index.html')
  }
  return rootElement
}
