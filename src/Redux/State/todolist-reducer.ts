import {todoListAPI, TodoListType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {setAppStatusAC, SetStatusType, StatusType} from "./app-reducer";

const initState: Array<TodoListDomainType> = []

// Reducer
export const todolistReducer = (state: Array<TodoListDomainType> = initState, action: ActionType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "SET-TODOLIST": {
            return action.todoLists.map(td => ({...td, filter: 'all', entityStatus: "idle"}))
        }
        case "ADD-TODOLIST": {
            return [{...action.todoList, filter: 'all', entityStatus: "idle"}, ...state]
        }
        case "REMOVE-TODOLIST": {
            return state.filter(tl => tl.id !== action.id)
        }
        case "CHANGE-TODOLIST-TITLE": {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title.trim()} : tl)
        }
        case "CHANGE-TODOLIST-FILTER": {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }
        case "CHANGE-TODOS-ENTITY-STATUS": {
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        }
        default:
            return state
    }
}

// Actions Creator
export const addTodoListAC = (todoList: TodoListType) => ({type: 'ADD-TODOLIST', todoList} as const)
export const removeTodoListAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const changeTitleTodoListAC = (title: string, id: string) => ({type: 'CHANGE-TODOLIST-TITLE', title, id} as const)
export const changeFilterTodoListAC = (filter: FilterType, id: string) => ({type:'CHANGE-TODOLIST-FILTER',filter,id} as const)
export const changeTodoListEntityStatusAC = (id: string, status: StatusType) => ({type: 'CHANGE-TODOS-ENTITY-STATUS', id, status} as const)
export const setTodoListAC = (todoLists: Array<TodoListType>) => ({type: 'SET-TODOLIST', todoLists} as const )

// Thunk Creator
export const fetchTodoListsTC = () => (dispatch: ThunkDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    todoListAPI.getTodoLists().then(res => {
        dispatch(setTodoListAC(res.data))
        dispatch(setAppStatusAC('succeeded'))
    })
}
export const createNewTodoListTC = (title: string) => (dispatch: ThunkDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    todoListAPI.createTodoList(title).then(res => {
        dispatch(addTodoListAC(res.data.data.item))
        dispatch(setAppStatusAC('succeeded'))
    })
}
export const deleteTodoListTC = (id: string) => (dispatch: ThunkDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodoListEntityStatusAC(id, 'loading'))
    todoListAPI.deleteTodoList(id).then(res => {
        dispatch(removeTodoListAC(id))
        dispatch(setAppStatusAC('succeeded'))
    })
}
export const updateTodoListTitleTC = (id: string, title: string) => (dispatch: ThunkDispatchType) => {
    todoListAPI.updateTodoListTitle(id, title).then(res => dispatch(changeTitleTodoListAC(title, id)))
}

// Types
type ActionType = AddTodoListType
    | RemoveTodoListType
    | ChangeTitleTodoListType
    | ChangeFilterTodoListType
    | SetTodoListType
    | ChangeTodoListEntityStatusType

export type SetTodoListType = ReturnType<typeof setTodoListAC>
export type AddTodoListType = ReturnType<typeof addTodoListAC>
export type RemoveTodoListType = ReturnType<typeof removeTodoListAC>
type ChangeTitleTodoListType = ReturnType<typeof changeTitleTodoListAC>
type ChangeFilterTodoListType = ReturnType<typeof changeFilterTodoListAC>
type ChangeTodoListEntityStatusType = ReturnType<typeof changeTodoListEntityStatusAC>

type ThunkDispatchType = Dispatch<ActionType | SetStatusType>
export type FilterType = 'all' | 'active' | 'completed'
export type TodoListDomainType = TodoListType & {filter: FilterType, entityStatus: StatusType}
