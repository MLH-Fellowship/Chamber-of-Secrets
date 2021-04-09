/**Setting server URL on the basis of environment */
export const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://chamber-of-secrets-mlh.herokuapp.com'