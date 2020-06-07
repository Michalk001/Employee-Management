
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { SideBar } from "./common/SideBar"


export const UserRoute = ({ component: Component, ...rest }) => (

    <Route exact  {...rest} render={(props) => (
        <div className="user">
            <Component {...props} />

        </div>
    )}
    />
)

export const RequireLogin = ({ path, component }) => {
    const authContext = useContext(AuthContext);
    return (<>
        {(authContext.isLogin || authContext.isLogin == null) ? <> <SideBar /> <UserRoute path={path} component={component} /></> : <Route render={() => (<Redirect to='/login' />)} />}
    </>
    )
} 

export const RequireAdmin = ({ path, component }) => {
    const authContext = useContext(AuthContext);
    return (<>
        {(authContext.isAdmin || authContext.isAdmin == null) ? <> <SideBar /> <UserRoute path={path} component={component} /></> : <Route render={() => (<Redirect to='/' />)} />}
    </>
    )
} 