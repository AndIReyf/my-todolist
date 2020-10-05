import {todoListAPI, TodoListType} from "../api/todolist-api";
import {Dispatch} from "redux";

export type FilterType = 'all' | 'active' | 'completed'
type ActionType = AddTodoListType
    | RemoveTodoListType
    | ChangeTitleTodoListType
    | ChangeFilterTodoListType
    | SetTodoListType

export type SetTodoListType = {
    type: 'SET-TODOLIST'
    todoLists: Array<TodoListType>
}
export type AddTodoListType = {
    type: 'ADD-TODOLIST'
    todoList: TodoListType
}
export type RemoveTodoListType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
type ChangeTitleTodoListType = {
    type: 'CHANGE-TODOLIST-TITLE'
    title: string
    id: string
}
type ChangeFilterTodoListType = {
    type: 'CHANGE-TODOLIST-FILTER'
    filter: FilterType
    id: string
}
export type TodoListDomainType = TodoListType & {
    filter: FilterType
}

const initState: Array<TodoListDomainType> = []

// Reducer
export const todolistReducer = (state: Array<TodoListDomainType> = initState, action: ActionType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "SET-TODOLIST": {
            return action.todoLists.map(td => ({...td, filter: 'all'}))
        }
        case "ADD-TODOLIST": {
            const newTodoList: TodoListDomainType = {...action.todoList, filter: 'all'}
            return [newTodoList, ...state]
        }
        case "REMOVE-TODOLIST": {
            return state.filter(tl => tl.id !== action.id)
        }
        case "CHANGE-TODOLIST-TITLE": {
            const todoListTitle = state.find(tl => tl.id === action.id);
            if (todoListTitle) {
                todoListTitle.title = action.title.trim();
            }
            return [...state]
        }
        case "CHANGE-TODOLIST-FILTER": {
            const todoListFilter = state.find(td => td.id === action.id);
            if (todoListFilter) {
                todoListFilter.filter = action.filter;
            }
            return [...state]
        }
        default:
            return state
    }
}

// Actions Creator
export const addTodoListAC = (todoList: TodoListType): AddTodoListType => ({type: 'ADD-TODOLIST', todoList})
export const removeTodoListAC = (id: string): RemoveTodoListType => ({type: 'REMOVE-TODOLIST', id})
export const changeTitleTodoListAC = (title: string, id: string): ChangeTitleTodoListType => {
    return {type: 'CHANGE-TODOLIST-TITLE', title, id}
}
export const changeFilterTodoListAC = (filter: FilterType, id: string): ChangeFilterTodoListType => {
    return {type: 'CHANGE-TODOLIST-FILTER', filter, id}
}
export const setTodoListAC = (todoLists: Array<TodoListType>): SetTodoListType => {
    return {type: 'SET-TODOLIST', todoLists}
}

// Thunk Creator
export const fetchTodoListsTC = () => (dispatch: Dispatch) => {
    todoListAPI.getTodoLists().then(res => dispatch(setTodoListAC(res.data)))
}
export const createNewTodoListTC = (title: string) => (dispatch: Dispatch) => {
    todoListAPI.createTodoList(title).then(res => dispatch(addTodoListAC(res.data.data.item)))
}
export const deleteTodoListTC = (id: string) => (dispatch: Dispatch) => {
    todoListAPI.deleteTodoList(id).then(res => dispatch(removeTodoListAC(id)))
}
export const updateTodoListTitleTC = (id: string, title: string) => (dispatch: Dispatch) => {
    todoListAPI.updateTodoListTitle(id, title).then(res => dispatch(changeTitleTodoListAC(title, id)))
}