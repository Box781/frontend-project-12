import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import i18n from './i18n.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import filter from 'leo-profanity'
import * as Sentry from '@sentry/react'

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
  })
}


filter.clearList()
filter.add(filter.getDictionary('ru'))

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <I18nextProvider i18n={i18n}>
    <MantineProvider>
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <StrictMode>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </StrictMode>
        </Provider>
      </QueryClientProvider>
    </MantineProvider>
  </I18nextProvider>,
)
