
import React, { useState, useEffect, state, useReducer, useContext } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import Cookies from 'js-cookie';
export const NavBar = () => {


    const authContext = useContext(AuthContext);
    const [hiddeMenu, setHiddeMenu] = useState(null);


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

    return (
        hiddeMenu != null &&
        <div className={`navBar navBar--${hiddeMenu ? `close` : `open`} `}>

            <div className="navBar__arrows">
                <i className={`fas fa-arrow-circle-left navBar__arrows--style navBar__arrows--${hiddeMenu ? `close` : `open`}`}
                    onClick={() => { changeMenuVisible() }} ></i>
            </div>
            <div className={`navBar__menu ${hiddeMenu ? ` navBar__menu--close` : ``} `}>
                <div className={`navBar__menu--item`}>
                    <div className={`navBar__menu--text navBar__menu--title `}>Panel Użytkownika</div>
                </div>
                <div className={`navBar__menu--item`}>
                    <Link to="/" className={`navBar__menu--text navBar__menu--link`} >Kokpit</Link>
                </div>
                <div className={`navBar__menu--item`}>
                    <Link to="#" className={`navBar__menu--text navBar__menu--link`} >Projekty</Link>
                </div>
                <div className={`navBar__menu--item`}>
                    <Link to={`${authContext.userDate ? `/user/${authContext.userDate.username}` : "#" }`} className={`navBar__menu--text navBar__menu--link`} >Profil</Link>
            </div>
            <div className={`navBar__menu--item`}>
                <div className={`navBar__menu--text navBar__menu--title `}>Panel Administratora</div>
            </div>
            <div className={`navBar__menu--item`}>
                <Link to="/admin/project/new" className={`navBar__menu--text navBar__menu--link  `}>Nowy Projekt</Link>
                <Link to="/admin/user/new" className={`navBar__menu--text navBar__menu--link  `}>Nowy Pracownik</Link>
                <Link to="/admin/project" className={`navBar__menu--text navBar__menu--link  `}>Lista Projektów</Link>
                <Link to="/admin/user" className={`navBar__menu--text navBar__menu--link  `}>Lista Pracowników</Link>
            </div>
        </div>
        </div >
    )

}