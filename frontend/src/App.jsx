import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const App = () => (
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
)

export default App
