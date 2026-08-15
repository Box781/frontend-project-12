import {create} from 'zustand'

const useZustandStore = create((set)=>({
    currentChannelId: null,
    setCurrentChannelId: (id)=>set({currentChannelId: id})
}))

export default useZustandStore