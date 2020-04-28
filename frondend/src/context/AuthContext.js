import Cookies from 'js-cookie';
import React, { useState, useEffect, state, useReducer, useContext } from "react";
import { Redirect } from 'react-router-dom';

import config from '../config.json'

import { InfoBoxContext } from './InfoBox/InfoBoxContext';

export const AuthContext = React.createContext({
    isLogin: null,
    isAdmin: false,
    isConnecting: false,
    userDate: null,
    checkError: (error) => { },
    onAdmin: () => { },
    onLogin: () => { },
    LogOut: () => { },
    checkIsLogin: () => { },
    singUp: async () => { }

})




export const AuthProvider = (props) => {

    const [isLogin, setIsLogin] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userDate, setUserDate] = useState(null)
    const [correctlogin, setCorrectLogin] = useState(true)

    const [isConnecting, setIsConnecting] = useState(false);
    const contextInfoBox = useContext(InfoBoxContext)

    const checkIsAdmin = () => {

        if (Cookies.get('token')) {
            const jwtDecode = require('jwt-decode');
            const decoded = jwtDecode(Cookies.get('token'));
            const role = decoded.role.find((x) => { return x == "Admin" })
            if (role == "Admin") {
                setIsAdmin(true);
            }
            else
                setIsAdmin(false)
        }

    }

    const checkIsLogin = () => {

        if (Cookies.get('token')) {

            const jwtDecode = require('jwt-decode');
            const decoded = jwtDecode(Cookies.get('token'));
            if (decoded.exp > (new Date() / 1000)) {
                setIsLogin(true)

            }
            else {
                setIsLogin(false)
                console.log(4444)

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
        setUserDate({
            username: tokenDecode.sub,
            firstname: tokenDecode.firstname,
            lastname: tokenDecode.lastname,
            id: tokenDecode.id
        })
    }


    const singUp = async (loginValue) => {
        setIsConnecting(true);
        const obj = {
            username: loginValue.username,
            password: loginValue.password
        }
        await fetch(`${config.apiRoot}/login`, {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(obj)
        })
            .then(res => {
                if (res.ok) {

                    return res.json()

                }
                else {

                    throw (res);

                }
            })
            .then(res => {
                setIsConnecting(false);
                if (res.succeeded == true) {
                    Cookies.set('token', res.token);
                    checkIsLogin();

                    getUserData();
                    setCorrectLogin(false);
                }
                else {

                    setCorrectLogin(true);

                }
            })
            .catch(error => {
                setIsConnecting(false);
                if (error.status == 401) {
                    contextInfoBox.addInfo("Błędne hasło")
                } else {
                    contextInfoBox.addInfo("Nieznany błąd")
                }

            })
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

    useEffect(() => {
        checkIsLogin();

        //  checkIsAdmin();
    }, []);

    useEffect(() => {
        getUserData()
    }, [isLogin]);

    useEffect(() => {

    }, [correctlogin, userDate]);

    return (
        <AuthContext.Provider
            value={
                {
                    isLogin,
                    isAdmin,
                    userDate,
                    checkError,
                    checkIsLogin,
                    checkIsAdmin,
                    LogOut,
                    singUp,
                    isConnecting
                }
            }
        >
            {!correctlogin && <Redirect to="/" />}
            {props.children}
        </AuthContext.Provider>
    );
}