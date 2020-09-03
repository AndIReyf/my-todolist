import {TodoListsType} from "../TodoList/TodoList";
import {FilterType} from "../App";
import {v1} from "uuid";

type ActionType = AddTodoListType | RemoveTodoListType | ChangeTitleTodoListType | ChangeFilterTodoListType
export type AddTodoListType = {
    type: 'ADD-TODOLIST'
    title: string
    todoListId: string
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

const initState: Array<TodoListsType> = []

export const todolistReducer = (state: Array<TodoListsType> = initState, action: ActionType): Array<TodoListsType> => {
    switch (action.type) {
        case "ADD-TODOLIST": {
            return [...state, {id: action.todoListId, title: action.title, filter: 'all'}]
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
        default: return state
    }
}
export const addTodoListAC = (title: string): AddTodoListType => (
    {type: 'ADD-TODOLIST', title, todoListId: v1()}
)
export const removeTodoListAC = (id: string): RemoveTodoListType => {
    return {type: 'REMOVE-TODOLIST', id}
}
export const changeTitleTodoListAC = (title: string, id: string): ChangeTitleTodoListType => {
    return {type: 'CHANGE-TODOLIST-TITLE', title, id}
}
export const changeFilterTodoListAC = (filter: FilterType, id: string): ChangeFilterTodoListType => {
    return {type: 'CHANGE-TODOLIST-FILTER', filter, id}
}