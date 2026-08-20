import axios from 'axios'
import { authHeaders } from './client.js'

export const getChannels = async (token) => {
  const { data } = await axios.get('/api/v1/channels', authHeaders(token))
  return data
}
export const addChannel = async (token, name) => {
  const { data } = await axios.post('/api/v1/channels', { name }, authHeaders(token))
  return data
}
export const renameChannel = async (token, name, id) => {
  const { data } = await axios.patch(`/api/v1/channels/${id}`, { name }, authHeaders(token))
  return data
}
export const removeChannel = async (token, id) => {
  const { data } = await axios.delete(`/api/v1/channels/${id}`, authHeaders(token))
  return data
}