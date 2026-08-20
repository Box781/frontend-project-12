import axios from 'axios'
import { authHeaders } from './client.js'

export const getMessages = async (token) => {
    const { data } = await axios.get('/api/v1/messages', authHeaders(token))
    return data
}

export const sendMessage = async (token, { body, channelId, username }) => {
    const { data } = await axios.post(
        '/api/v1/messages',
        { body, channelId, username },
        authHeaders(token),
    )
    return data
}