import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import { useTranslation } from 'react-i18next';

import { AuthContext } from '../../context/AuthContext';


export const Header = () => {

    const { t, i18n } = useTranslation('common');
    const authContext = useContext(AuthContext);
    const [lang, setLang] = useState(null)


    const checkLang = () => {
        if (Cookies.get('lang') || Cookies.get('lang') == "null")
            setLang(Cookies.get('lang'))
        else {
            setLang("en")
            Cookies.set('lang', "en", { expires: 365 })
        }
    }

    const selectLang = (lang) => {
        i18n.changeLanguage(lang);
        Cookies.set('lang', lang, { expires: 365 }); setLang(lang)
    }

    useEffect(() => {
        checkLang();
    }, [])
    useEffect(() => {

    }, [lang])
    useEffect(() => { }, [authContext.userDate])

    return (

        <div className="header">
            <div className="header--wrap">
                <Link to="/" className="header__home">
                    <i className="fas fa-home header__home--ico  header__home--transition"></i>
                    <div className="header__home--text header__home--hidden-m  header__home--transition">{t('common.home')}</div>
                </Link>



                <div className="header__menu">
                    {lang == "pl" && <div className="header__lang header__lang--flag-en" onClick={() => { selectLang("en") }}></div>}
                    {lang == "en" && <div className="header__lang __icon header__lang--flag-pl" onClick={() => { selectLang("pl") }}></div>}
                    {authContext.isLogin && authContext.userDate && <Link to={`/user/${authContext.userDate.username}`} className="header__text header__text--link header__item">
                        <div className="header__menu--user-name"> {authContext.userDate.firstname} {authContext.userDate.lastname}</div>
                        <div className="header__menu--user-ico"> <i className="fas fa-user"></i> </div>
                    </Link>}
                    {!authContext.isLogin && <Link to="/login" className="header__text header__text--link header__item"> {t('common.singUp')}</Link>}
                    {authContext.isLogin && <div className="header__text header__text--link header__item" onClick={() => authContext.LogOut()}> {t('common.singOut')}</div>}
                </div>
            </div>
        </div>


    )

}