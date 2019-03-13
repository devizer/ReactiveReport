import 'babel-polyfill';
import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { BootLogRoot } from "./components/BootLogRoot";
import { Page404 } from "./Page404";

// linq for IE 11 support
// require('es5-shim');
// require('es5-shim/es5-sham');
// require('console-polyfill');


export default class App extends Component {
    static displayName = App.name;

    render () {
        return (
            <Layout>
                <Route exact path='/boot-at/:bootAtKey/:bootAtComment' component={BootLogRoot} />
                <Route exact path='/' component={BootLogRoot} />
                {/* <Route component={Page404} /> */}
            </Layout>
        );
    }
}
