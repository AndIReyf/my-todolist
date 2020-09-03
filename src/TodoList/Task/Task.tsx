import React, {ChangeEvent} from "react";
import {changeTaskStatus, changeTitleTaskAC} from "../../State/task-reducer";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableTitle} from "../EditableTitle/EditableTitle";
import DeleteIcon from "@material-ui/icons/Delete";
import {useDispatch} from "react-redux";
import {TaskType} from "../TodoList";

type PropsType = {
    taskTitleError: string
    todoListId: string
    task: TaskType
    deleteTask: (taskId: string, todoListId: string) => void
}

export const Task = React.memo(function Task(props: PropsType) {

    const dispatch = useDispatch();
    const taskStatusChange = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatus(props.todoListId, props.task.id, e.currentTarget.checked))
    }, [dispatch])
    const changeTaskTitle = React.useCallback((title: string) => {
        dispatch(changeTitleTaskAC(props.todoListId, props.task.id, title))
    }, [dispatch])
    const onKeyChangeTaskTitle = React.useCallback((title: string) => {
        dispatch(changeTitleTaskAC(props.todoListId, props.task.id, title))
    }, [dispatch])

    return <li className={props.task.isDone ? 'done' : ''}>
        <Checkbox
            color="primary"
            id={props.task.id}
            checked={props.task.isDone}
            onChange={taskStatusChange}/>
        <EditableTitle
            error={props.taskTitleError}
            onKeyPress={onKeyChangeTaskTitle}
            onChange={changeTaskTitle}
            title={props.task.title}/>
        <IconButton onClick={() => props.deleteTask(props.task.id, props.todoListId)}>
            <DeleteIcon/>
        </IconButton>
    </li>
})