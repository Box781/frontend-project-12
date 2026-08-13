import React from "react"
import {useFormik} from 'formik'

const LoginPage = () => {
    const formik = useFormik({
        initialValues: {
       username: '',
       password:''
     },
     onSubmit: () => {}
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
     </form>
    )
} 

export default LoginPage