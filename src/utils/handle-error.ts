import {setAppErrorMessageAC, setAppStatusAC} from "../Redux/State/app-reducer";
import {ResponseType} from '../api/todolist-api';
import {Dispatch} from "redux";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorMessageAC({errorMessage: data.messages[0]}))
    } else {
        // If the message error will not come from server
        dispatch(setAppErrorMessageAC({errorMessage: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch) => {

    const errorMessage = error.message ? error.message : 'Some error occurred :('

    dispatch(setAppErrorMessageAC({errorMessage: errorMessage}))
    dispatch(setAppStatusAC({status: 'failed'}))
}
