const API_ROOT_URL = 'https://tdd.demo.reaktivate.com/v1/books'
const DEFAULT_API_USER = 'ruslan'

export const API_USER = import.meta.env.VITE_API_USER ?? DEFAULT_API_USER
export const API_BASE_URL = `${API_ROOT_URL}/${API_USER}`
