import React from "react";
import {AddItemForm} from "./AddItemForm";
import {action} from "@storybook/addon-actions";

export default {
    title: 'Add item form',
    component: AddItemForm
}

const act = action('Button add was pressed')

export const AddItemFomExample = () => {
    return <AddItemForm errorText={'Error'} addItem={act}/>
}