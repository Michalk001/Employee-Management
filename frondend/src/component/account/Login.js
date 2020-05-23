import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from "../../context/AuthContext";
import { InfoBoxContext } from "../../context/InfoBox/InfoBoxContext";
import Cookies from 'js-cookie';

export const Login = (props) => {

    const [loginValue, setLoginValue] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    
    const UpdateLoginValue = (e) => {
        setLoginValue({ ...loginValue, [e.target.name]: e.target.value });
    }
    const authContext = useContext(AuthContext);
    const infoBoxContext = useContext(InfoBoxContext);

    const singUp = async () => {
        setIsLoading(true)
        const result = await authContext.singUp(loginValue)
        console.log(result);
        const data = await result.json();
        setIsLoading(false)
        if (data.succeeded == true) {
            Cookies.set('token', data.token);
            authContext.createUserData();

        }
        else {

            if (data.code == 1) {
                infoBoxContext.addInfo("Konto usunięte");
            } else if (data.code == 3) {
                infoBoxContext.addInfo("Konto zablokowane");
            } else if (data.code == 2) {
                infoBoxContext.addInfo("Błędny login lub hasło");
            }
        }

    }

    return (

        <div className="box box--center box--login">
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "></i></div>}
            <div className="box__text box__text--center box__text--title  ">Logowanie</div>
            <form onSubmit={(event) => { event.preventDefault(); singUp(); }}>

                <div className="box__text box__item box__item--border-top" >
                    <input className="box__input box__input--password-login" type="text" name="username" placeholder="login" onChange={UpdateLoginValue} />
                </div>

                <div className="box__text box__item box__item--border-bottom" >
                    <input className="box__input box__input--password-login" type="password" name="password" placeholder="hasło" onChange={UpdateLoginValue} />
                </div>


                <div className="box__item box__item--center">
                    <input type="submit" className="button button--full-width  box__text" value="Zaloguj" />
                </div>


            </form>
        </div>

    )
}