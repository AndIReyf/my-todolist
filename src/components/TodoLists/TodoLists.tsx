import React from "react";
import {Grid, Paper} from "@material-ui/core";
import {TodoList} from "../TodoList/TodoList";
import {useDispatch, useSelector} from "react-redux";
import {RootReducerType} from "../../Redux/store";
import {
    changeFilterTodoListAC, createNewTodoListTC,
    deleteTodoListTC, fetchTodoListsTC,
    FilterType,
    TodoListDomainType,
    updateTodoListTitleTC
} from "../../Redux/State/todolist-reducer";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import { Redirect } from "react-router-dom";

export function TodoLists() {

    const todoListErrorText: string = 'Title is required. Enter the title!'
    const todoListTitle: string = 'Create List'

    const dispatch = useDispatch()
    const todoLists = useSelector<RootReducerType, Array<TodoListDomainType>>(state => state.todoLists)
    const isSignIn = useSelector<RootReducerType, boolean>(state => state.auth.isSignIn)

    React.useEffect(() => {
        // If user is not sign in, app do not fetch todos.
        if (!isSignIn) return
        dispatch(fetchTodoListsTC())
    }, [])

    const deleteTodoList = React.useCallback((todoListId: string) => {
        dispatch(deleteTodoListTC(todoListId))
    }, [dispatch])

    const setNewTodoTitle = React.useCallback((title: string, id: string) => {
        dispatch(updateTodoListTitleTC(id, title))
    }, [dispatch])

    const todoFilter = React.useCallback((filter: FilterType, todoListId: string) => {
        dispatch(changeFilterTodoListAC(filter, todoListId))
    }, [dispatch])

    const addTodoList = React.useCallback((title: string) => {
        dispatch(createNewTodoListTC(title))
    }, [dispatch])

    if (!isSignIn) {
        return <Redirect to={'/login'}/>
    }

    return (
        <>
            <Grid container>
                <AddItemForm
                    errorText={todoListErrorText}
                    title={todoListTitle}
                    addItem={addTodoList}
                />
            </Grid>
            {
                todoLists.map(tl => {
                    return <Grid item key={tl.id}>
                        <Paper elevation={3}>
                            <TodoList
                                todoList={tl}
                                todoFilter={todoFilter}
                                deleteItem={deleteTodoList}
                                changeTodoListTitle={setNewTodoTitle}/>
                        </Paper>
                    </Grid>
                })
            }
        </>
    )
}