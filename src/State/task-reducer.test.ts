import {TasksType} from "../TodoList/TodoList";
import {v1} from "uuid";
import {addTaskAC, changeTaskStatus, changeTitleTaskAC, deleteTaskAC, taskReducer} from "./task-reducer";
import {addTodoListAC} from "./todolist-reducer";
import {TaskPriority, TaskStatus} from "../api/todolist-api";

const todoListId1 = v1();
const todoListId2 = v1();
const state: TasksType = {
    [todoListId1]: [
        {id: v1(), title: 'Html&Css', status: TaskStatus.New, description: '', deadline: '', addedDate: '',
            startDate: '', priority: TaskPriority.Low, order: 0, todoListId: todoListId1},
        {id: v1(), title: 'JS', status: TaskStatus.New, description: '', deadline: '', addedDate: '',
            startDate: '', priority: TaskPriority.Low, order: 0, todoListId: todoListId1},
        {id: v1(), title: 'React', status: TaskStatus.New, description: '', deadline: '', addedDate: '',
            startDate: '', priority: TaskPriority.Low, order: 0, todoListId: todoListId1}
    ],
    [todoListId2]: [
        {id: v1(), title: 'Milk', status: TaskStatus.New, description: '', deadline: '', addedDate: '',
            startDate: '', priority: TaskPriority.Low, order: 0, todoListId: todoListId2},
        {id: v1(), title: 'Bread', status: TaskStatus.New, description: '', deadline: '', addedDate: '',
            startDate: '', priority: TaskPriority.Low, order: 0, todoListId: todoListId2}
    ]
}

test('Add task', () => {
    const title = 'New task title'
    const newState = taskReducer(state, addTaskAC(title, todoListId2))

    expect(newState[todoListId2][2].title).toBe(title)
    expect(newState[todoListId2][2].status).toEqual(TaskStatus.New)
    expect(newState[todoListId2][0].title).toBe('Milk')
    expect(newState[todoListId2][0].status).toBe(TaskStatus.New)
    expect(newState[todoListId2].length).toBe(3)
})
test('Delete task', () => {
    const taskId = state[todoListId2][0].id
    const newState = taskReducer(state, deleteTaskAC(todoListId2, taskId))

    expect(newState[todoListId2][0].title).toBe('Bread')
    expect(newState[todoListId2][0].status).toBe(TaskStatus.New)
    expect(newState[todoListId2].length).toBe(1)
})
test('Change task title', () => {
    const title = 'New title'
    const taskId = state[todoListId2][0].id
    const newState = taskReducer(state, changeTitleTaskAC(todoListId2, taskId, title))

    expect(newState[todoListId2][0].title).toBe(title)
    expect(newState[todoListId2][1].title).toBe('Bread')
    expect(newState[todoListId2][0].status).toBe(TaskStatus.New)
    expect(newState[todoListId2].length).toBe(2)
})
test('Change task status', () => {
    const status = TaskStatus.Completed
    const taskId = state[todoListId2][0].id
    const newState = taskReducer(state, changeTaskStatus(todoListId2, taskId, status))

    expect(newState[todoListId2][0].status).toBe(status)
    expect(newState[todoListId2][0].title).toBe('Milk')
    expect(newState[todoListId2][1].status).toBe(TaskStatus.New)
    expect(newState[todoListId2].length).toBe(2)
})
test('Add new property when new todo is added', () => {
    const title = 'New Todo'
    const action = addTodoListAC(title)
    const newState = taskReducer(state, action)

    const keys = Object.keys(newState)
    const newKey = keys.find(k => k !== 'todoListId1' && k !== 'todoListId2')
    if (!newKey) {
        throw new Error('New key should be added...')
    }

    expect(keys.length).toBe(3)
})