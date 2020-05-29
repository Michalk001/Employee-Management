
import React, { useState, useEffect, state, useReducer, useContext } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

export const SideBar = () => {

    const { t, i18n } = useTranslation('common');
    const authContext = useContext(AuthContext);
    const [hiddeMenu, setHiddeMenu] = useState(null);
    const { innerWidth: width, innerHeight: height } = window;

    const changeMenuVisible = () => {
        Cookies.set('hiddenMenu', !hiddeMenu)
        setHiddeMenu(!hiddeMenu)
    }

    useEffect(() => {
        if (Cookies.get('hiddenMenu') == "true") {
            setHiddeMenu(true)
        }
        else
            setHiddeMenu(false)

    }, [])


    useEffect(() => {

    }, [hiddeMenu])

    const hiddenMenuOnMobile = () => {
        if (window.innerWidth <= 768) {
            changeMenuVisible()
        }
    }

    const getUsername = () => {
        if (authContext.userDate) {
            return authContext.userDate.username
        }
        return null;
    }

    return (
        hiddeMenu != null && <>
            <div className={`navBar__mask ${hiddeMenu ? ` navBar__mask--close` : ``}`}></div>
            <div className={`navBar__arrows ${hiddeMenu ? `navBar__arrows--close-fix` : ``}`}>
                <i className={`fas fa-arrow-circle-left navBar__arrows--style navBar__arrows--${hiddeMenu ? `close` : `open`}`}
                    onClick={() => { changeMenuVisible() }} ></i>
            </div>
            <div className={`navBar navBar--${hiddeMenu ? `close` : `open`} `}>


                <div className={`navBar__menu ${hiddeMenu ? ` navBar__menu--close` : ``} `}>
                    <div className={`navBar__menu--item`}>
                        <div className={`navBar__menu--text navBar__menu--title `}> {t('common.userPanel')}</div>
                    </div>
                    <div className={`navBar__menu--item`}>
                        <Link to="/" onClick={() => hiddenMenuOnMobile()} className={`navBar__menu--text navBar__menu--link`} > {t('sideBar.dashboard')}</Link>
                    </div>
                    <div className={`navBar__menu--item`}>
                        <Link to={`/user/project`} onClick={() => hiddenMenuOnMobile()} className={`navBar__menu--text navBar__menu--link`} >{t('sideBar.projects')} </Link>
                    </div>
                    <div className={`navBar__menu--item`}>
                        <Link to={`/user/${getUsername()}`} onClick={() => hiddenMenuOnMobile()} className={`navBar__menu--text navBar__menu--link`} >{t('sideBar.profil')}</Link>
                    </div>
                    <div className={`navBar__menu--item`}>
                        <Link to={`/message`} onClick={() => hiddenMenuOnMobile()} className={`navBar__menu--text navBar__menu--link`} >{t('message.messages')}</Link>
                    </div>
                    <div className={`navBar__menu--item`}>
                        <Link to={`/message/new`} onClick={() => hiddenMenuOnMobile()} className={`navBar__menu--text navBar__menu--link`}> {t('message.write')} </Link>
                    </div>
                    {authContext.isAdmin && <>
                        <div className={`navBar__menu--item`}>
                            <div className={`navBar__menu--text navBar__menu--title `}> {t('common.adminPanel')}</div>
                        </div>
                        <div className={`navBar__menu--item`}>
                            <Link to="/admin/project/new" onClick={() => hiddenMenuOnMobile()} className={`navBar__menu--text navBar__menu--link  `}>{t('sideBar.newProject')}</Link>
                            <Link to="/admin/user/new" onClick={() => hiddenMenuOnMobile()} className={`navBar__menu--text navBar__menu--link  `}>{t('sideBar.newEmploye')}</Link>
                            <Link to="/admin/project" onClick={() => hiddenMenuOnMobile()} className={`navBar__menu--text navBar__menu--link  `}>{t('sideBar.projectsList')}</Link>
                            <Link to="/admin/user" onClick={() => hiddenMenuOnMobile()} className={`navBar__menu--text navBar__menu--link  `}>{t('sideBar.employeeList')}</Link>
                        </div>
                    </>}
                </div>
            </div >
        </>
    )

}