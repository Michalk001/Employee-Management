import Cookies from 'js-cookie';
import React, {useEffect, useState} from "react";


import config from '../config.json'

import {Fetch, FetchGet} from "../models/Fetch";

export const AuthContext = React.createContext({
    isLogin: false,
    isAdmin: false,
    userDate: null,
    checkUnauthorized: () => {
    },
    LogOut: () => {
    },
    refreshToken: () => {
    },
    singUp: async () => {
    },
    createUserData: () => {
    },
    register: async () => {
    }

})


export const AuthProvider = (props) => {

    const [isLogin, setIsLogin] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const [userDate, setUserDate] = useState(null)

    const checkIsLogin = (token = null) => {

        if (Cookies.get('token') || token) {

            const jwtDecode = require('jwt-decode');
            let decoded;
            if(token){
                 decoded = jwtDecode(token);
            }
            else {
                 decoded = jwtDecode(Cookies.get('token'));
            }
            if (decoded.exp > (new Date() / 1000)) {
                setIsLogin(true)

            } else {
                setIsLogin(false)

            }
        } else {
            setIsLogin(false)
        }
    }

    const getUserData = (token = null) => {

        if (!Cookies.get('token') && !token) {
            return;
        }


        const jwtDecode = require('jwt-decode');
        let tokenDecode;
        if(token){
            tokenDecode = jwtDecode(token);
        }
        else{
            tokenDecode = jwtDecode(Cookies.get('token'));
        }

        if (tokenDecode.isAdmin) {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
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
        return await Fetch(`${config.apiRoot}/account/login`, "post", JSON.stringify(obj));


    }

    const register = async (user) => {
        return await Fetch(`${config.apiRoot}/account/register`, "post", JSON.stringify({user}))

    }

    const LogOut = () => {

        setIsLogin(false);
        setIsAdmin(false);
        setUserDate(null);
        Cookies.remove('token');
    }


    const checkUnauthorized = (error) => {
        const status = error.status;
        if (status === 401 ) {
            LogOut();
            return true
        }
        return false
    }


    const refreshToken = async () => {

        if (!Cookies.get('token'))
            LogOut();
        const result = await  FetchGet(`${config.apiRoot}/account/refreshToken/`)
        const data = await result.json();
        if (data.succeeded) {
            Cookies.remove('token');
            const jwtDecode = require('jwt-decode');
            const tokenDecode = jwtDecode(data.token);
            const expiresToDay = 86400
            const expiresTime = (tokenDecode.exp - tokenDecode.iat) / expiresToDay;
            Cookies.set('token', data.token, {expires: expiresTime});
            getUserData();
        }
    }


    const createUserData = (token) => {
        checkIsLogin(token);
        getUserData(token);

    }

    useEffect(() => {
        checkIsLogin();


    }, []);

    useEffect(() => {
        getUserData()

    }, [isLogin]);


    return (
        <AuthContext.Provider
            value={
                {
                    isLogin,
                    isAdmin,
                    userDate,
                    checkUnauthorized,
                    LogOut,
                    singUp,
                    refreshToken,
                    createUserData,
                    register
                }
            }
        >

            {props.children}
        </AuthContext.Provider>
    );
}