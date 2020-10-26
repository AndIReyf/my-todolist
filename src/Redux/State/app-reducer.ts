import {Dispatch} from "redux";
import {authAPI} from "../../api/todolist-api";
import {setSignInAC} from "./login-reducer";

const initState: InitialStateType = {
    status: "idle",
    error: null,
    initialized: false,
}

// Reducer
export const appReducer = (state: InitialStateType = initState, action: ActionType): InitialStateType => {
    switch (action.type) {
        case "APP/SET-ERROR-MESSAGE": {
            return {...state, error: action.errorMessage}
        }
        case "APP/SET-STATUS": {
            return {...state, status: action.status}
        }
        case "APP/SET-INITIALIZED-VALUE": {
            return {...state, initialized: action.isInitialized}
        }
        default:
            return state
    }
}

// Action Creator
export const setAppErrorMessageAC = (errorMessage: string | null) => ({type: 'APP/SET-ERROR-MESSAGE', errorMessage} as const)
export const setAppStatusAC = (status: StatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppInitializedAC = (isInitialized: boolean) => ({type: 'APP/SET-INITIALIZED-VALUE', isInitialized} as const)

// Thunk Creator
export const initializedAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setSignInAC({isSignIn: true}))
            }
            dispatch(setAppInitializedAC(true))
        })
}

// Types
export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    status: StatusType
    error: string | null
    initialized: boolean
}
type ActionType = SetErrorMessageType
    | SetStatusType
    | SetInitializedType
export type SetErrorMessageType = ReturnType<typeof setAppErrorMessageAC>
export type SetStatusType = ReturnType<typeof setAppStatusAC>
export type SetInitializedType = ReturnType<typeof setAppInitializedAC>