import React, {ChangeEvent, KeyboardEvent} from "react";
import './AddItemForm.scss';
import { IconButton, TextField} from "@material-ui/core";
import {Add} from "@material-ui/icons";

type PropsType = {
    title?: string
    errorText: string
    addItem: (value: string) => void
}

export const AddItemForm = React.memo(function AddItemForm(props: PropsType) {

    const [error, setError] = React.useState('');
    const [inpValue, setInpValue] = React.useState('');

    const isInpEmpty = (value: string) => value.trim() === '';
    const showError = () => {
        setInpValue('');
        setError(props.errorText);
    }
    const onInpValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError('');
        setInpValue(e.currentTarget.value);
    }
    const onKeyPressInpValueChange = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            isInpEmpty(inpValue) ? showError() : addNewTask();
        }
    }
    const addNewTask = () => {
        if (isInpEmpty(inpValue)) {
            showError();
        } else {
            props.addItem(inpValue.trim());
            setInpValue('');
        }
    }

    return (
        <div className={'ItemForm'}>
            <div className={'itemFormWrap'}>
                <div>
                    <TextField
                        label="Title"
                        variant="outlined"
                        error={!!error}
                        helperText={error}
                        value={inpValue}
                        onChange={onInpValueChange}
                        onKeyPress={onKeyPressInpValueChange}
                    />
                </div>
                <IconButton
                    style={{alignSelf: 'flex-start'}}
                    color="primary"
                    onClick={addNewTask}
                    aria-label="Add">
                    <Add />
                </IconButton>
            </div>
        </div>
    )
})