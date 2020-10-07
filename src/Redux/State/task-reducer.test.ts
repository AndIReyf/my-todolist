import {TasksType} from "../../TodoList/TodoList";
import {v1} from "uuid";
import {
    addTaskAC,
    changeTaskTitleAC,
    deleteTaskAC,
    setTasks,
    taskReducer,
    UpdateDomainTaskType,
    updateTaskAC
} from "./task-reducer";
import {addTodoListAC} from "./todolist-reducer";
import {TaskPriority, TaskStatus} from "../../api/todolist-api";

const todoListId1 = v1();
const todoListId2 = v1();
const state: TasksType = {
    [todoListId1]: [
        {
            id: v1(), title: 'Html&Css', status: TaskStatus.New, description: '', deadline: '', addedDate: '',
            startDate: '', priority: TaskPriority.Low, order: 0, todoListId: todoListId1
        },
        {
            id: v1(), title: 'JS', status: TaskStatus.New, description: '', deadline: '', addedDate: '',
            startDate: '', priority: TaskPriority.Low, order: 0, todoListId: todoListId1
        },
        {
            id: v1(), title: 'React', status: TaskStatus.New, description: '', deadline: '', addedDate: '',
            startDate: '', priority: TaskPriority.Low, order: 0, todoListId: todoListId1
        }
    ],
    [todoListId2]: [
        {
            id: v1(), title: 'Milk', status: TaskStatus.New, description: '', deadline: '', addedDate: '',
            startDate: '', priority: TaskPriority.Low, order: 0, todoListId: todoListId2
        },
        {
            id: v1(), title: 'Bread', status: TaskStatus.New, description: '', deadline: '', addedDate: '',
            startDate: '', priority: TaskPriority.Low, order: 0, todoListId: todoListId2
        }
    ]
}

test('Add task', () => {
    const action = addTaskAC({
        todoListId: todoListId2, id: 'ID', status: TaskStatus.New, priority: 0,
        startDate: '', addedDate: '', deadline: '', description: '', order: 0, title: 'Title'
    })
    const newState = taskReducer(state, action)

    expect(newState[todoListId2][0].title).toBe('Title')
    expect(newState[todoListId2][0].status).toEqual(TaskStatus.New)
    expect(newState[todoListId2][0].id).toBe('ID')
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
    const newState = taskReducer(state, changeTaskTitleAC(todoListId2, taskId, title))

    expect(newState[todoListId2][0].title).toBe(title)
    expect(newState[todoListId2][1].title).toBe('Bread')
    expect(newState[todoListId2][0].status).toBe(TaskStatus.New)
    expect(newState[todoListId2].length).toBe(2)
})
test('Change task status', () => {
    const model: UpdateDomainTaskType = {
        status: TaskStatus.Completed,
        deadline: '',
        description: '',
        priority: TaskPriority.Low,
        startDate: '',
        title: 'Title'
    }
    const taskId = state[todoListId2][0].id
    const newState = taskReducer(state, updateTaskAC(todoListId2, taskId, model))

    expect(newState[todoListId2][0].status).toBe(TaskStatus.Completed)
    expect(newState[todoListId2][0].title).toBe('Title')
    expect(newState[todoListId2][1].status).toBe(TaskStatus.New)
    expect(newState[todoListId2].length).toBe(2)
})
test('Add new property when new todo is added', () => {

    const action = addTodoListAC({id: 'ID', addedDate: '', order: 0, title: 'Title'})
    const newState = taskReducer(state, action)

    const keys = Object.keys(newState)
    const newKey = keys.find(k => k !== 'todoListId1' && k !== 'todoListId2')
    if (!newKey) {
        throw new Error('New key should be added...')
    }

    expect(keys.length).toBe(3)
})
test('Tasks should be add for todolist', () => {
    const action = setTasks(todoListId1, state[todoListId1])
    const newState = taskReducer({
        todoListId1: []
    }, action)

    expect(newState[todoListId1].length).toBe(3)
})