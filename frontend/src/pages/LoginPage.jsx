import React from "react"
import { useFormik } from 'formik'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from "react"
import { useDispatch } from 'react-redux'
import { setData } from "../slices/authSlice"


const LoginPage = () => {
    const dispatch = useDispatch()
    const [authFailed, setAuthFailed] = useState(false)
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: async (values) => {
            setAuthFailed(false)
            try {
                const { data } = await axios.post('/api/v1/login', values)
                dispatch(setData({ token: data.token, username: data.username }))
                navigate('/')
            }
            catch (error) {
                if (error.response?.status === 401) {
                    setAuthFailed(true)
                }
            }
        }
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="username">Имя</label>
            <input
                id="username"
                name="username"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.username}
            />
            <label htmlFor="password">Пароль</label>
            <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
            />

            <button type="submit">Войти</button>
            {authFailed && <div>Неверные имя пользователя или пароль</div>}
        </form>
    )
}

export default LoginPage