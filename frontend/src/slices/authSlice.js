import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username')
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setData: (state, action) => {
            state.token = action.payload.token
            state.username = action.payload.username
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('username', action.payload.username)
        },
        logOut: (state) => {
            state.token = null
            state.username = null
            localStorage.removeItem('token')
            localStorage.removeItem('username')
        }
    }
})

export const {setData, logOut} = authSlice.actions
export default authSlice.reducer
