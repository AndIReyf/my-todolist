import React, {ChangeEvent, KeyboardEvent, FocusEvent, useState} from "react";
import './EditableTitle.scss';
import {MyInput} from "../Input/MyInput";

type PropsType = {
    title: string
    error: string
    onChange: (title: string) => void
    onKeyPress: (title: string) => void
}

export const EditableTitle = React.memo(function EditableTitle(props: PropsType) {

    const [title, setTitle] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');

    const isInpEmpty = (value: string) => value.trim() === '';
    const showError = () => {
        setTitle('');
        setError(props.error);
    }
    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.title);
    }
    const disableActiveMode = (e: FocusEvent<HTMLInputElement>) => {
        if (!isInpEmpty(e.currentTarget.defaultValue)) {
            setEditMode(false);
            setError('');
            props.onChange(title);
        } else {
            showError()
        }
    }
    const onTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError('')
    }
    const onKeyTitleChangeHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            if (!isInpEmpty(title)) {
                props.onKeyPress(title);
                setEditMode(false);
            } else {
                showError()
            }
        }
    }

    return (
        <div className={'EditableTitle'}>
            {
                editMode
                    ? <MyInput
                        label="Change title"
                        error={!!error}
                        helperText={error}
                        onKeyPress={onKeyTitleChangeHandler}
                        onChange={onTitleChangeHandler}
                        onBlur={disableActiveMode}
                        value={title}
                        autoFocus
                        type="text"/>
                    : <span onDoubleClick={activateEditMode}>{props.title}</span>
            }
        </div>
    )
})