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

export class EventIcon extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let button = null;
        if (this.props.event.Action == "ServiceStarted")
            button = <FontAwesomeIcon icon={faRunning}/>;
        else if (this.props.event.Action == "ServiceStopped")
            button = <FontAwesomeIcon icon={faStopCircle}/>;
        else if (this.props.event.Action == "Boot")
            button = <FontAwesomeIcon icon={faArrowAltCircleRight}/>;

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

