
import React, { useState, useEffect, state, useReducer, useContext } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";

export const NavBar = () => {

    const [hiddeMenu, setHiddeMenu] = useState(false);
    const authContext = useContext(AuthContext);

    return (
        <div className={`navBar navBar--${hiddeMenu ? `close` : `open`} `}>
            <div className="navBar__arrows">
                <i className={`fas fa-arrow-circle-left navBar__arrows--style navBar__arrows--${hiddeMenu ? `close` : `open`}`} onClick={x => setHiddeMenu(!hiddeMenu)} ></i>
            </div>
            <div className={`navBar__menu ${hiddeMenu ? ` navBar__menu--close` : ``} `}>
                <div className={`navBar__menu--item`}>
                    <Link to="#" className={`navBar__menu--text navBar__menu--link`} >TEST</Link>
                </div>
                <div className={`navBar__menu--item`}>
                    <Link to="#" className={`navBar__menu--text navBar__menu--link  `}>TEST 2</Link>
                </div>
            </div>
        </div >
    )

}