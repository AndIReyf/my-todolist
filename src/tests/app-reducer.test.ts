import {appReducer, InitialStateType, setAppErrorMessageAC, setAppStatusAC} from "../Redux/State/app-reducer";

let state: InitialStateType;

beforeEach(() => {
    state = {
        status: "idle",
        error: null
    }
})

test('Error message should appear', () => {
    const action = setAppErrorMessageAC('Error occurred')
    const newState = appReducer(state, action)

    expect(newState.error).toBe('Error occurred')
})
test('Correct status should be set', () => {
    const action = setAppStatusAC('loading')
    const newState = appReducer(state, action)

    expect(newState.status).toBe('loading')
})