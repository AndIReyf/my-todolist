import React, {ChangeEvent} from "react";
import {updateTaskTC} from "../../State/task-reducer";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableTitle} from "../EditableTitle/EditableTitle";
import DeleteIcon from "@material-ui/icons/Delete";
import {useDispatch} from "react-redux";
import {TaskStatus, TaskType} from "../../api/todolist-api";

type PropsType = {
    taskTitleError: string
    todoListId: string
    task: TaskType
    deleteTask: (taskId: string, todoListId: string) => void
}

export const Task = React.memo(function Task(props: PropsType) {

    const dispatch = useDispatch();

    const changeTaskStatus = React.useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateTaskTC(props.todoListId, props.task.id,
            {status : e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New}))
    }, [dispatch])

    const changeTaskTitle = React.useCallback((title: string) => {
        dispatch(updateTaskTC(props.todoListId, props.task.id, {title}))
    }, [dispatch])

    const onKeyChangeTaskTitle = React.useCallback((title: string) => {
        dispatch(updateTaskTC(props.todoListId, props.task.id, {title}))
    }, [dispatch])

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