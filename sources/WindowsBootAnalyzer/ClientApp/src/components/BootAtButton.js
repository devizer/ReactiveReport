import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MomentFormat from 'moment';
import {LOG} from "./AppUtils"
import Button from '@material-ui/core/Button';
import classNames from "classnames";

import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

const $ = window.$;

export class BootAtButton extends Component {

    static displayName = BootAtButton.name;

    constructor(props) {
        super(props);
        LOG.toConsole("Properties of the BootAtButton", props);
    }
    
    render() {
        let boot = this.props.bootAt;

        const themeOk = createMuiTheme({
            palette: {
                primary: green,
            },
        });

        const themeError = createMuiTheme({
            palette: {
                primary: red,
            },
        });

        return (
            <MuiThemeProvider theme={boot.IsOk ? themeOk : themeError}>
            <Button
                onClick={() => this.props.onClick()}
                color={'primary'}
                variant={'outlined'}
                style={this.props.style}
                >
                <div className={classNames('MainCell', boot.HasErrors ? "BootError" : "BootOk")}>
                    <div className={boot.IsOk ? "MainCell-OK" : "MainCell-ErrorCounter"}>{boot.IsOk ? "OK" : ('' + boot.TotalErrors)}</div>
                    <div className="MainCell-Date">{boot.DateField}</div>
                    <div className="MainCell-Time">{boot.TimeField}</div>
                </div>
            </Button>
            </MuiThemeProvider>
        );
    }
}
