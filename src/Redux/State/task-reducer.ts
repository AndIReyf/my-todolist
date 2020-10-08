import {AddTodoListType, RemoveTodoListType, SetTodoListType} from "./todolist-reducer";
import {TaskPriority, TaskStatus, TaskType, todoListAPI, UpdateTaskType} from "../../api/todolist-api";
import {TasksType} from "../../TodoList/TodoList";
import {Dispatch} from "redux";
import {RootReducerType} from "../store";
import {setAppErrorMessageAC, SetErrorMessageType, setAppStatusAC, SetStatusType} from "./app-reducer";

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
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const deleteTaskAC = (todoListId: string, taskId: string) => ({type: 'DELETE-TASK', todoListId, taskId} as const)
export const changeTaskTitleAC = (todoListId: string, taskId: string, title: string) => (
    {type: 'CHANGE-TASK-TITLE', todoListId, taskId, title} as const)
export const updateTaskAC = (todoListId: string, taskId: string, model: UpdateDomainTaskType) => (
    {type: "UPDATE-TASK", todoListId, taskId, model} as const)
export const setTasks = (todoListId: string, tasks: Array<TaskType>) => (
    {type: "SET-TASKS", todoListId, tasks} as const)

// Thunk Creator
export const fetchTasksTC = (todoListId: string) => (dispatch: ThunkDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    todoListAPI.getTasks(todoListId)
        .then(res => {
            dispatch(setTasks(todoListId, res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const addTaskTC = (todosId: string, title: string) => (dispatch: ThunkDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    todoListAPI.createTask(todosId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (res.data.messages.length) {
                    dispatch(setAppErrorMessageAC(res.data.messages[0]))
                } else {
                    // If message error is not got from server
                    dispatch(setAppErrorMessageAC('Some error occurred'))
                }
                dispatch(setAppStatusAC('failed'))
            }
        })
}
export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: ThunkDispatchType) => {
    todoListAPI.deleteTask(todoId, taskId)
        .then(res => dispatch(deleteTaskAC(todoId, taskId)))
}
export const updateTaskTC = (todoId: string, taskId: string, domainModel: UpdateDomainTaskType) =>
    (dispatch: ThunkDispatchType, getState: () => RootReducerType) => {

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

// Types
type ActionType = AddTaskType
    | DeleteTaskType
    | ChangeTaskTitleType
    | UpdateTaskActionType
    | AddTodoListType
    | RemoveTodoListType
    | SetTodoListType
    | SetTasksActionType

type AddTaskType = ReturnType<typeof addTaskAC>
type DeleteTaskType = ReturnType<typeof deleteTaskAC>
type ChangeTaskTitleType = ReturnType<typeof changeTaskTitleAC>
type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
type SetTasksActionType = ReturnType<typeof setTasks>

type ThunkDispatchType = Dispatch<ActionType | SetStatusType | SetErrorMessageType>

export type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    startDate?: string
    deadline?: string
}
