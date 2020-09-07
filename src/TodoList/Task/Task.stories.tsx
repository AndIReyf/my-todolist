import React from "react";
import {Task} from "./Task";
import {action} from "@storybook/addon-actions";
import {Provider} from "react-redux";
import {store} from "../../Redux/store";
import {ReduxStoreProviderDecorator} from "../../stories/ReduxStoreProviderDecorator";

export default {
    title: 'Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
}

const del = action('Task was deleted')

export const TaskExample = () => {
    return (
        <>
            <Task taskTitleError={'Error'} deleteTask={del}
                  todoListId={'id1'}
                  task={{id: '1', isDone: true, title: 'React'}}/>
            <Task taskTitleError={'Error'} deleteTask={del}
                  todoListId={'id2'}
                  task={{id: '2', isDone: false, title: 'Redux'}}/>
        </>
    )
}