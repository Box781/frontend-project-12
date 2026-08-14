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
        }
    }
})

export const {setData} = authSlice.actions
export default authSlice.reducer
