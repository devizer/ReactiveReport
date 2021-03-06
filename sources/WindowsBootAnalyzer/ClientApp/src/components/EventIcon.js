import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { faRunning } from '@fortawesome/free-solid-svg-icons'
import { faStopCircle } from '@fortawesome/free-regular-svg-icons'
import { faTired } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons'
import {Component} from "react";
import React from "react";
import PropTypes from "prop-types";
import {BootAtButton} from "./BootAtButton";

export class EventIcon extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let style={maxWidth: 20, maxHeight: 20, display: "inline-block"};
        style={};
        let button = null;
        if (this.props.event.Action === "ServiceStarted")
            button = <FontAwesomeIcon style={style} icon={faRunning}/>;
        else if (this.props.event.Action === "ServiceStopped")
            button = <FontAwesomeIcon style={style} icon={faStopCircle}/>;
        else if (this.props.event.Action === "Boot")
            button = <FontAwesomeIcon style={style} icon={faArrowAltCircleRight}/>;
        
        if (!this.props.event.IsInfo)
            button = <FontAwesomeIcon icon={faExclamationTriangle}/>;

        if (button === null)
            button = <span/>;

        return (
            <span className="EventIconWrapper">{button}</span>
        );

        {/*<FontAwesomeIcon icon={faStopCircle} />*/
        }
        {/*<FontAwesomeIcon icon={faRunning} />&nbsp;*/
        }
        {/*<FontAwesomeIcon icon={faTired} />&nbsp;*/
        }
        {/*<FontAwesomeIcon icon={faExclamationTriangle} />&nbsp;*/
        }

    }
}

EventIcon.propTypes = {
    // event: PropTypes.object.isRequired,
    event: PropTypes.shape({
        IsInfo: PropTypes.bool.isRequired,
        Action: PropTypes.string.isRequired
    }),
};
