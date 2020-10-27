import {TaskPriority, TaskStatus, TaskType, todoListAPI, UpdateTaskType} from "../../api/todolist-api";
import {TasksType} from "../../components/TodoList/TodoList";
import {Dispatch} from "redux";
import {RootReducerType} from "../store";
import {setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/handle-error";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodoListAC, removeTodoListAC, setTodoListAC} from "./todolist-reducer";

const initState: TasksType = {}

// Reducer
const slice = createSlice({
    name: 'tasks',
    initialState: initState,
    reducers: {
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        deleteTaskAC(state, action: PayloadAction<{ todoListId: string, taskId: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)
        },
        setTasks(state, action: PayloadAction<{ todoListId: string, tasks: Array<TaskType> }>) {
            state[action.payload.todoListId] = action.payload.tasks
        },
        changeTaskTitleAC(state, action: PayloadAction<{ todoListId: string, taskId: string, title: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks[index] = {...tasks[index], title: action.payload.title.trim()}
        },
        updateTaskAC(state, action: PayloadAction<{ todoListId: string, taskId: string, model: UpdateDomainTaskType }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.model}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodoListAC, (state, action) => {
            state[action.payload.todoList.id] = []
        });
        builder.addCase(removeTodoListAC, (state, action) => {
            delete state[action.payload.id]
        });
        builder.addCase(setTodoListAC, (state, action) => {
            action.payload.todoLists.forEach(tl  => state[tl.id] = [])
        })
        // [addTodoListAC.type]: (state, action: PayloadAction<{}>) => {}
    }
})

export const taskReducer = slice.reducer
export const {addTaskAC, changeTaskTitleAC, deleteTaskAC, setTasks, updateTaskAC} = slice.actions

// Thunk Creator
export const fetchTasksTC = (todoListId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListAPI.getTasks(todoListId)
        .then(res => {
            dispatch(setTasks({todoListId, tasks: res.data.items}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
export const addTaskTC = (todosId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListAPI.createTask(todosId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
export const deleteTaskTC = (todoListId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoListAPI.deleteTask(todoListId, taskId)
        .then(() => {
            dispatch(deleteTaskAC({todoListId, taskId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
export const updateTaskTC = (todoListId: string, taskId: string, domainModel: UpdateDomainTaskType) =>
    (dispatch: Dispatch, getState: () => RootReducerType) => {

        const state = getState()
        const task = state.tasks[todoListId].find(t => t.id === taskId)

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
        todoListAPI.updateTask(todoListId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC({todoListId, taskId, model: domainModel}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(error => handleServerNetworkError(error, dispatch))
    }

// Types
export type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    startDate?: string
    deadline?: string
}
