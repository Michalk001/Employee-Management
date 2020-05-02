
import {
    BrowserRouter,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
import React, { useState, useEffect, state, useContext } from "react";
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { NavBar } from "./common/NavBar"


export const UserRoute = ({ component: Component, ...rest }) => (

    <Route exact  {...rest} render={(props) => (
        <div className="user">
            <Component {...props} />

        </div>
    )}
    />
)

export const RequireLogin = ({ path, component, ...rest }) => {
    const authContext = useContext(AuthContext);
    return (<>
        {(authContext.isLogin || authContext.isLogin == null) ? <> <NavBar /> <UserRoute path={path} component={component} /></> : <Route render={() => (<Redirect to='/login' />)} />}
    </>
    )
} 