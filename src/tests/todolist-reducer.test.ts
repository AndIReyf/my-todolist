import {
    addTodoListAC,
    changeFilterTodoListAC,
    changeTitleTodoListAC, changeTodoListEntityStatusAC, FilterType,
    removeTodoListAC, setTodoListAC, TodoListDomainType,
    todolistReducer
} from "../Redux/State/todolist-reducer";
import {v1} from "uuid";

const todoListId1 = v1();
const todoListId2 = v1();
const state: Array<TodoListDomainType> = [
    {id: todoListId1, title: 'What to learn', filter: 'all', order: 0, addedDate: '', entityStatus: "idle"},
    {id: todoListId2, title: 'What to Buy', filter: 'all', order: 0, addedDate: '', entityStatus: "idle"}
]
describe('Tests for todolist-reducer', () => {
    test('Change todolist status', () => {
        const action = changeTodoListEntityStatusAC(todoListId1, 'loading')
        const newState = todolistReducer(state, action)

        expect(newState[0].entityStatus).toBe('loading')
        expect(newState[1].entityStatus).toBe('idle')
        expect(newState.length).toBe(2)
    })
    test('Add todolist', () => {
        const title = 'new todolist title'
        const newState = todolistReducer(state, addTodoListAC({id: 'ID', addedDate: '', order: 0, title}))

        expect(newState[0].title).toBe(title)
        expect(newState[0].filter).toBe('all')
        expect(newState.length).toBe(3)
    })
    test('Remove todolist', () => {

        const newState = todolistReducer(state, removeTodoListAC(todoListId2))
        expect(newState[0].title).toBe('What to learn')
        expect(newState[0].filter).toBe('all')
        expect(newState.length).toBe(1)
    })
    test('Change todolist title', () => {
        const title = 'New Title'
        const newState = todolistReducer(state, changeTitleTodoListAC(title, todoListId2))

        expect(newState[1].title).toBe(title)
        expect(newState[0].title).not.toBe(title)
        expect(newState[1].filter).toBe('all')
        expect(newState.length).toBe(2)
    })
    test('Change todolist filter', () => {
        const filter: FilterType = 'active'
        const newState = todolistReducer(state, changeFilterTodoListAC(filter, todoListId2))

        expect(newState[0].filter).toBe('all')
        expect(newState[1].filter).toBe(filter)
        expect(newState.length).toBe(2)
    })
    test('Set Todos', () => {
        const newState = todolistReducer([], setTodoListAC(state))

        expect(newState.length).toBe(2)
    })
})
