import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Typography from '@material-ui/core/Typography';

import AppGitInfo from '../AppGitInfo'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import Toolbar from "./NavMenu";

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom_ignoreit: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        borderTop2: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit,
    },
}))(MuiDialogActions);

const info = {
    
}

export class AppAboutDialog extends React.Component {
    state = {
        open: false,
    };

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            open: nextProps.open,
        });
    }
    
    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = () => {
        this.setState({ open: false });
        if (this.props.onClose)
            this.props.onClose();
    };

    gotoGithub() {
        window.location = "https://github.com/devizer/ReactiveReport/tree/master/sources/WindowsBootAnalyzer/ClientApp/src/components";
    }

    dd = {
        infoItem: {
            position: "relative",
            width: "100%",
            marginBottom: "9px",
            marginTop: "15px",
        },
        term: {
            position: "absolute",
            left: 0, top: 0,
            textAlign: "left",
            width: "100%",
        },
        value: {
            position: "absolute",
            left: 0, top: 0,
            textAlign: "right",
            width: "100%",
            borderBottom: "1px dotted grey"
        },
        a: {
            color: "black"
        }
    };


    render() {
        let dd = this.dd;

        return (
                <Dialog
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.open}
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        <IconButton onClick={() => this.gotoGithub()} className={""} color="inherit" aria-label="Source Code">
                            <FontAwesomeIcon icon={faGithub} />
                        </IconButton>
                        About
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            It's .NET Core app for troubleshooting crashes and fails of windows services using Material&nbsp;UI with React.
                            Please don't take this playground with Material UI framework too seriously.
                        </Typography>
                        <Typography gutterBottom>
                            <div style={dd.infoItem}>&nbsp;
                                <div style={dd.term}>version</div>
                                <div style={dd.value}>{AppGitInfo.Version}</div>
                            </div>
                            <div style={dd.infoItem}>&nbsp;
                                <div style={dd.term}>branch</div>
                                <div style={dd.value}>{AppGitInfo.Branch}</div>
                            </div>
                            <div style={dd.infoItem}>&nbsp;
                                <div style={dd.term}>commit</div>
                                <div style={dd.value}>{new Date(AppGitInfo.CommitDate*1000).toLocaleDateString()}</div>
                            </div>
                            <div style={dd.infoItem}>&nbsp;
                                <div style={dd.term}>github</div>
                                <div style={dd.value}><a style={dd.a} href="https://github.com/devizer/ReactiveReport">devizer/ReactiveReport</a></div>
                            </div>
                        </Typography>
                    </DialogContent>
                </Dialog>
        );
    }
}

