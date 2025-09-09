export const getApiBase = () => {
  try {
    const env = import.meta.env
    return (env && env.VITE_API_URL) || 'http://localhost:3001/api'
  } catch (e: unknown) {
    console.log(e)
    return 'http://localhost:3001/api'
  }
}

export const getImageUrl = (path: string) => {
  if (!path) return '/placeholder-image.jpg'

  if (/^https?:\/\//i.test(path)) return path

  const cleaned = path.startsWith('/') ? path : `/${path}`

  const base = getApiBase().replace(/\/api\/?$/, '')
  return `${base}${cleaned}`
}
