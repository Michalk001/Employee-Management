import Cookies from 'js-cookie';
import React, { useState, useEffect, state, useReducer, useContext } from "react";
import { Redirect } from 'react-router-dom';

import config from '../config.json'

import { InfoBoxContext } from './InfoBox/InfoBoxContext';

export const AuthContext = React.createContext({
    isLogin: false,
    isAdmin: false,
    isConnecting: false,
    userDate: null,
    checkError: (error) => { },
    onAdmin: () => { },
    onLogin: () => { },
    LogOut: () => { },
    refreshToken: () => { },
    singUp: async () => { },
    createUserData: () => { },
    register: async (user) => { }

})




export const AuthProvider = (props) => {

    const [isLogin, setIsLogin] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userDate, setUserDate] = useState(null)


    const [isConnecting, setIsConnecting] = useState(false);
    const infoBoxContext = useContext(InfoBoxContext)



    const checkIsLogin = () => {

        if (Cookies.get('token')) {

            const jwtDecode = require('jwt-decode');
            const decoded = jwtDecode(Cookies.get('token'));
            if (decoded.exp > (new Date() / 1000)) {
                setIsLogin(true)

            }
            else {
                setIsLogin(false)

            }
        }
        else {
            setIsLogin(false)
        }
    }

    const getUserData = () => {
        if (!isLogin) {
            return;
        }
        if (!Cookies.get('token')) {

            return;
        }
        const jwtDecode = require('jwt-decode');
        const tokenDecode = jwtDecode(Cookies.get('token'));
        if (tokenDecode.isAdmin)
            setIsAdmin(true)
        setUserDate({
            username: tokenDecode.sub,
            firstname: tokenDecode.firstname,
            lastname: tokenDecode.lastname,
            id: tokenDecode.id,
        })
    }


    const singUp = async (loginValue) => {

        const obj = {
            username: loginValue.username,
            password: loginValue.password
        }
        const result = await fetch(`${config.apiRoot}/account/login`, {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(obj)
        })
        return result;


    }

    const register = async (user) => {
        const result = await fetch(`${config.apiRoot}/account/register`, {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ user })
        });
        return result;
    }

    const LogOut = () => {

        setIsLogin(false);
        setIsAdmin(false);
        setUserDate(null);
        Cookies.remove('token');
    }


    const checkError = (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            LogOut();
            return true
        }
        return false
    }


    const refreshToken = async () => {
        let result = {};
        if (!Cookies.get('token'))
            LogOut();
        await fetch(`${config.apiRoot}/account/refreshToken/`, {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ token: Cookies.get('token') })
        })
            .then(res => res.json())
            .then(res => {
                result = res

            })

        if (result.succeeded) {
            Cookies.remove('token');
            Cookies.set('token', result.token);
            getUserData();
        }
    }


    const createUserData = () => {
        checkIsLogin();
        getUserData();

    }

    useEffect(() => {
        checkIsLogin();


    }, []);

    useEffect(() => {
        getUserData()
    }, [isLogin]);

    useEffect(() => {

    }, [userDate]);

    return (
        <AuthContext.Provider
            value={
                {
                    isLogin,
                    isAdmin,
                    userDate,
                    checkError,
                    LogOut,
                    singUp,
                    refreshToken,
                    createUserData,
                    isConnecting,
                    register
                }
            }
        >

            {props.children}
        </AuthContext.Provider>
    );
}