import React, { Component } from 'react';
import {LOG} from "./AppUtils"
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import classNames from "classnames";
// import {PropTypes} from "@material-ui/core";

const $ = window.$;

export class BootAtButton extends Component {

    static displayName = BootAtButton.name;

    static themeOk = createMuiTheme({
        palette: {
            // primary: green,
            primary: {
                main: '#004d40',
            },
        },
    });

    static themeError = createMuiTheme({
        palette: {
            // primary: red,
            primary: {
                main: '#b71c1c',
            },
        },
    });

    constructor(props) {
        super(props);
        LOG.toConsole("Properties of the BootAtButton", props);
    }

    render() {
        let boot = this.props.bootAt;
        if (!boot) { boot = {}};
        let theme = boot && boot.IsOk ? BootAtButton.themeOk : BootAtButton.themeError;

        return (
            <MuiThemeProvider theme={theme}>
                <Button
                    onClick={() => this.props.onClick()}
                    color={'primary'}
                    variant={'outlined'}
                    style={this.props.style}
                    className={classNames(this.props.isSelected ? "BootAtSelected" : "BootAtNonSelected")}
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

BootAtButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    bootAt: PropTypes.object.isRequired,
};

