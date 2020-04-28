import {
    BrowserRouter,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
import React, { useState, useEffect, state, useContext } from "react";



import { Header } from "./component/common/Header"

import { Login } from "./component/account/Login"
import { UserRoute, RequireLogin } from "./component/Auth"

import { AuthProvider } from './context/AuthContext';
import { InfoBoxProvider } from './context/InfoBox/InfoBoxContext';
import { Dashboard } from './component/dashboard/Dashboard'





export const App = () => {


    return (

        <BrowserRouter>

            <InfoBoxProvider>
                <AuthProvider >
                    <Header />

                    <Switch>
                    <UserRoute path="/login" component={Login} />
                        <RequireLogin path="/" component={Dashboard} />
                      

                    </Switch>

                </AuthProvider>
            </InfoBoxProvider>
        </BrowserRouter>

    );
}