import { useQuery, useMutation } from '@tanstack/react-query'
import {getMessages, sendMessage} from '../api/messages.js'

export const useMessages = (token) => useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessages(token),
})

export const useSendMessage = (token) => useMutation({
  mutationFn: ({ body, channelId, username }) =>
    sendMessage(token, { body, channelId, username }),
})