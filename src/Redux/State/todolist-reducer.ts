import {todoListAPI, TodoListType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {setStatusAC, SetStatusType, StatusType} from "./app-reducer";

const initState: Array<TodoListDomainType> = []

// Reducer
export const todolistReducer = (state: Array<TodoListDomainType> = initState, action: ActionType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "SET-TODOLIST": {
            return action.todoLists.map(td => ({...td, filter: 'all', entityStatus: "idle"}))
        }
        case "ADD-TODOLIST": {
            const newTodoList: TodoListDomainType = {...action.todoList, filter: 'all', entityStatus: "idle"}
            return [newTodoList, ...state]
        }
        case "REMOVE-TODOLIST": {
            return state.filter(tl => tl.id !== action.id)
        }
        case "CHANGE-TODOLIST-TITLE": {
            const todoListTitle = state.find(tl => tl.id === action.id);
            if (todoListTitle) {
                todoListTitle.title = action.title.trim()
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
export const addTodoListAC = (todoList: TodoListType) => ({type: 'ADD-TODOLIST', todoList} as const)
export const removeTodoListAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const changeTitleTodoListAC = (title: string, id: string) => ({type: 'CHANGE-TODOLIST-TITLE', title, id} as const)
export const changeFilterTodoListAC = (filter: FilterType, id: string) => ({type:'CHANGE-TODOLIST-FILTER',filter,id} as const)
export const setTodoListAC = (todoLists: Array<TodoListType>) => ({type: 'SET-TODOLIST', todoLists} as const )

// Thunk Creator
export const fetchTodoListsTC = () => (dispatch: ThunkDispatchType) => {
    dispatch(setStatusAC('loading'))
    todoListAPI.getTodoLists().then(res => {
        dispatch(setTodoListAC(res.data))
        dispatch(setStatusAC('succeeded'))
    })
}
export const createNewTodoListTC = (title: string) => (dispatch: ThunkDispatchType) => {
    dispatch(setStatusAC('loading'))
    todoListAPI.createTodoList(title).then(res => {
        dispatch(addTodoListAC(res.data.data.item))
        dispatch(setStatusAC('succeeded'))
    })
}
export const deleteTodoListTC = (id: string) => (dispatch: ThunkDispatchType) => {
    dispatch(setStatusAC('loading'))
    todoListAPI.deleteTodoList(id).then(res => {
        dispatch(removeTodoListAC(id))
        dispatch(setStatusAC('succeeded'))
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
type ThunkDispatchType = Dispatch<ActionType | SetStatusType>
export type FilterType = 'all' | 'active' | 'completed'
export type SetTodoListType = ReturnType<typeof setTodoListAC>
export type AddTodoListType = ReturnType<typeof addTodoListAC>
export type RemoveTodoListType = ReturnType<typeof removeTodoListAC>
type ChangeTitleTodoListType = ReturnType<typeof changeTitleTodoListAC>
type ChangeFilterTodoListType = ReturnType<typeof changeFilterTodoListAC>
export type TodoListDomainType = TodoListType & {filter: FilterType, entityStatus: StatusType}
