import {Dispatch} from "redux";
import {setAppStatusAC, SetErrorMessageType, SetStatusType} from "./app-reducer";
import {authAPI, LoginParamsType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/handle-error";

const initState: InitialStateType = {
    isSignIn: false
}

// Reducer
export const loginReducer = (state: InitialStateType = initState, action: ActionType): InitialStateType => {
    switch (action.type){
        case "login/IS-SIGN-IN": {
            return {...state, isSignIn: action.isSignIn}
        }
        default:
            return state
    }
}

// Action Creator
export const setSignInAC = (isSignIn: boolean) => ({type: 'login/IS-SIGN-IN', isSignIn} as const)

// Thunk Creator
export const loginTC = (data: LoginParamsType) => (dispatch: ThunkDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setSignInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
export const logoutTC = () => (dispatch: ThunkDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setSignInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}

// Types
type InitialStateType = {
    isSignIn: boolean
}

type ActionType = SignInType
type SignInType = ReturnType<typeof setSignInAC>

type ThunkDispatchType = Dispatch<SetStatusType | SetErrorMessageType | ActionType>