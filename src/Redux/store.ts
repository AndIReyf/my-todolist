import {combineReducers} from "redux";
import {taskReducer} from "./State/task-reducer";
import {todolistReducer} from "./State/todolist-reducer";
import {appReducer} from "./State/app-reducer";
import thunk from "redux-thunk";
import {loginReducer} from "./State/login-reducer";
import {configureStore} from "@reduxjs/toolkit";

export type RootReducerType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todolistReducer,
    app: appReducer,
    auth: loginReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})