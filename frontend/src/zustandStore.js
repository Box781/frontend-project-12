import { create } from 'zustand'

const useZustandStore = create((set) => ({
    currentChannelId: null,
    channelIdToManage: null,
    modalType: null,

    setCurrentChannelId: (id) => set({ currentChannelId: id }),


    openModal: (type, channelId = null) => set({
        modalType: type,
        channelIdToManage: channelId,
    }),
    
    closeModal: () => set({
        modalType: null,
        channelIdToManage: null,
    }),

}))

export default useZustandStore