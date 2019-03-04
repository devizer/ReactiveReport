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

export class Page404 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            
            <h1 style={{textAlign: "center", fontSize:96,marginTop: 20}}>404</h1>
        );
    }
}