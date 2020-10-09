import React, {ChangeEvent, FocusEvent, KeyboardEvent} from "react";
import {TextField} from "@material-ui/core";


type PropsType = {
    label: string
    value: string
    error: boolean
    autoFocus: boolean
    type: string
    helperText: string
    onKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onBlur: (e: FocusEvent<HTMLInputElement>) => void
}

export function MyInput(props: PropsType) {
    return (
        <div>
            <TextField
                autoFocus={props.autoFocus}
                label={props.label}
                error={props.error}
                helperText={props.helperText}
                onKeyPress={props.onKeyPress}
                onChange={props.onChange}
                onBlur={props.onBlur}
                value={props.value}
                type={props.type}/>
        </div>
    )
}