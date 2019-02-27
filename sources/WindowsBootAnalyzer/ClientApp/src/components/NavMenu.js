import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Switch from '@material-ui/core/Switch';
import * as ErrorsOnlyActions from "./ErrorsOnlyActions";

import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'


const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    close : {
    },
    snack : {
        margin: '1px',
        padding: '5px'
    }
    
};

class NavMenu1 extends Component {
    static displayName = NavMenu1.name;
    
    constructor (props) {
        super(props);

        this.state = {
            collapsed: true,
            OnlyErrors: false,
            hintVisible: false,
        };
        
        this.closeHint = this.closeHint.bind(this);
    }

    componentDidMount() {
    }

    closeHint(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ hintVisible: false });
    };

    handleChange = name => event => {
        let newValue = event.target.checked;
        this.setState({ [name]: event.target.checked });
        console.log(`[${name}] switch changed to ${newValue}`);
        ErrorsOnlyActions.changeErrorsOnly(newValue);
        this.setState({ hintVisible: true });
    };
    
    gotoGithub() {
        window.location = "https://github.com/devizer/ReactiveReport/tree/master/sources/WindowsBootAnalyzer/ClientApp/src/components";
    }
    

    render () {
        
        const classes = this.props.classes;
        
        let hintMessage = <span id="message-id">Show <b>Errors</b> only</span>;
        if (!this.state.OnlyErrors)
            hintMessage = <span id="message-id">Show both <b>Errors</b> and info messages</span>;
        
        return (
            <header>

                <AppBar position="static">
                    <Toolbar>
                        <IconButton onClick={() => this.gotoGithub()} className={classes.menuButton} color="inherit" aria-label="Menu">
                            <FontAwesomeIcon icon={faGithub} />
                        </IconButton>
                        <Typography variant="h6" color="inherit" style={{flexGrow: 10}}>
                            Reactive Material Report
                        </Typography>
                        <Switch
                            checked={this.state.OnlyErrors}
                            onChange={this.handleChange('OnlyErrors')}
                            value="OnlyErrors"
                        />

                        <Snackbar
                            className={classes.snack}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            open={this.state.hintVisible}
                            autoHideDuration={4000}
                            onClose={this.closeHint}
                            ContentProps={{
                                'aria-describedby': 'message-id',
                            }}
                            message={hintMessage}
                            action={[
                                <IconButton
                                    key="close"
                                    aria-label="Close"
                                    color="inherit"
                                    className={classes.close}
                                    onClick={this.closeHint}
                                >
                                    <CloseIcon />
                                </IconButton>,
                            ]}
                        />
                        
                    </Toolbar>
                </AppBar>
                
            </header>
        );
    }
}


const NavMenu = withStyles(styles)(NavMenu1);
export {NavMenu};
