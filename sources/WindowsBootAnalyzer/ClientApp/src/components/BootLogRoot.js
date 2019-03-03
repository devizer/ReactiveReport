import React, { Component } from 'react';
import MomentFormat from 'moment';
import {EventIcon} from "./EventIcon"
import classNames from "classnames"

import {BootAtButton} from "./BootAtButton";
import BootLogStaticDataSource from '../Final-Report.json'
import ErrorsOnlyStore from "./ErrorsOnlyStore";
import {LOG} from "./AppUtils"

import './BootLog.css';
const $ = window.$;


export class BootLogRoot extends Component {

    static displayName = BootLogRoot.name;
    
    constructor(props) {
        super(props);
        var boots = BootLogStaticDataSource.Boots;

        this.selectBootAt = this.selectBootAt.bind(this);

        console.log('type of boots: ' + (typeof boots));
        console.log('boots[] length: ' + (boots.length));
        console.log(boots);

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

        this.state = {
            boots: boots, 
            selectedKey: '', 
            logEvents: [],
            errorsOnly: ErrorsOnlyStore.getErrorsOnly()
        };

    }
    
    componentDidMount() {
        ErrorsOnlyStore.on('storeUpdated', this.updateErrorsOnly);
        console.log("componentDidMount()");
        
        if (this.state.boots.length > 0)
        {
            let selectedKey = this.state.boots[0].UniqueKey;
            this.selectBootAt(selectedKey);
        }
    }
    
    updateErrorsOnly = () => {
        this.setState({errorsOnly: ErrorsOnlyStore.getErrorsOnly()});
        console.log(`Change-Errors-Only event recieved: ${ErrorsOnlyStore.getErrorsOnly()}`);
    };

    selectBootAt(uniqueKey) {
        let logPrefix = "selectBootAt()";
        console.log(`selectBootAt() CLICK ON ${uniqueKey}`);
        let boots = this.state.boots;
        LOG.toConsole(`selectBootAt() [BootLogRoot]::state.boots`, boots);

        // let rowSource = this.state.boots.find( (el) => el.UniqueKey === uniqueKey);
        let rowSource = null;
        this.state.boots.map(el => {
            if (el.UniqueKey === uniqueKey) {
                rowSource = el;
            }
        });
        /* IE 11 fix of find method */
        
        LOG.toConsole(`${logPrefix}DataSource found`, rowSource);
        let events = rowSource ? rowSource.Events : [];
        this.setState({
            selectedKey: uniqueKey,
            logEvents: events,
            selectedBoot: rowSource,
        });

        let x = 5;
    }

    dateAsTimeString(dateAsJson) {
        var d = new Date(Date.parse(dateAsJson));
        var options = {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'};
        return d.toLocaleString('en-US', options);
    }

    incrementCounter() {
        this.setState({
            currentCount: this.state.currentCount + 1
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
                                <span id="EventAt">{MomentFormat(ev.TimeGenerated).format("HH:mm:ss A")}{' at '}
                                {ev.RoundedAt + "s"}</span>{', '}
                                {ev.IsInfo ? "" : <span>[{ev.EventCode}]{' '}</span>}
                                <span dangerouslySetInnerHTML={{__html: ev.Message}}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
