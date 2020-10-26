import {Dispatch} from "redux";
import {authAPI} from "../../api/todolist-api";
import {setSignInAC} from "./login-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initState: InitialStateType = {
    status: "idle",
    error: null,
    initialized: false,
}

// Reducer
const slice = createSlice({
    name: 'app',
    initialState: initState,
    reducers: {
        setAppErrorMessageAC(state, action: PayloadAction<{errorMessage: string | null}>) {
            state.error = action.payload.errorMessage
        },
        setAppStatusAC(state, action: PayloadAction<{status: StatusType}>) {
            state.status = action.payload.status
        },
        setAppInitializedAC(state, action: PayloadAction<{isInitialized: boolean}>) {
            state.initialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
export const {setAppErrorMessageAC, setAppStatusAC, setAppInitializedAC} = slice.actions

// Thunk Creator
export const initializedAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setSignInAC({isSignIn: true}))
            }
            dispatch(setAppInitializedAC({isInitialized: true}))
        })
}

// Types
export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: StatusType
    error: string | null
    initialized: boolean
}
