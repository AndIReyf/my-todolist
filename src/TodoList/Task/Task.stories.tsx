import React from "react";
import {Task} from "./Task";
import {action} from "@storybook/addon-actions";
import {ReduxStoreProviderDecorator} from "../../stories/ReduxStoreProviderDecorator";
import {TaskPriority, TaskStatus} from "../../api/todolist-api";

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
                  task={{id: '1', todoListId: '1',status: TaskStatus.New, title: 'React', order: 0,
                      description: '',
                      deadline: '',
                      addedDate: '',
                      startDate: '',
                      priority: TaskPriority.Low}}/>
            <Task taskTitleError={'Error'} deleteTask={del}
                  todoListId={'id2'}
                  task={{id: '2', todoListId: '2', status: TaskStatus.Completed, title: 'Redux',order: 0,
                      description: '',
                      deadline: '',
                      addedDate: '',
                      startDate: '',
                      priority: TaskPriority.Low}}/>
        </>
    )
}