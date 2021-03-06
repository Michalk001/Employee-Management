import {BrowserRouter, Switch} from 'react-router-dom';
import React from "react";



import { Header } from "./component/common/Header"

import { Login } from "./component/account/Login"
import { UserRoute, RequireLogin,RequireAdmin } from "./component/Auth"

import { AuthProvider } from './context/AuthContext';
import { InfoBoxProvider } from './context/InfoBox/InfoBoxContext';

import { Dashboard } from './component/dashboard/Dashboard'
import { Project } from './component/user/Project'
import { UserProfile } from './component/user/UserProfile'
import { UserProfileEditor } from './component/user/UserProfileEditor'
import { UserProjectsList } from './component/user/UserProjectsList'
import { Message } from './component/user/messenge/Message'
import { MessageNew } from './component/user/messenge/MessageNew'
import { MessageView } from './component/user/messenge/MessageView'
import { ErrorPage } from './component/common/ErrorPage';


import { ProjectEditor } from './component/admin/project/ProjectEditor'
import { ProjectCreate } from './component/admin/project/ProjectCreate'
import { UserCreate } from './component/admin/user/UserCreate'
import { ProjectList } from './component/admin/project/ProjectList'
import { EmployeeList } from './component/admin/user/EmployeeList'


import { I18nextProvider } from 'react-i18next';
import { i18nInit } from './localization/i18nInit';


export const App = () => {


    return (

        <BrowserRouter>
            <I18nextProvider i18n={i18nInit()}>
                <InfoBoxProvider>
                    <AuthProvider >
                        <Header />
                        <Switch>
                            <RequireLogin path="/" exact component={Dashboard} />
                            <UserRoute path="/login" component={Login} />

                            <RequireAdmin path="/Admin/Project/New" component={ProjectCreate} />
                            <RequireAdmin path="/Admin/Project/Edit/:id" component={ProjectEditor} />
                            <RequireAdmin path="/Admin/Project/" component={ProjectList} />
                            <RequireAdmin path="/admin/user/new" component={UserCreate} />
                            <RequireAdmin path="/Admin/User/" component={EmployeeList} />

                            <RequireLogin path="/Project/:id" component={Project} />
                            <RequireAdmin path="/User/Profile/:id" component={UserProfileEditor} />
                            <RequireLogin path="/User/Profile" component={UserProfileEditor} />
                            <RequireLogin path="/User/Project/" component={UserProjectsList} />
                            <RequireLogin path="/User/:id" component={UserProfile} />

                            <RequireLogin path="/message/new" component={MessageNew} />
                            <RequireLogin path="/message/:id" component={MessageView} />
                            <RequireLogin path="/message/" component={Message} />
                            <RequireLogin component={ErrorPage} />

                        </Switch>

                    </AuthProvider>
                </InfoBoxProvider>
            </I18nextProvider>
        </BrowserRouter>

    );
}