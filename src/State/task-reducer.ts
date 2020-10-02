import {v1} from "uuid";
import {AddTodoListType, RemoveTodoListType, SetTodoListType} from "./todolist-reducer";
import {TaskPriority, TaskStatus, TaskType, todoListAPI} from "../api/todolist-api";
import {TasksType} from "../TodoList/TodoList";
import {Dispatch} from "redux";

type ActionType = AddTask
    | DeleteTask
    | ChangeTitleTask
    | ChangeTaskStatus
    | AddTodoListType
    | RemoveTodoListType
    | SetTodoListType
    | SetTasksActionType

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
    status: TaskStatus
}
type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todoListId: string
}

const initState: TasksType = {}

// Reducer
export const taskReducer = (state: TasksType = initState, action: ActionType): TasksType => {
    switch (action.type) {
        case "ADD-TASK": {
            const stateCopy = {...state}
            stateCopy[action.id] = [...stateCopy[action.id],
                {
                    id: v1(),
                    title: action.title,
                    status: TaskStatus.New,
                    order: 0,
                    description: '',
                    deadline: '',
                    addedDate: '',
                    startDate: '',
                    todoListId: action.id,
                    priority: TaskPriority.Low
                }]
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
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t)
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
        case "SET-TODOLIST": {
            const stateCopy = {...state}
            action.todoLists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "SET-TASKS": {
            const stateCopy = {...state}
            stateCopy[action.todoListId] = action.tasks
            return stateCopy
        }
        default:
            return state
    }
}

// Action Creator
export const addTaskAC = (title: string, id: string): AddTask => ({type: 'ADD-TASK', title, id})
export const deleteTaskAC = (todoListId: string, taskId: string): DeleteTask => {
    return {type: 'DELETE-TASK', todoListId, taskId}
}
export const changeTitleTaskAC = (todoListId: string, taskId: string, title: string): ChangeTitleTask => {
    return {type: 'CHANGE-TASK-TITLE', todoListId, taskId, title}
}
export const changeTaskStatus = (todoListId: string, taskId: string, status: TaskStatus): ChangeTaskStatus => {
    return {type: "CHANGE-TASK-STATUS", todoListId, taskId, status}
}
export const setTasks = (todoListId: string, tasks: Array<TaskType>): SetTasksActionType => {
    return {type: "SET-TASKS", todoListId, tasks}
}


// Thunk Creator
export const fetchTasksTC = (todoListId: string) => (dispatch: Dispatch) => {
    todoListAPI.getTasks(todoListId).then(res => dispatch(setTasks(todoListId, res.data.items)))
}