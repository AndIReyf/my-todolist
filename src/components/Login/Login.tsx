import React from "react";
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    TextField
} from "@material-ui/core";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {loginTC} from "../../Redux/State/login-reducer";
import {RootReducerType} from "../../Redux/store";
import { Redirect } from "react-router-dom";

export function Login() {

    const dispatch = useDispatch()
    const isSignIn = useSelector<RootReducerType, boolean>(state => state.auth.isSignIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: values => {
            if (!values.email) return {email: 'Email is required!'}
            if (!values.password) return {password: 'Password is required!'}
        },
        onSubmit: values => {
            dispatch(loginTC(values))
        },
    })

    // If it has already been signed in, redirect to home page
    if (isSignIn) {
        return <Redirect to={'/'}/>
    }

    return (
        <Grid container justify={'center'}>
            <Grid item xs={4}>
                {/*Hook useFormik gives handleSubmit function to take all form's values*/}
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>
                                To sign in get registered <a href="https://social-network.samuraijs.com/"
                                                             target="_blank">
                                <strong>here</strong>
                            </a>
                            </p>
                            <p>
                                or use common test account credentials:
                            </p>
                            <p>
                                Email: <b>free@samuraijs.com</b>
                            </p>
                            <p>
                                Password: <b>free</b>
                            </p>
                        </FormLabel>
                        <FormGroup>
                            <TextField type={'email'} label={'Email'} margin={'normal'}
                                // Get all props from email
                                       {...formik.getFieldProps('email')}
                            />
                            {/*Get an error message if email is not valid*/}
                            {formik.errors.email && <div>{formik.errors.email}</div>}
                            <TextField type={'password'} label={'Password'} margin={'normal'}
                                       {...formik.getFieldProps('password')}
                            />
                            {formik.errors.password && <div>{formik.errors.password}</div>}
                            <FormControlLabel label={'Remember me'}
                                              control={
                                                  // Get all props from checkbox
                                                  // checked value must be taken from formik
                                                  <Checkbox color={'primary'} checked={formik.values.rememberMe}
                                                            {...formik.getFieldProps('rememberMe')}
                                                  />
                                              }
                            />
                            <Button type={'submit'} variant={'contained'} color={'primary'}>Sign in</Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    )
}