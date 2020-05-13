import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from "../../context/AuthContext";

import Cookies from 'js-cookie';

export const Login = (props) => {

    const [loginValue, setLoginValue] = useState(null);
    const UpdateLoginValue = (e) => {
        setLoginValue({ ...loginValue, [e.name]: e.value });
    }
    const authContext = useContext(AuthContext);


    return (

        <div className="box box--center box--login">
            {authContext.isConnecting && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "></i></div>}
            <div className="box__text box__text--center box__text--title  ">Logowanie</div>
            <form onSubmit={(x) => { x.preventDefault(); authContext.singUp(loginValue); }}>

                <div className="box__text box__item box__item--border-top" >
                    <input className="box__input box__input--password-login" type="text" name="username" placeholder="login" onChange={x => UpdateLoginValue(x.target)} />
                </div>

                <div className="box__text box__item box__item--border-bottom" >
                    <input className="box__input box__input--password-login" type="password" name="password" placeholder="hasło" onChange={x => UpdateLoginValue(x.target)} />
                </div>


                <div className="box__item box__item--center">
                    <input type="submit" className="button button--full-width  box__text" value="Zaloguj" />
                </div>


            </form>
        </div>

    )
}