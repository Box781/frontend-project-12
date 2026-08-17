import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import filter from 'leo-profanity'
import * as Sentry from '@sentry/react'

import App from './App.jsx'
import createStore from './store.js'
import { setData } from './slices/authSlice.js'
import resources from './locales/index.js'
import { SocketProvider } from './contexts/SocketContext.jsx'
import { createUiStore, UiStoreProvider } from './zustandStore.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './index.css'

const init = async (socket) => {
  if (import.meta.env.VITE_SENTRY_DSN && !Sentry.getClient()) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
    })
  }

  filter.clearList()
  filter.add(filter.getDictionary('en'))
  filter.add(filter.getDictionary('ru'))

  const i18n = i18next.createInstance()
  await i18n.use(initReactI18next).init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  })

  const store = createStore()
  const queryClient = new QueryClient()
  const uiStore = createUiStore()

  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  if (token && username) {
    store.dispatch(setData({ token, username }))
  }

  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider>
        <Notifications />
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <UiStoreProvider store={uiStore}>
              <SocketProvider socket={socket}>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </SocketProvider>
            </UiStoreProvider>
          </QueryClientProvider>
        </Provider>
      </MantineProvider>
    </I18nextProvider>
  )
}

export default init
