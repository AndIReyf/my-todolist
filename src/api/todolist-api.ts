import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '95a44df4-1e44-4034-980e-00368d0e9811'
    }
})

export const todoListAPI = {
    getTodoLists() {
        return instance.get<Array<TodoListType>>('todo-lists')
    },
    createTodoList(title: string) {
        return instance.post<ResponseType<CreateTodoListDataType>>('todo-lists', {title})
    },
    deleteTodoList(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodoListTitle(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    },
    getTasks(todolistId: string) {
        return instance.get<TasksPropertyType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, partToUpdate: UpdateTaskType) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, partToUpdate)
    }
}

// Types
export type TodoListType = {
    id: string
    addedDate: string
    order: number
    title: string
}

type CreateTodoListDataType = {
    item: TodoListType
}

export type ResponseType<T = {}> = {
    resultCode: number
    messages: Array<string>
    data: T
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatus
    priority: TaskPriority
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type UpdateTaskType = {
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    startDate: string
    deadline: string
}

type TasksPropertyType = {
    items: Array<TaskType>
    totalCount: number
    error: string | null
}

export enum TaskStatus {
    New,
    InProgress,
    Completed,
    Draft
}

export enum TaskPriority {
    Low,
    Middle,
    Hi,
    Urgently,
    Later
}