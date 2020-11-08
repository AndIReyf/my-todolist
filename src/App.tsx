import React from 'react';
import './App.css';
import {CircularProgress, Container, Grid} from "@material-ui/core";
import {Header} from "./components/Header/Header";
import {useDispatch, useSelector} from "react-redux";
import {RootReducerType} from "./Redux/store";
import {Preloader} from "./components/Preloader/Preloader";
import {MySnackbar} from "./components/Snackbar/Snackbar";
import {initializedApp, StatusType} from "./Redux/State/app-reducer";
import {TodoLists} from "./components/TodoLists/TodoLists";
import {Route} from 'react-router-dom';
import {Login} from "./components/Login/Login";

export function App() {

    const dispatch = useDispatch()
    const status = useSelector<RootReducerType, StatusType>(state => state.app.status)
    const isInitialized = useSelector<RootReducerType, boolean>(state => state.app.initialized)

    React.useEffect(() => {
        dispatch(initializedApp())
    }, [dispatch])

    if (!isInitialized) {
        return (
            <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                <CircularProgress/>
            </div>
        )
    }

    return (
        <div className="App">
            <Header/>
            {status === 'loading' && <Preloader/>}
            <MySnackbar/>
            <Container maxWidth={"lg"}>
                <Grid container spacing={2}>
                    <Route path={'/login'} render={() => <Login/>}/>
                    <Route exact path={'/'} render={() => <TodoLists/>}/>
                </Grid>
            </Container>
        </div>
    );
}