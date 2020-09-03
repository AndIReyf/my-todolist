import React, {ChangeEvent} from "react";
import './TodoList.scss';
import {FilterType} from "../App";
import {AddItemForm} from "./AddItemForm/AddItemForm";
import {MyButton} from "./Button/MyButton";
import {EditableTitle} from "./EditableTitle/EditableTitle";
import {Checkbox, IconButton} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {useDispatch, useSelector} from "react-redux";
import {RootReducerType} from "../Redux/store";
import {addTaskAC, changeTaskStatus, changeTitleTaskAC, deleteTaskAC} from "../State/task-reducer";
import {Task} from "./Task/Task";

export type TasksType = {
    [key: string]: Array<TaskType>
}
export type TaskType = {
    id: string
    isDone: boolean
    title: string
}
export type TodoListsType = {
    id: string
    title: string
    filter: FilterType
}
type PropsType = {
    id: string
    title: string
    filter: FilterType
    todoFilter: (value: FilterType, todoListId: string) => void
    deleteItem: (id: string) => void
    changeTodoListTitle: (title: string, id: string) => void
}

export const TodoList = React.memo( function TodoList(props: PropsType) {

    const taskErrorText: string = 'Task is required. Enter some task!!!';
    const taskTitleError: string = 'Task required';
    const todoListTitleError: string = 'Title required';

    const dispatch = useDispatch()
    const tasks = useSelector<RootReducerType, Array<TaskType>>(state => state.tasks[props.id])

    const setTaskFilterAll = React.useCallback(() => {
        props.todoFilter('all', props.id);
    }, [props.todoFilter, props.id])

    const setTaskFilterActive = React.useCallback(() => {
        props.todoFilter('active', props.id);
    }, [props.todoFilter,props.id])

    const setTaskFilterCompleted = React.useCallback(() => {
        props.todoFilter('completed', props.id);
    }, [props.todoFilter,props.id])

    const deleteTask = React.useCallback((id: string, todoListId: string) => {
        dispatch(deleteTaskAC(todoListId, id))
    }, [dispatch])

    const addNewTask = React.useCallback((title: string) => {
        dispatch(addTaskAC(title, props.id))
    }, [dispatch])

    const changeTodoListTitle = React.useCallback((title: string) => {
        props.changeTodoListTitle(title, props.id);
    },[props.changeTodoListTitle, props.id])

    const changeTodoListTitleOnKey = React.useCallback((title: string) => {
        props.changeTodoListTitle(title, props.id);
    }, [props.changeTodoListTitle, props.id])

    let allTodoListTasks = tasks
    let tasksForTodoList = allTodoListTasks;

    if (props.filter === 'active') {
        tasksForTodoList = allTodoListTasks.filter(t => !t.isDone);
    }
    if (props.filter === 'completed') {
        tasksForTodoList = allTodoListTasks.filter(t => t.isDone);
    }

    return (
        <div className={'TodoList'}>
            <div className={'todoListTitle'}>
                <EditableTitle
                    error={todoListTitleError}
                    onKeyPress={changeTodoListTitleOnKey}
                    onChange={changeTodoListTitle}
                    title={props.title}/>
                <IconButton onClick={() => props.deleteItem(props.id)}>
                    <DeleteIcon/>
                </IconButton>
            </div>
            <AddItemForm
                errorText={taskErrorText}
                addItem={(title) => addNewTask(title)}/>
            <ul className={'lists'}>
                {
                    tasksForTodoList.map(task => <Task
                        key={task.id}
                        todoListId={props.id}
                        deleteTask={deleteTask}
                        task={task}
                        taskTitleError={taskTitleError}/>)
                }
            </ul>
            <div className={'buttonBox'}>
                <MyButton
                    variant={props.filter === 'all' ? 'contained' : "text"}
                    color={'default'}
                    onClick={setTaskFilterAll}
                    title={'All'}/>
                <MyButton
                    variant={props.filter === 'active' ? 'contained' : 'text'}
                    color={'secondary'}
                    onClick={setTaskFilterActive}
                    title={'Active'}/>
                <MyButton
                    variant={props.filter === 'completed' ? 'contained' : 'text'}
                    color={"primary"}
                    onClick={setTaskFilterCompleted}
                    title={'Completed'}/>
            </div>
        </div>
    )
})