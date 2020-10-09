import React from "react";
import {EditableTitle} from "./EditableTitle";
import {action} from "@storybook/addon-actions";

export default {
    title: 'Editable title',
    component: EditableTitle
}

const change = action('Title changed')
const onKeyChange = action('Title changed')

export function EditableTitleExample() {
    return <EditableTitle title={'Title'} error={'Error'} onChange={change} onKeyPress={onKeyChange}/>
}

