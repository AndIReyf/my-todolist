import React from "react";
import './TodoList.scss';
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {MyButton} from "../Button/MyButton";
import {EditableTitle} from "../EditableTitle/EditableTitle";
import {IconButton} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {useDispatch, useSelector} from "react-redux";
import {RootReducerType} from "../../Redux/store";
import {addTask, deleteTask, fetchTasks} from "../../Redux/State/task-reducer";
import {Task} from "../Task/Task";
import {TaskStatus, TaskType} from "../../api/todolist-api";
import {FilterType, TodoListDomainType} from "../../Redux/State/todolist-reducer";

export const TodoList = React.memo(function TodoList(props: PropsType) {

    const taskErrorText: string = 'Task is required. Enter the task!';
    const taskTitleError: string = 'Task required';
    const todoListTitleError: string = 'Title required';

    const dispatch = useDispatch()
    const tasks = useSelector<RootReducerType, Array<TaskType>>(state => state.tasks[props.todoList.id])

    React.useEffect(() => {
        dispatch(fetchTasks(props.todoList.id))
    }, [dispatch, props.todoList.id])

    const setTaskFilterAll = React.useCallback(() => {
        props.todoFilter('all', props.todoList.id);
    }, [props])

    const setTaskFilterActive = React.useCallback(() => {
        props.todoFilter('active', props.todoList.id);
    }, [props])

    const setTaskFilterCompleted = React.useCallback(() => {
        props.todoFilter('completed', props.todoList.id);
    }, [props])

    const removeTask = React.useCallback((taskId: string, todoListId: string) => {
        dispatch(deleteTask({todoListId, taskId}))
    }, [dispatch])

    const addNewTask = React.useCallback((title: string) => {
        dispatch(addTask({todosId: props.todoList.id, title}))
    }, [dispatch, props.todoList.id])

    const changeTodoListTitle = React.useCallback((title: string) => {
        props.changeTodoListTitle(title, props.todoList.id);
    }, [props])

    const changeTodoListTitleOnKey = React.useCallback((title: string) => {
        props.changeTodoListTitle(title, props.todoList.id);
    }, [props])

    let allTodoListTasks = tasks
    let tasksForTodoList = allTodoListTasks;

    if (props.todoList.filter === 'active') {
        tasksForTodoList = allTodoListTasks.filter(t => t.status === TaskStatus.New);
    }
    if (props.todoList.filter === 'completed') {
        tasksForTodoList = allTodoListTasks.filter(t => t.status === TaskStatus.Completed);
    }

    return (
        <div className={`TodoList ${props.todoList.entityStatus === 'loading' && 'disable'}`}>
            <div className={'todoListTitle'}>
                <EditableTitle
                    error={todoListTitleError}
                    onKeyPress={changeTodoListTitleOnKey}
                    onChange={changeTodoListTitle}
                    title={props.todoList.title}/>
                <IconButton onClick={() => props.deleteItem(props.todoList.id)}>
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
                        todoListId={props.todoList.id}
                        deleteTask={removeTask}
                        task={task}
                        taskTitleError={taskTitleError}/>)
                }
            </ul>
            <div className={'buttonBox'}>
                <MyButton
                    variant={props.todoList.filter === 'all' ? 'contained' : "text"}
                    color={'default'}
                    onClick={setTaskFilterAll}
                    title={'All'}/>
                <MyButton
                    variant={props.todoList.filter === 'active' ? 'contained' : 'text'}
                    color={'secondary'}
                    onClick={setTaskFilterActive}
                    title={'Active'}/>
                <MyButton
                    variant={props.todoList.filter === 'completed' ? 'contained' : 'text'}
                    color={"primary"}
                    onClick={setTaskFilterCompleted}
                    title={'Completed'}/>
            </div>
        </div>
    )
})

export type TasksType = {
    [key: string]: Array<TaskType>
}

type PropsType = {
    todoList: TodoListDomainType
    todoFilter: (value: FilterType, todoListId: string) => void
    deleteItem: (id: string) => void
    changeTodoListTitle: (title: string, id: string) => void
}