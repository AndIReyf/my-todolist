import {TasksType} from "../TodoList/TodoList";
import {addTodoListAC, setTodoListAC, TodoListDomainType, todolistReducer} from "./todolist-reducer";
import {taskReducer} from "./task-reducer";

test('Should be equal', () => {
    const startTasksState: TasksType = {}
    const startTodoListState: Array<TodoListDomainType> = []
    const action = addTodoListAC('Title')

    const newTasksState = taskReducer(startTasksState, action)
    const newTodoListState = todolistReducer(startTodoListState, action)

    const keys = Object.keys(newTasksState)
    const idFromTasks = keys[0]
    const idFromTodoList = newTodoListState[0].id

    expect(idFromTasks).toBe(action.todoListId)
    expect(idFromTodoList).toBe(action.todoListId)
})
test('Empty array should be added when we set todolist', () => {
    const action = setTodoListAC([
        {id: '1', title: 'title 1', order: 0, addedDate: ''},
        {id: '2', title: 'title 2', order: 0, addedDate: ''}
    ])

    const newState = taskReducer({}, action)
    const keys = Object.keys(newState)

    expect(keys.length).toBe(2)
    expect(newState['1']).toStrictEqual([])
    expect(newState['2']).toStrictEqual([])
})