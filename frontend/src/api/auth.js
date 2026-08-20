import axios from 'axios'

export const login = async (values) => {
    const { data } = await axios.post('/api/v1/login', values)
    return data
}

export const signUp = async (values) => {
    const { data } = await axios.post('/api/v1/signup', {
        username: values.username,
        password: values.password,
    })
    return data
}