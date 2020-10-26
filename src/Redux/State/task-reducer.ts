import {AddTodoListType, RemoveTodoListType, SetTodoListType} from "./todolist-reducer";
import {TaskPriority, TaskStatus, TaskType, todoListAPI, UpdateTaskType} from "../../api/todolist-api";
import {TasksType} from "../../components/TodoList/TodoList";
import {Dispatch} from "redux";
import {RootReducerType} from "../store";
import {setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/handle-error";

const initState: TasksType = {}

// Reducer
export const taskReducer = (state: TasksType = initState, action: ActionType): TasksType => {
    switch (action.type) {
        case "ADD-TASK": {
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        }
        case "DELETE-TASK": {
            return {
                ...state,
                [action.todoListId]: [...state[action.todoListId].filter(t => t.id !== action.taskId)]
            }
        }
        case "CHANGE-TASK-TITLE": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.taskId ? {...t, title: action.title.trim()} : t)
            }
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
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
            return {...state, [action.todoListId]: action.tasks}
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
export const fetchTasksTC = (todoListId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListAPI.getTasks(todoListId)
        .then(res => {
            dispatch(setTasks(todoListId, res.data.items))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
export const addTaskTC = (todosId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListAPI.createTask(todosId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListAPI.deleteTask(todoId, taskId)
        .then(() => {
            dispatch(deleteTaskAC(todoId, taskId))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
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
        dispatch(setAppStatusAC({status: 'loading'}))
        todoListAPI.updateTask(todoId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(todoId, taskId, domainModel))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(error => handleServerNetworkError(error, dispatch))
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

export type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    startDate?: string
    deadline?: string
}
