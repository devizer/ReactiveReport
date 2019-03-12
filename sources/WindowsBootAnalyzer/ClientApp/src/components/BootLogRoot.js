import React, { Component } from 'react';
import MomentFormat from 'moment';
import {EventIcon} from "./EventIcon"
import classNames from "classnames"

import {BootAtButton} from "./BootAtButton";
import BootLogStaticDataSource from '../Final-Report.json'
import ErrorsOnlyStore from "./ErrorsOnlyStore";
import {LOG} from "./AppUtils"

import './BootLog.css';

var proxyArrayFind = require('ponyfill-array'); /* IE 11 fix of find method */
let TheRoot = 'I IS GROOT';
console.log(TheRoot);
const $ = window.$;

export class BootLogRoot extends Component {

    static displayName = BootLogRoot.name;
    
    constructor(props) {
        super(props);
        var boots = BootLogStaticDataSource.Boots;
        this.selectBootAt = this.selectBootAt.bind(this);
        
        LOG.toConsole("props of BootLogRoot", props);
        LOG.toConsole("match of BootLogRoot", props.match);
        
        this.argBootAtKey = props.match.params.bootAtKey;
        
        console.log('type of boots: ' + (typeof boots));
        console.log('boots[] length: ' + (boots.length));
        console.log(boots);

        let startAt = +new Date();
        let bootIndex = 0;
        boots.map(boot => {
            boot.UniqueKey = "B" + (++bootIndex);
            boot.TotalErrors = boot.Fail + boot.Crash;
            boot.HasErrors = boot.TotalErrors > 0;
            boot.IsOk = !boot.HasErrors;
            let mo = MomentFormat(boot.BootAt);
            boot.DateField = mo.format("MMM DD (YYYY)");
            boot.TimeField = mo.format("HH:mm:ss A");
            let eventIndex = 0;
            boot.Events.map(ev => {
                ev.UniqueKey = `B${bootIndex}-E${++eventIndex}`;
                ev.IsInfo = ev.Type == "Information";
                ev.RoundedAt = ev.At < 100 ? Math.round(ev.At*10) / 10 : Math.round(ev.At);
                if (ev.Message)
                {
                    // [\w|\s|$|\(|\)|\+]
                    ev.Message = ev.Message.replace(/([T|t]he )(.*)( service)/gm, function (str, the, servicename, service, offset, s) {
                        let fullServiceName = ev.ServiceName ? ev.ServiceName : servicename; 
                        return `${the}<b>${fullServiceName}</b>${service}`;
                    });
                    
                    if (!ev.IsInfo)
                    {
                        ev.Message = ev.Message.replace(/(timely|timeout)/gmi, function (str, timely, offset, s) {
                            return `<u>${timely}</u>`;
                        });
                    }
                }
            });
        });
        let transformDuration = (+new Date()) - startAt;
        console.log(`ON Start report mapping duration: ${transformDuration}`);
        

        this.state = {
            boots: boots, 
            selectedKey: "",
            logEvents: [],
            errorsOnly: ErrorsOnlyStore.getErrorsOnly()
        };
    }
    
    componentDidMount() {
        ErrorsOnlyStore.on('storeUpdated', this.updateErrorsOnly);
        console.log("componentDidMount()");

        let bootAtKey = this.props.match.params.bootAtKey;
        if (bootAtKey)
        {
            let filtered = this.state.boots.filter(boot => boot.UniqueKey === bootAtKey);
            if (filtered.length === 0)
            {
                // goto 404
                bootAtKey = null;
                console.log(`MOUNTING: [${bootAtKey}] not found`);
            }
        }

        if (!bootAtKey && this.state.boots.length > 0) {
            bootAtKey = this.state.boots[0].UniqueKey;
        }
        
        if (bootAtKey) {
            this.selectBootAt(bootAtKey);
        }
    }
    
    updateErrorsOnly = () => {
        this.setState({errorsOnly: ErrorsOnlyStore.getErrorsOnly()});
        console.log(`Change-Errors-Only event received: ${ErrorsOnlyStore.getErrorsOnly()}`);
    };

    selectBootAt(uniqueKey) {
        let logPrefix = "selectBootAt()";
        console.log(`selectBootAt() CLICK ON ${uniqueKey}`);
        let boots = this.state.boots;
        LOG.toConsole(`selectBootAt() [BootLogRoot]::state.boots`, boots);

        let rowSource = this.state.boots.find( (el) => el.UniqueKey === uniqueKey);
        
        LOG.toConsole(`${logPrefix}DataSource found`, rowSource);
        let events = rowSource ? rowSource.Events : [];
        this.setState({
            selectedKey: uniqueKey,
            logEvents: events,
            selectedBoot: rowSource,
        });
    }

    render() {

        let onlyErrors = this.state.errorsOnly;
        let bootEvent = {
            At: 0,
            Action: "Boot",
            Type: "Information",
            TimeGenerated: this.state.selectedBoot ? this.state.selectedBoot.BootAt : undefined,
            Message: "The operating system started. " + (this.state.errorsOnly ? "Only fails of services are shown below." : ""),
            IsInfo: true,
        };

        return (
            <div style={{}}>
                <div style={{paddingTop: "12px", display: "flex", border: "1px solid transparent"}}>
                    <div className="chooseBootAt" style={{display: "block", flexGrow: 1, borderRight: "1px solid transparent", backgroundColor: "inherit", width: 160, minWidth: 160, maxWidth: 160}}>
                        {this.state.boots.map(boot =>
                            <BootAtButton
                                onClick={() => { this.selectBootAt(boot.UniqueKey) }}
                                bootAt={boot}
                                isSelected={this.state.selectedKey === boot.UniqueKey}
                                style={{display: "block"}}
                            />
                        )}
                        <input type="button" value="classic" className="Hidden"/>
                    </div>
                    
                    <div style={{flexGrow: 6}}>
                        {/* First event: Boot at */}
                        <div className={classNames("Event", "InfoEvent", {Hidden: !this.state.selectedBoot})}>
                            <EventIcon event={bootEvent}/>{' '}
                            <span id="EventAt">{MomentFormat(bootEvent.TimeGenerated).format("HH:mm:ss A")}</span>{': '}
                            <span>{bootEvent.Message}</span>
                        </div>
                        {/* All the events */}
                        {this.state.logEvents.filter(ev => !onlyErrors || !ev.IsInfo).map(ev =>
                            <div className={classNames("Event", ev.IsInfo ? "InfoEvent" : "TroubleEvent")}>
                                <EventIcon event={ev}/>{' '}
                                <span class="EventAt">
                                    {MomentFormat(ev.TimeGenerated).format("HH:mm:ss A")}
                                    {' at '}{ev.RoundedAt + "s"}
                                </span>{', '}{ev.IsInfo ? "" : <span>[{ev.EventCode}]{' '}</span>}
                                <span dangerouslySetInnerHTML={{__html: ev.Message}}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
