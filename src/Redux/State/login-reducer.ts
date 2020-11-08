import {Dispatch} from "redux";
import {setAppStatusAC} from "./app-reducer";
import {authAPI, LoginParamsType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/handle-error";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// Reducer
const slice = createSlice({
    name: 'auth',
    initialState: {isSignIn: false},
    reducers: {
        setSignInAC(state, action: PayloadAction<{isSignIn: boolean}>) {
           state.isSignIn = action.payload.isSignIn
        }
    }
})

export const loginReducer = slice.reducer
export const {setSignInAC} = slice.actions

// Thunk Creator
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setSignInAC({isSignIn: true}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setSignInAC({isSignIn: false}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
