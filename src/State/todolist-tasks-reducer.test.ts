import {TasksType, TodoListsType} from "../TodoList/TodoList";
import {addTodoListAC, todolistReducer} from "./todolist-reducer";
import {taskReducer} from "./task-reducer";

test('Should be equal', () => {
    const startTasksState: TasksType = {}
    const startTodoListState: Array<TodoListsType> = []
    const action = addTodoListAC('Title')

    const newTasksState = taskReducer(startTasksState, action)
    const newTodoListState = todolistReducer(startTodoListState, action)

    const keys = Object.keys(newTasksState)
    const idFromTasks = keys[0]
    const idFromTodoList = newTodoListState[0].id

    expect(idFromTasks).toBe(action.todoListId)
    expect(idFromTodoList).toBe(action.todoListId)
})