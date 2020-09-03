import React from "react";
import './Button.scss'
import {Button} from "@material-ui/core";

type PropsType = {
    title?: string
    className?: string
    color: ColorType
    variant: VariantType
    onClick: () => void
}
type ColorType = "inherit" | "primary" | "secondary" | "default" | undefined
type VariantType = "text" | "outlined" | "contained" | undefined

export function MyButton(props: PropsType) {
    return (
        <div className={'Button'}>
            <Button
                variant={props.variant}
                color={props.color}
                className={props.className}
                onClick={props.onClick}>
                {props.title}
            </Button>
        </div>
    )
}