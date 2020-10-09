import React from "react";
import './Hider.scss'
import {AppBar, Button, IconButton, Toolbar} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootReducerType} from "../../Redux/store";
import {logoutTC} from "../../Redux/State/login-reducer";

export function Header() {

    const dispatch = useDispatch()
    const isSignIn = useSelector<RootReducerType, boolean>(state => state.auth.isSignIn)

    const logoutHandler = React.useCallback(() => {
        dispatch(logoutTC())
    }, [isSignIn])

    return (
        <header>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <div className={'btn-box'}>
                        {isSignIn && <Button onClick={logoutHandler} color="inherit">Logout</Button>}
                    </div>
                </Toolbar>
            </AppBar>
        </header>
    )
}