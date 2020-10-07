import {applyMiddleware, combineReducers, createStore} from "redux";
import {taskReducer} from "./State/task-reducer";
import {todolistReducer} from "./State/todolist-reducer";
import {appReducer} from "./State/app-reducer";
import thunk from "redux-thunk";

export type RootReducerType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todolistReducer,
    app: appReducer
})
export const store = createStore(rootReducer, applyMiddleware(thunk))