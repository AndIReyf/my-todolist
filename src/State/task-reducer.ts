import {TasksType} from "../TodoList/TodoList";
import {v1} from "uuid";
import {AddTodoListType, RemoveTodoListType} from "./todolist-reducer";

type ActionType = AddTask | DeleteTask | ChangeTitleTask | ChangeTaskStatus | AddTodoListType | RemoveTodoListType
type AddTask = {
    type: 'ADD-TASK'
    title: string
    id: string
}
type DeleteTask = {
    type: 'DELETE-TASK'
    todoListId: string
    taskId: string
}
type ChangeTitleTask = {
    type: 'CHANGE-TASK-TITLE'
    todoListId: string
    taskId: string
    title: string
}
type ChangeTaskStatus = {
    type: 'CHANGE-TASK-STATUS'
    todoListId: string
    taskId: string
    isDone: boolean
}

const initState: TasksType = {}

export const taskReducer = (state: TasksType = initState, action: ActionType): TasksType => {
    switch (action.type) {
        case "ADD-TASK": {
            const stateCopy = {...state}
            stateCopy[action.id] = [...stateCopy[action.id], {id: v1(), title: action.title, isDone: false}];
            return stateCopy
        }
        case "DELETE-TASK": {
            const stateCopy = {...state}
            stateCopy[action.todoListId] = state[action.todoListId].filter(t => t.id !== action.taskId)
            return stateCopy
        }
        case "CHANGE-TASK-TITLE": {
            const stateCopy = {...state}
            stateCopy[action.todoListId] = stateCopy[action.todoListId]
                .map(t => t.id === action.taskId ? {...t, title: action.title.trim()} : t)
            return stateCopy
        }
        case "CHANGE-TASK-STATUS": {
            const stateCopy = {...state}
            stateCopy[action.todoListId] = stateCopy[action.todoListId]
                .map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : t)
            return stateCopy
        }
        case "ADD-TODOLIST": {
            const stateCopy = {...state}
            stateCopy[action.todoListId] = []
            return stateCopy
        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        default: return state
    }
}
export const addTaskAC = (title: string, id: string): AddTask => ({type: 'ADD-TASK', title, id})
export const deleteTaskAC = (todoListId: string, taskId: string): DeleteTask => {
    return {type: 'DELETE-TASK', todoListId, taskId}
}
export const changeTitleTaskAC = (todoListId: string, taskId: string, title: string): ChangeTitleTask => {
    return {type: 'CHANGE-TASK-TITLE', todoListId, taskId, title}
}
export const changeTaskStatus = (todoListId: string, taskId: string, isDone: boolean): ChangeTaskStatus => {
    return {type: "CHANGE-TASK-STATUS", todoListId, taskId, isDone}
}