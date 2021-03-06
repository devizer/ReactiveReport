import React, { Component } from 'react';
import MomentFormat from 'moment';
import {EventIcon} from "./EventIcon"
import classNames from "classnames"
import * as Enumerable from "linq-es5"

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import { makeStyles } from '@material-ui/styles'; alpha-next

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6


import {BootAtButton} from "./BootAtButton";
import BootLogStaticDataSource from '../Final-Report.json'
import ErrorsOnlyStore from "./ErrorsOnlyStore";
import {LOG} from "./AppUtils"
import { withStyles } from '@material-ui/core/styles';


import './BootLog.css';

var proxyArrayFind = require('ponyfill-array'); /* IE 11 fix of find method */
let TheRoot = 'I IS GROOT';
console.log(TheRoot);
const $ = window.$;

const stylesPanel = {
    expanded: { marginTop: "0px", marginBottom: "0px" },
};

const MyExpansionPanel = withStyles(stylesPanel, { name: 'MyExpansionPanel' })(ExpansionPanel);

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
        LOG.toConsole("boots[]", boots);

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
                ev.IsInfo = ev.Type === "Information";
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

        startAt = +new Date();
        let servicesWithErrors = Enumerable.asEnumerable(boots)
            .SelectMany(b => b.Events)
            .Where(e => !e.IsInfo)
            .Select(e => e.ServiceName)
            .Distinct()
            .OrderBy(name => name).ToArray();
        transformDuration = (+new Date()) - startAt;
        console.log(`${servicesWithErrors.length} services with errors: ${servicesWithErrors.join(", ")}`);
        console.log(`ON [Services with errors] duration: ${transformDuration}`);
        

        this.state = {
            boots: boots, 
            selectedKey: "",
            logEvents: [],
            errorsOnly: ErrorsOnlyStore.getErrorsOnly(),
            servicesWithErrors: servicesWithErrors,
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

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    expandableServices = theme => ({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
    });

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

        // const { expanded } = this.state;


        return (
            <div style={{}}>
                <br/>

                
                <MyExpansionPanel >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className="">Warning! Found {this.state.servicesWithErrors.length} services with troubles</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            {this.state.servicesWithErrors.map(svc =>
                                <span key={svc}><nobr>{svc}</nobr><br/></span>
                            )}
                        </Typography>
                    </ExpansionPanelDetails>
                </MyExpansionPanel>
                
                <div style={{paddingTop: "12px", display: "flex", border: "1px solid transparent"}}>
                    {/* List of the boots */}
                    <div className="chooseBootAt" style={{display: "block", flexGrow: 1, borderRight: "1px solid transparent", backgroundColor: "inherit", width: 160, minWidth: 160, maxWidth: 160}}>
                        {this.state.boots.map(boot =>
                            <BootAtButton key={boot.UniqueKey}
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
                            <span className="EventAt">{MomentFormat(bootEvent.TimeGenerated).format("HH:mm:ss A")}</span>{': '}
                            <span>{bootEvent.Message}</span>
                        </div>
                        {/* All the events */}
                        {this.state.logEvents.filter(ev => !onlyErrors || !ev.IsInfo).map(ev =>
                            <div key={ev.UniqueKey} className={classNames("Event", ev.IsInfo ? "InfoEvent" : "TroubleEvent")}>
                                <EventIcon event={ev}/>{' '}
                                <span className="EventAt">
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
