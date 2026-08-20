import { useQuery, useMutation } from '@tanstack/react-query'
import {
    getChannels,
    addChannel,
    renameChannel,
    removeChannel,
} from '../api/channels.js'

export const useChannels = (token) => useQuery({
    queryKey: ['channels'],
    queryFn: () => getChannels(token),
})

export const useAddChannel = (token) => useMutation({
    mutationFn: (name) => addChannel(token, name),
})

export const useRenameChannel = (token) => useMutation({
    mutationFn: ({ id, name }) => renameChannel(token, name, id),
})

export const useRemoveChannel = (token) => useMutation({
    mutationFn: (id) => removeChannel(token, id),
})