export const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})