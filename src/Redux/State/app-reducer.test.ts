import {appReducer, InitialStateType, setErrorMessageAC, setStatusAC} from "./app-reducer";

let state: InitialStateType;

beforeEach(() => {
    state = {
        status: "idle",
        error: null
    }
})

test('Error message should appear', () => {
    const action = setErrorMessageAC('Error occurred')
    const newState = appReducer(state, action)

    expect(newState.error).toBe('Error occurred')
})
test('Correct status should be set', () => {
    const action = setStatusAC('loading')
    const newState = appReducer(state, action)

    expect(newState.status).toBe('loading')
})