export const getApiBase = () => {
  try {
    const env = import.meta.env
    return (env && env.VITE_API_URL) || 'http://localhost:3000'
  } catch (e: unknown) {
    console.log(e)
    return 'http://localhost:3000'
  }
}

export const getImageUrl = (path: string) => {
  if (!path) return ''

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
}
