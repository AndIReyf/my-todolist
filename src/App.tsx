import React from 'react';
import './App.css';
import { TodoList} from "./TodoList/TodoList";
import {AddItemForm} from "./TodoList/AddItemForm/AddItemForm";
import {Container, Grid, Paper} from "@material-ui/core";
import {Header} from "./Header/Header";
import {useDispatch, useSelector} from "react-redux";
import {
    changeFilterTodoListAC,createNewTodoListTC, deleteTodoListTC, fetchTodoListsTC,
    FilterType,
    TodoListDomainType, updateTodoListTitleTC
} from "./Redux/State/todolist-reducer";
import {RootReducerType} from "./Redux/store";
import {Preloader} from "./TodoList/Preloader/Preloader";
import {MySnackbar} from "./TodoList/Snackbar/Snackbar";
import {StatusType} from "./Redux/State/app-reducer";

export function App() {

    const todoListErrorText: string = 'Title is required. Enter the title!'
    const todoListTitle: string = 'Create List'

    const dispatch = useDispatch()
    const todoLists = useSelector<RootReducerType, Array<TodoListDomainType>>(state => state.todoLists)
    const status = useSelector<RootReducerType, StatusType>(state => state.app.status)

    React.useEffect(() => {
        dispatch(fetchTodoListsTC())
    }, [])

    const todoFilter = React.useCallback((filter: FilterType, todoListId: string) => {
        dispatch(changeFilterTodoListAC(filter, todoListId))
    }, [dispatch])

    const addTodoList = React.useCallback((title: string) => {
        dispatch(createNewTodoListTC(title))
    }, [dispatch])

    const deleteTodoList = React.useCallback((todoListId: string) => {
        dispatch(deleteTodoListTC(todoListId))
    }, [dispatch])

    const setNewTodoTitle = React.useCallback((title: string, id: string) => {
        dispatch(updateTodoListTitleTC(id, title))
    }, [dispatch])

    return (
        <div className="App">
            <Header/>
            {
                status === 'loading' && <Preloader/>
            }
            <MySnackbar/>
            <Container maxWidth={"lg"}>
                <Grid container>
                    <AddItemForm
                        errorText={todoListErrorText}
                        title={todoListTitle}
                        addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={2}>
                    {
                        todoLists.map(td => {
                            return <Grid item key={td.id}>
                                <Paper elevation={3}>
                                    <TodoList
                                        id={td.id}
                                        title={td.title}
                                        filter={td.filter}
                                        todoFilter={todoFilter}
                                        deleteItem={deleteTodoList}
                                        changeTodoListTitle={setNewTodoTitle}/>
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}