//Lib
import { hot } from 'react-hot-loader';
import React from 'react';
//Router
import AppRouter from '@router/router.jsx';
//Apollo client
import '@layout/core.less';

class App extends React.Component {
    render() {
        return (
            <AppRouter />
        );
    }
}

export default hot(module)(App);
