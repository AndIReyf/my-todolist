const initState: InitialStateType = {
    status: "idle",
    error: null
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
        default: return state
    }
}

// Action Creator
export const setAppErrorMessageAC = (errorMessage: string | null) => ({type: 'APP/SET-ERROR-MESSAGE', errorMessage} as const);
export const setAppStatusAC = (status: StatusType) => ({type: 'APP/SET-STATUS', status} as const);

// Types
export type InitialStateType = {
    status: StatusType
    error: string | null
}
type ActionType = SetErrorMessageType | SetStatusType

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetErrorMessageType = ReturnType<typeof setAppErrorMessageAC>
export type SetStatusType = ReturnType<typeof setAppStatusAC>