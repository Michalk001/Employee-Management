import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

export const Header = () => {
    const authContext = useContext(AuthContext);

    return (

        <div className="header">
            <Link to="/" className="header__home">
                <i className="fas fa-home header__home--ico  header__home--transition"></i>
                <div className="header__home--text  header__home--transition">Strona Główna</div>
            </Link>
            <div className="header__menu">
                {authContext.isLogin && authContext.userDate && <Link to="/login" className="header__text header__text--link header__item"> {authContext.userDate.firstname} {authContext.userDate.lastname}</Link>}
                {!authContext.isLogin && <Link to="/login" className="header__text header__text--link header__item"> Zaloguj</Link>}
                {authContext.isLogin && <div className="header__text header__text--link header__item" onClick={() => authContext.LogOut()}> Wyloguj</div>}
            </div>

        </div>


    )

}