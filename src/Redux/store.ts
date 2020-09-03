import {combineReducers, createStore} from "redux";
import {taskReducer} from "../State/task-reducer";
import {todolistReducer} from "../State/todolist-reducer";

export type RootReducerType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    tasks: taskReducer,
    todoLists: todolistReducer
})
export const store = createStore(rootReducer)