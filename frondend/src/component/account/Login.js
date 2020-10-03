import React, {useState, useEffect, useContext} from "react";

import {AuthContext} from "../../context/AuthContext";
import {InfoBoxContext} from "../../context/InfoBox/InfoBoxContext";
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom';
import {useTranslation} from "react-i18next";


export const Login = () => {

    const [loginValue, setLoginValue] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [canRedirect, setCanRedirect] = useState(false)
    const {t} = useTranslation('common');

    const UpdateLoginValue = (e) => {
        setLoginValue({...loginValue, [e.target.name]: e.target.value});
    }
    const authContext = useContext(AuthContext);
    const infoBoxContext = useContext(InfoBoxContext);

    const singUp = async () => {
        setIsLoading(true)
        let result = null;
        try {
            result = await authContext.singUp(loginValue)
        } catch (err) {
            if (err === "TypeError: Failed to fetch")
                infoBoxContext.addInfo(t('infoBox.errorConnect'), 3);
            setIsLoading(false)
            return
        }

        const data = await result.json();

        setIsLoading(false)
        if (data.succeeded === true) {
            const jwtDecode = require('jwt-decode');
            const tokenDecode = jwtDecode(data.token);
            const expiresToDay = 86400
            const expiresTime = (tokenDecode.exp - tokenDecode.iat) / expiresToDay;
            Cookies.set('token', data.token, {expires: expiresTime});
            authContext.createUserData();
            setCanRedirect(true);
        } else {

            if (data.code === 1) {
                infoBoxContext.addInfo(t('infoBox.accountRemove'), 3);
            } else if (data.code === 3) {
                infoBoxContext.addInfo(t('infoBox.accountBlocked'), 3);
            } else if (data.code === 2) {
                infoBoxContext.addInfo(t('infoBox.loginError'), 3);
            }
        }

    }

    useEffect(() => {
        document.title = t('title.login')
    }, [])

    return (
        <>
            {canRedirect && <Redirect to='/'/>}

            <div  data-testid="login" className="box box--center box--login">
                {isLoading &&
                    <div className="box__loading"><i className="fas fa-spinner load-ico load-ico--center load-ico__spin "/> </div>
                }
                <div className="box__text box__text--center box__text--title  ">{t('common.singUpDes')}</div>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    singUp();
                }}>

                    <div className="box__text box__item box__item--border-top">
                        <input className="box__input box__input--password-login" data-testid="username" type="text" name="username"
                               placeholder={t('common.login')} onChange={UpdateLoginValue}/>
                    </div>

                    <div className="box__text box__item box__item--border-bottom">
                        <input className="box__input box__input--password-login"  data-testid="password" type="password" name="password"
                               placeholder={t('common.password')} onChange={UpdateLoginValue}/>
                    </div>


                    <div className="box__item box__item--center">
                        <input data-testid="submit" type="submit" className="button button--full-width  box__text"
                               value={t('common.singUp')}/>
                    </div>


                </form>
            </div>
        </>
    )
}