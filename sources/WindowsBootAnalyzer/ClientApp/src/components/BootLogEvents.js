import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import JqxDataTable from '../jqwidgets-react/react_jqxdatatable.js';
import MomentFormat from 'moment';
const $ = window.$;

class LOG {
    static toConsole = function(caption, obj) {
        console.log(`🡦 ${caption} 🡧`);
        console.log(obj);
        console.log('\r\n');
    }
}

export class BootLogEvents extends Component {

    static displayName = BootLogEvents.name;

    constructor (props) {
        super(props);
        LOG.toConsole("Properties of the BootLogEvents", props);
        this.state = { logEvents: props.logEvents ? props.logEvents : [] };
    }

    componentDidMount() {
        return;

        this.refs.comEvents.on('bindingComplete', () => {
            console.log('[BootLogEvents :: bindingComplete]');
            // this.refs.comEvents.selectRow(0);
        });
    }

    componentWillReceiveProps(props){
        let logPrefix = "[BootLogEvents :: componentWillReceiveProps]";
        LOG.toConsole(`${logPrefix} NEW Properties`, props);
        let events = props.logEvents;
        this.setState( {logEvents: props.logEvents ? props.logEvents : []});
        this.forceUpdate();
    }

    render () {
        LOG.toConsole("[BootLogEvents :: render] Binding source", {logEvents: this.state.logEvents});
        console.log("TYPE of this.state.logEvents " + (typeof this.state.logEvents));
        console.log("LENGTH of this.state.logEvents " + this.state.logEvents.length);
        
        let hasData = this.state.logEvents && this.state.logEvents.length > 0;
        let source = {
            localData: this.state.logEvents,
            dataType: 'array',
            dataFields: [
                { name: 'UniqueKey', type: 'string' },
                { name: 'Action',        type: 'string' },
                { name: 'At',            type: 'number' },
                { name: 'Message',       type: 'string' },
                { name: 'TimeGenerated', type: 'date' },
                { name: 'ServiceKey',    type: 'string' },
                { name: 'ServiceName',   type: 'string' },
                { name: 'EventCode',     type: 'number' },
                { name: 'Type',          type: 'string' }
            ]};
        
        let dataAdapter = new $.jqx.dataAdapter(source);

        let columns = [
            /* 
            { text: 'Timer', dataField: 'At',  width: 100, cellsAlign: 'left', align: 'left', cellsFormat: 'f1' },
            { text: 'Act', dataField: 'Action',  width: 100, cellsAlign: 'left', align: 'left' },
            { text: 'Service', dataField: 'ServiceName',  width: 100, cellsAlign: 'left', align: 'left' },
            { text: 'Kind', dataField: 'Type',  width: 100, cellsAlign: 'left', align: 'left' },
            { text: 'When', dataField: 'TimeGenerated', width: 100, cellsAlign: 'left', align: 'left', cellsFormat: 'MMM dd, HH:mm:ss' },
            { text: 'Code',    dataField: 'EventCode',  width: 44, cellsAlign: 'left', align: 'left' },
            { text: 'Message', dataField: 'Message',  width: 300, cellsAlign: 'left', align: 'left' },
            */

            { text: 'Message', dataField: 'Message',  width: 300, cellsAlign: 'left', align: 'left' },
        ];
            
        return (
            <div>
                <JqxDataTable ref='comEvents' infoId={'Events'}
                              source={dataAdapter} columnsResize={false}
                              pageable={true} columns={columns} pagerButtonsCount={10}
                />

                LOG ROWS: has data is {(this.state.logEvents.length)}
                <ul>
                    { this.state.logEvents.map(ev =>
                        <li>{MomentFormat(ev.TimeGenerated).format("HH:mm:ss")}, {ev.Message}</li>
                    )}
                </ul>
                
            </div>
        );
    }

}