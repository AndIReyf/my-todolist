import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '4px',
            position: 'absolute',
            top: '64px'
        },
    }),
)

export const Preloader = () => {

    const classes = useStyles()

    return (
        <div className={classes.root}>
            <LinearProgress color="secondary" />
        </div>
    )
}