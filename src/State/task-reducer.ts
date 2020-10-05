import {AddTodoListType, RemoveTodoListType, SetTodoListType} from "./todolist-reducer";
import {TaskPriority, TaskStatus, TaskType, todoListAPI, UpdateTaskType} from "../api/todolist-api";
import {TasksType} from "../TodoList/TodoList";
import {Dispatch} from "redux";
import {RootReducerType} from "../Redux/store";

type ActionType = AddTaskType
    | DeleteTaskType
    | ChangeTitleTaskType
    | UpdateTaskActionType
    | AddTodoListType
    | RemoveTodoListType
    | SetTodoListType
    | SetTasksActionType

type AddTaskType = {
    type: 'ADD-TASK'
    task: TaskType
}
type DeleteTaskType = {
    type: 'DELETE-TASK'
    todoListId: string
    taskId: string
}
type ChangeTitleTaskType = {
    type: 'CHANGE-TASK-TITLE'
    todoListId: string
    taskId: string
    title: string
}
type UpdateTaskActionType = {
    type: 'UPDATE-TASK'
    todoListId: string
    taskId: string
    model: UpdateDomainTaskType
}
type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todoListId: string
}
export type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    startDate?: string
    deadline?: string
}

const initState: TasksType = {}

// Reducer
export const taskReducer = (state: TasksType = initState, action: ActionType): TasksType => {
    switch (action.type) {
        case "ADD-TASK": {
            const stateCopy = {...state}
            const newTask = action.task
            const tasks = stateCopy[newTask.todoListId]
            stateCopy[newTask.todoListId] = [newTask, ...tasks]
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
        case "UPDATE-TASK": {
            const stateCopy = {...state}
            stateCopy[action.todoListId] = stateCopy[action.todoListId]
                .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            return stateCopy
        }
        case "ADD-TODOLIST": {
            return {...state, [action.todoList.id]: []}
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
export const addTaskAC = (task: TaskType): AddTaskType => ({type: 'ADD-TASK', task})
export const deleteTaskAC = (todoListId: string, taskId: string): DeleteTaskType => {
    return {type: 'DELETE-TASK', todoListId, taskId}
}
export const changeTaskTitleAC = (todoListId: string, taskId: string, title: string): ChangeTitleTaskType => {
    return {type: 'CHANGE-TASK-TITLE', todoListId, taskId, title}
}
export const updateTaskAC = (todoListId: string, taskId: string, model: UpdateDomainTaskType): UpdateTaskActionType => {
    return {type: "UPDATE-TASK", todoListId, taskId, model}
}
export const setTasks = (todoListId: string, tasks: Array<TaskType>): SetTasksActionType => {
    return {type: "SET-TASKS", todoListId, tasks}
}

// Thunk Creator
export const fetchTasksTC = (todoListId: string) => (dispatch: Dispatch) => {
    todoListAPI.getTasks(todoListId)
        .then(res => dispatch(setTasks(todoListId, res.data.items)))
}
export const addTaskTC = (todosId: string, title: string) => (dispatch: Dispatch) => {
    todoListAPI.createTask(todosId, title)
        .then(res => dispatch(addTaskAC(res.data.data.item)))
}
export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    todoListAPI.deleteTask(todoId, taskId)
        .then(res => dispatch(deleteTaskAC(todoId, taskId)))
}
export const updateTaskTC = (todoId: string, taskId: string, domainModel: UpdateDomainTaskType) =>
    (dispatch: Dispatch, getState: () => RootReducerType) => {

        const state = getState()
        const task = state.tasks[todoId].find(t => t.id === taskId)

        // If task will be undefined
        if (!task) {
            console.warn('Task not found in the state!')
            return
        }

        const apiModel: UpdateTaskType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
            title: task.title,
            ...domainModel
        }

        todoListAPI.updateTask(todoId, taskId, apiModel)
            .then(res => dispatch(updateTaskAC(todoId, taskId, domainModel)))
    }