import {todoListAPI, TodoListType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {setAppStatusAC, StatusType} from "./app-reducer";
import {handleServerNetworkError} from "../../utils/handle-error";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// Reducer
const slice = createSlice({
    name: 'todolist',
    initialState: [] as Array<TodoListDomainType>,
    reducers: {
        addTodoListAC(state, action: PayloadAction<{ todoList: TodoListType }>) {
            state.unshift({...action.payload.todoList, filter: 'all', entityStatus: "idle"})
        },
        removeTodoListAC(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        changeTitleTodoListAC(state, action: PayloadAction<{ title: string, id: string }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeFilterTodoListAC(state, action: PayloadAction<{ filter: FilterType, id: string }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodoListEntityStatusAC(state, action: PayloadAction<{ id: string, status: StatusType }>) {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        },
        setTodoListAC(state, action: PayloadAction<{ todoLists: Array<TodoListType> }>) {
            return action.payload.todoLists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
    }
})

export const todolistReducer = slice.reducer
export const {
    addTodoListAC, removeTodoListAC, changeTitleTodoListAC,
    changeFilterTodoListAC, changeTodoListEntityStatusAC, setTodoListAC
} = slice.actions

// Thunk Creator
export const fetchTodoListsTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListAPI.getTodoLists()
        .then(res => {
            dispatch(setTodoListAC({todoLists: res.data}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
export const createNewTodoListTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListAPI.createTodoList(title)
        .then(res => {
            dispatch(addTodoListAC({todoList: res.data.data.item}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
export const deleteTodoListTC = (id: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodoListEntityStatusAC({id, status: 'loading'}))
    todoListAPI.deleteTodoList(id)
        .then(res => {
            dispatch(removeTodoListAC({id}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
export const updateTodoListTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListAPI.updateTodoListTitle(id, title)
        .then(res => {
            dispatch(changeTitleTodoListAC({title, id}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}

// Types
export type FilterType = 'all' | 'active' | 'completed'
export type TodoListDomainType = TodoListType & { filter: FilterType, entityStatus: StatusType }
