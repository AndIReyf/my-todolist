import {setAppErrorMessageAC, setAppStatusAC, SetErrorMessageType, SetStatusType} from "../Redux/State/app-reducer";
import {ResponseType} from '../api/todolist-api';
import {Dispatch} from "redux";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: DispatchType) => {
    if (data.messages.length) {
        dispatch(setAppErrorMessageAC(data.messages[0]))
    } else {
        // If the message error will not come from server
        dispatch(setAppErrorMessageAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: DispatchType) => {
    dispatch(setAppErrorMessageAC(error.message ? error.message : 'Some error occurred :('))
    dispatch(setAppStatusAC('failed'))
}

type DispatchType = Dispatch<SetErrorMessageType | SetStatusType>