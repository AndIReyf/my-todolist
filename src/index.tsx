import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from "react-redux";
import {store} from "./Redux/store";
import {App} from "./App";
import {HashRouter as Router} from "react-router-dom";

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>
    , document.getElementById('root'));
