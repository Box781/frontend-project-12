import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

const UiStoreContext = createContext(null)

export const createUiStore = () => createStore((set) => ({
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

export const UiStoreProvider = ({ store, children }) => (
  <UiStoreContext.Provider value={store}>
    {children}
  </UiStoreContext.Provider>
)

export const useUiStoreApi = () => {
  const store = useContext(UiStoreContext)
  if (!store) {
    throw new Error('UiStoreProvider is missing')
  }
  return store
}

const useZustandStore = (selector) => {
  const store = useUiStoreApi()
  return useStore(store, selector)
}

export default useZustandStore
