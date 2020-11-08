import {TasksType} from "../components/TodoList/TodoList";
import {v1} from "uuid";
import {
    addTask, changeTaskTitleAC, deleteTask,
    fetchTasks, taskReducer, UpdateDomainTaskType, updateTask
} from "../Redux/State/task-reducer";
import {addTodoListAC} from "../Redux/State/todolist-reducer";
import {TaskPriority, TaskStatus, TaskType} from "../api/todolist-api";

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

describe('Task-reducer tests', () => {

    test('Add task', () => {
        const task: TaskType = {
            todoListId: todoListId2, id: 'ID', status: TaskStatus.New, priority: 0,
            startDate: '', addedDate: '', deadline: '', description: '', order: 0, title: 'Title'
        }
        const action = addTask.fulfilled(task, 'requiredId', {todosId: todoListId2, title: 'Title'})
        const newState = taskReducer(state, action)

        expect(newState[todoListId2][0].title).toBe('Title')
        expect(newState[todoListId2][0].status).toEqual(TaskStatus.New)
        expect(newState[todoListId2][0].id).toBe('ID')
        expect(newState[todoListId2].length).toBe(3)
    })
    test('Delete task', () => {
        const taskId = state[todoListId2][0].id
        const task = {todoListId: todoListId2, taskId: taskId}
        const action = deleteTask.fulfilled(task, 'requestId', {todoListId: todoListId2, taskId})
        const newState = taskReducer(state, action)

        expect(newState[todoListId2][0].title).toBe('Bread')
        expect(newState[todoListId2][0].status).toBe(TaskStatus.New)
        expect(newState[todoListId2].length).toBe(1)
    })
    test('Change task title', () => {
        const title = 'New title'
        const taskId = state[todoListId2][0].id
        const newState = taskReducer(state, changeTaskTitleAC({todoListId: todoListId2, taskId, title}))

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
        const updateModel = {domainModel: model, todoListId: todoListId2, taskId}
        const action = updateTask.fulfilled(updateModel,'requiredId', updateModel)

        const newState = taskReducer(state, action)

        expect(newState[todoListId2][0].status).toBe(TaskStatus.Completed)
        expect(newState[todoListId2][0].title).toBe('Title')
        expect(newState[todoListId2][1].status).toBe(TaskStatus.New)
        expect(newState[todoListId2].length).toBe(2)
    })
    test('Add a new property when a new todo is added', () => {
        const todoList = {id: 'ID', addedDate: '', order: 0, title: 'Title'}
        const action = addTodoListAC({todoList})
        const newState = taskReducer(state, action)

        const keys = Object.keys(newState)
        const newKey = keys.find(k => k !== 'todoListId1' && k !== 'todoListId2')
        if (!newKey) {
            throw new Error('New key should be added...')
        }

        expect(keys.length).toBe(3)
    })
    test('Tasks should be added for the todolist', () => {
        const tasks = {tasks: state[todoListId1], todoListId: todoListId1}
        const action = fetchTasks.fulfilled(tasks, 'requestId', todoListId1)
        const newState = taskReducer({
            todoListId1: []
        }, action)

        expect(newState[todoListId1].length).toBe(3)
    })
})
