import React, {ChangeEvent} from "react";
import {updateTask} from "../../Redux/State/task-reducer";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableTitle} from "../EditableTitle/EditableTitle";
import DeleteIcon from "@material-ui/icons/Delete";
import {useDispatch} from "react-redux";
import {TaskStatus, TaskType} from "../../api/todolist-api";

export const Task = React.memo(function Task(props: PropsType) {

    const dispatch = useDispatch()

    const changeTaskStatus = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
        dispatch(updateTask({todoListId: props.todoListId, taskId: props.task.id, domainModel: {status}}))
    }, [dispatch, props.todoListId, props.task.id])

    const changeTaskTitle = React.useCallback((title: string) => {
        dispatch(updateTask({todoListId: props.todoListId, taskId: props.task.id, domainModel: {title}}))
    }, [dispatch, props.todoListId, props.task.id])

    const onKeyChangeTaskTitle = React.useCallback((title: string) => {
        dispatch(updateTask({todoListId: props.todoListId, taskId: props.task.id, domainModel: {title}}))
    }, [dispatch, props.todoListId, props.task.id])

    return <li className={props.task.status === TaskStatus.Completed ? 'done' : ''}>
        <Checkbox
            color="primary"
            id={props.task.id}
            checked={props.task.status === TaskStatus.Completed}
            onChange={changeTaskStatus}/>
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

type PropsType = {
    taskTitleError: string
    todoListId: string
    task: TaskType
    deleteTask: (taskId: string, todoListId: string) => void
}