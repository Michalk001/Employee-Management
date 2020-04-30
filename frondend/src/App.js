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
import { Project } from './component/user/Project'
import { UserProfile } from './component/user/UserProfile'
import {ProjectEditor} from './component/admin/ProjectEditor'


export const App = () => {


    return (

        <BrowserRouter>

            <InfoBoxProvider>
                <AuthProvider >
                    <Header />

                    <Switch>
                        <RequireLogin path="/" exact component={Dashboard} />
                        <UserRoute path="/login" component={Login} />
                        <RequireLogin path="/Admin/Project/New" component={ProjectEditor} />
                        <RequireLogin path="/Admin/Project/Edit/:id" component={ProjectEditor} />
                        <RequireLogin path="/Project/:id" component={Project} />
                        <RequireLogin path="/User/:id" component={UserProfile} />
                        
                    </Switch>

                </AuthProvider>
            </InfoBoxProvider>
        </BrowserRouter>

    );
}