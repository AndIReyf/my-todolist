import {authAPI} from "../../api/todolist-api";
import {setSignInAC} from "./login-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const initializedApp = createAsyncThunk('app/initializedApp',
    async (arg, {dispatch}) => {

        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setSignInAC({isSignIn: true}))
        }
    }
)

const slice = createSlice({
    name: 'app',
    initialState: {
        status: "idle",
        error: null,
        initialized: false,
    } as InitialStateType,
    reducers: {
        setAppErrorMessageAC(state, action: PayloadAction<{ errorMessage: string | null }>) {
            state.error = action.payload.errorMessage
        },
        setAppStatusAC(state, action: PayloadAction<{ status: StatusType }>) {
            state.status = action.payload.status
        }
    },
    extraReducers: builder => {
        builder
            .addCase(initializedApp.fulfilled, (state) => {
                state.initialized = true
            })
    }
})

export const appReducer = slice.reducer
export const {setAppErrorMessageAC, setAppStatusAC} = slice.actions

// Types
export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: StatusType
    error: string | null
    initialized: boolean
}
