/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Route } from 'react-router-dom';

const CustomRoute = (route) => (
    <Route
        path={ route.path }
        render={ (props) => <route.component { ...props } routes={ route.routes } /> }
    />
);

export { CustomRoute };
