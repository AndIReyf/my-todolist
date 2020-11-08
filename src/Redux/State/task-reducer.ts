import {TaskPriority, TaskStatus, todoListAPI, UpdateTaskType} from "../../api/todolist-api";
import {TasksType} from "../../components/TodoList/TodoList";
import {RootReducerType} from "../store";
import {setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/handle-error";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodoListAC, removeTodoListAC, setTodoListAC} from "./todolist-reducer";

export const fetchTasks = createAsyncThunk('tasks/fetchTasks',
    async (todoListId: string, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

        try {
            const res = await todoListAPI.getTasks(todoListId)

            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todoListId, tasks: res.data.items}
        } catch (error) {
            handleServerNetworkError(error, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    }
)
export const addTask = createAsyncThunk('tasks/addTask',
    async (arg: { todosId: string, title: string }, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

        try {
            const res = await todoListAPI.createTask(arg.todosId, arg.title)

            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return res.data.data.item
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(error, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    }
)
export const deleteTask = createAsyncThunk('tasks/deleteTask',
    async (arg: { todoListId: string, taskId: string }, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        try {
            await todoListAPI.deleteTask(arg.todoListId, arg.taskId)

            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todoListId: arg.todoListId, taskId: arg.taskId}
        } catch (error) {
            handleServerNetworkError(error, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    }
)
export const updateTask = createAsyncThunk('tasks/updateTask',
    async (arg: UpdateTaskPayloadType, thunkAPI) => {

        const state = thunkAPI.getState() as RootReducerType
        const task = state.tasks[arg.todoListId].find(t => t.id === arg.taskId)

        // If task will be undefined
        if (!task) return thunkAPI.rejectWithValue('Task not found in the state!')

        const apiModel: UpdateTaskType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
            title: task.title,
            ...arg.domainModel
        }

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

        const res = await todoListAPI.updateTask(arg.todoListId, arg.taskId, apiModel)

        try {
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return arg
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue(null)
            }
        } catch (error) {
            handleServerNetworkError(error, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    }
)

// Example of normal thunk without toolkit
// *****************************************************************************
// const _fetchTasks = (todoListId: string) => async (dispatch: Dispatch) => {
//
//     dispatch(setAppStatusAC({status: 'loading'}))
//
//     try {
//         const res = await todoListAPI.getTasks(todoListId)
//         dispatch(setTasks({todoListId, tasks: res.data.items}))
//         dispatch(setAppStatusAC({status: 'succeeded'}))
//     } catch (error) {
//         handleServerNetworkError(error, dispatch)
//     }
// }
// *****************************************************************************

// Reducer
const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksType,
    reducers: {
        changeTaskTitleAC(state, action: PayloadAction<{ todoListId: string, taskId: string, title: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks[index] = {...tasks[index], title: action.payload.title.trim()}
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTodoListAC, (state, action) => {
                state[action.payload.todoList.id] = []
            })
            .addCase(removeTodoListAC, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(setTodoListAC, (state, action) => {
                action.payload.todoLists.forEach(tl => state[tl.id] = [])
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todoListId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift(action.payload)
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.domainModel}
            })
            // [changeTaskTitleAC.type]: (state, action: PayloadAction<{}>) => {}
    }
})

export const taskReducer = slice.reducer
export const {changeTaskTitleAC} = slice.actions

// Types
type UpdateTaskPayloadType = {
    todoListId: string
    taskId: string
    domainModel: UpdateDomainTaskType
}
export type UpdateDomainTaskType = {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    startDate?: string
    deadline?: string
}
