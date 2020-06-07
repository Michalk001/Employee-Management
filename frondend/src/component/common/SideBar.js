import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";
import Cookies from 'js-cookie';
import {useTranslation} from 'react-i18next';

export const SideBar = () => {

    const {t} = useTranslation('common');
    const authContext = useContext(AuthContext);
    const [hiddenMenu, setHiddenMenu] = useState(null);
    const {innerWidth: width} = window;

    const changeMenuVisible = () => {
        Cookies.set('hiddenMenu', !hiddenMenu, {expires: 365})
        setHiddenMenu(!hiddenMenu)
    }

    useEffect(() => {
        if (Cookies.get('hiddenMenu') === "false") {
            setHiddenMenu(false)
        } else
            setHiddenMenu(true)

    }, [])

    useEffect(() => {

    }, [hiddenMenu])

    const autoHiddenMenuSmallDevice = () => {
        if (width <= 1180) {
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
        hiddenMenu != null && <>
            <div className={`navBar__mask ${hiddenMenu ? ` navBar__mask--close` : ``}`}/>
            <div className={`navBar__arrows ${hiddenMenu ? `navBar__arrows--close-fix` : ``}`}>
                <i className={`fas fa-arrow-circle-left navBar__arrows--style navBar__arrows--${hiddenMenu ? `close` : `open`}`}
                   onClick={() => {
                       changeMenuVisible()
                   }}/>
            </div>
            <div className={`navBar navBar--${hiddenMenu ? `close` : `open`} `}>


                <div className={`navBar__menu ${hiddenMenu ? ` navBar__menu--close` : ``} `}>
                    <div className={`navBar__menu--item`}>
                        <div className={`navBar__menu--text navBar__menu--title `}> {t('common.userPanel')}</div>
                    </div>
                    <div className={`navBar__menu--item`}>
                        <Link to="/" onClick={() => autoHiddenMenuSmallDevice()}
                              className={`navBar__menu--text navBar__menu--link`}> {t('sideBar.dashboard')}</Link>
                    </div>
                    <div className={`navBar__menu--item`}>
                        <Link to={`/user/project`} onClick={() => autoHiddenMenuSmallDevice()}
                              className={`navBar__menu--text navBar__menu--link`}>{t('sideBar.projects')} </Link>
                    </div>
                    <div className={`navBar__menu--item`}>
                        <Link to={`/user/${getUsername()}`} onClick={() => autoHiddenMenuSmallDevice()}
                              className={`navBar__menu--text navBar__menu--link`}>{t('sideBar.profile')}</Link>
                    </div>
                    <div className={`navBar__menu--item`}>
                        <Link to={`/message`} onClick={() => autoHiddenMenuSmallDevice()}
                              className={`navBar__menu--text navBar__menu--link`}>{t('message.messages')}</Link>
                    </div>
                    <div className={`navBar__menu--item`}>
                        <Link to={`/message/new`} onClick={() => autoHiddenMenuSmallDevice()}
                              className={`navBar__menu--text navBar__menu--link`}> {t('message.write')} </Link>
                    </div>
                    {authContext.isAdmin && <>
                        <div className={`navBar__menu--item`}>
                            <div className={`navBar__menu--text navBar__menu--title `}> {t('common.adminPanel')}</div>
                        </div>
                        <div className={`navBar__menu--item`}>
                            <Link to="/admin/project/new" onClick={() => autoHiddenMenuSmallDevice()}
                                  className={`navBar__menu--text navBar__menu--link  `}>{t('sideBar.newProject')}</Link>
                            <Link to="/admin/user/new" onClick={() => autoHiddenMenuSmallDevice()}
                                  className={`navBar__menu--text navBar__menu--link  `}>{t('sideBar.newEmployee')}</Link>
                            <Link to="/admin/project" onClick={() => autoHiddenMenuSmallDevice()}
                                  className={`navBar__menu--text navBar__menu--link  `}>{t('sideBar.projectsList')}</Link>
                            <Link to="/admin/user" onClick={() => autoHiddenMenuSmallDevice()}
                                  className={`navBar__menu--text navBar__menu--link  `}>{t('sideBar.employeeList')}</Link>
                        </div>
                    </>}
                </div>
            </div>
        </>
    )

}