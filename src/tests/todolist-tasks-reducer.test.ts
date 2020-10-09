import {TasksType} from "../components/TodoList/TodoList";
import {addTodoListAC, setTodoListAC, TodoListDomainType, todolistReducer} from "../Redux/State/todolist-reducer";
import {taskReducer} from "../Redux/State/task-reducer";

test('Should be equal', () => {
    const startTasksState: TasksType = {}
    const startTodoListState: Array<TodoListDomainType> = []
    const action = addTodoListAC({title: 'title', order: 0, addedDate: '', id: 'ID'})

    const newTasksState = taskReducer(startTasksState, action)
    const newTodoListState = todolistReducer(startTodoListState, action)

    const keys = Object.keys(newTasksState)
    const idFromTasks = keys[0]
    const idFromTodoList = newTodoListState[0].id

    expect(idFromTasks).toBe(action.todoList.id)
    expect(idFromTodoList).toBe(action.todoList.id)
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