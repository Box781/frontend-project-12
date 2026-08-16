import { Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import PrivateRoute from './Components/PrivateRoute.jsx'
import SignUpPage from './pages/SignUpPage.jsx'

const App = () => (
  <Routes>
    <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)

export default App
