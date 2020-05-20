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
import { UserProfileEditor } from './component/user/UserProfileEditor'
import { ProjectEditor } from './component/admin/project/ProjectEditor'
import { ProjectCreate } from './component/admin/project/ProjectCreate'
import { UserCreate } from './component/admin/user/UserCreate'
import { ProjectList} from './component/admin/project/ProjectList'
import { EmployeList } from './component/admin/user/EmployeList'



export const App = () => {


    return (

        <BrowserRouter>

            <InfoBoxProvider>
                <AuthProvider >
                    <Header />

                    <Switch>
                        <RequireLogin path="/" exact component={Dashboard} />
                        <UserRoute path="/login" component={Login} />
                        
                        <RequireLogin path="/Admin/Project/New" component={ProjectCreate} />
                        <RequireLogin path="/Admin/Project/Edit/:id" component={ProjectEditor} />
                        <RequireLogin path="/Admin/Project/" component={ProjectList} />
                        <RequireLogin path="/admin/user/new" component={UserCreate} />
                        <RequireLogin path="/Admin/User" component={EmployeList} />
                        
                        <RequireLogin path="/Project/:id" component={Project} />
                        <RequireLogin path="/User/Profile/:id" component={UserProfileEditor} />
                        <RequireLogin path="/User/Profile" component={UserProfileEditor} />
                      
                        
                        <RequireLogin path="/User/:id" component={UserProfile} />

                    </Switch>

                </AuthProvider>
            </InfoBoxProvider>
        </BrowserRouter>

    );
}