import {TasksType} from "../TodoList/TodoList";
import {v1} from "uuid";
import {addTaskAC, changeTaskStatus, changeTitleTaskAC, deleteTaskAC, taskReducer} from "./task-reducer";
import {addTodoListAC} from "./todolist-reducer";

const todoListId1 = v1();
const todoListId2 = v1();
const state: TasksType = {
    [todoListId1]: [
        {id: v1(), title: 'Html&Css', isDone: false},
        {id: v1(), title: 'JS', isDone: false},
        {id: v1(), title: 'React', isDone: false}
    ],
    [todoListId2]: [
        {id: v1(), title: 'Milk', isDone: false},
        {id: v1(), title: 'Bread', isDone: false}
    ]
}

test('Add task', () => {
    const title = 'New task title'
    const newState = taskReducer(state, addTaskAC(title, todoListId2))

    expect(newState[todoListId2][2].title).toBe(title)
    expect(newState[todoListId2][2].isDone).toBe(false)
    expect(newState[todoListId2][0].title).toBe('Milk')
    expect(newState[todoListId2][0].isDone).toBe(false)
    expect(newState[todoListId2].length).toBe(3)
})
test('Delete task', () => {
    const taskId = state[todoListId2][0].id
    const newState = taskReducer(state, deleteTaskAC(todoListId2, taskId))

    expect(newState[todoListId2][0].title).toBe('Bread')
    expect(newState[todoListId2][0].isDone).toBe(false)
    expect(newState[todoListId2].length).toBe(1)
})
test('Change task title', () => {
    const title = 'New title'
    const taskId = state[todoListId2][0].id
    const newState = taskReducer(state, changeTitleTaskAC(todoListId2, taskId, title))

    expect(newState[todoListId2][0].title).toBe(title)
    expect(newState[todoListId2][1].title).toBe('Bread')
    expect(newState[todoListId2][0].isDone).toBe(false)
    expect(newState[todoListId2].length).toBe(2)
})
test('Change task status', () => {
    const isDone = true
    const taskId = state[todoListId2][0].id
    const newState = taskReducer(state, changeTaskStatus(todoListId2, taskId, isDone))

    expect(newState[todoListId2][0].isDone).toBe(isDone)
    expect(newState[todoListId2][0].title).toBe('Milk')
    expect(newState[todoListId2][1].isDone).toBe(false)
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