

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import { InfoBoxContext } from '../../../context/InfoBox/InfoBoxContext';
import config from '../../../config.json'
import Cookies from 'js-cookie';
import { Project } from "../../user/Project";
import Select from 'react-select'



export const UserCreate = (props) => {


    const passCharCount = 3;

    const infoBoxContext = useContext(InfoBoxContext);
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [isValid, setIsValid] = useState({})



    const updateUserData = e => {
        setUser({ ...user, [e.name]: e.value })
    }

    
    const validPhone = (e, fun) => {
        const reg = /^\d+$/;
        if ((e.value.length <= 9 && reg.test(e.value)) || e.value == "") {
            fun(e);
        }
    }

    function validEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const valid = () => {
        let isOK = true;
        let valid = {};
        let errorList = [];
        if (!user.firstname || user.firstname.replace(/ /g, '') == '') {
            valid.firstname = false;
            isOK = false;
        }
        if (!user.lastname || user.lastname.replace(/ /g, '') == '') {
            valid.lastname = false;
            isOK = false;
        }
        if (!user.username || user.username.replace(/ /g, '') == '') {
            valid.username = false;
            isOK = false;
        }
        if (!user.email || user.email.replace(/ /g, '') == '') {
            valid.email = false;
            isOK = false;
        }
        if (user.email) {

            if (!validEmail(user.email)) {
                valid.email = false;
                isOK = false;
            }
        }
        if (!user.password || user.password.replace(/ /g, '') == '') {
            valid.password = false
            isOK = false;
        } else {

            if (user.password.length <= passCharCount) {
                valid.password = false
                errorList.push(`Hasło wymaga minimum ${passCharCount} znaki`)
            }
        }
        setIsValid(valid);
        if (!isOK)
            infoBoxContext.addListInfo(errorList, "Zaznaczone pola są wymagane");
        return isOK
    }

    const createUser = async () => {
        if (!valid()) {
            return
        }
        await authContext.register(user, setUser).then(res => console.log(res))
    }


    useEffect(() => {

    }, [user, isValid])


    return (
        <div className="box box--large">
            <div className="form-editor--inline box__item button--edit-box">
                <div className="button button--save button--gap" onClick={() => createUser()}>Utwórz</div>

            </div>
            <div className="box__text box__text--sub-title">Dane Logowania</div>
            <div className="form-editor--inline-flex-wrap ">
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center form-editor__text--require">Login </div>
                    <input className={`form-editor__input form-editor__input--editor ${isValid.username == false ? `form-editor__input--require` : ""}`}
                        type="text" name="username" value={user.username ? user.username : ""} onChange={x => updateUserData(x.target)} />
                </div>
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center form-editor__text--require">Hasło </div>
                    <input className={`form-editor__input form-editor__input--editor ${isValid.password == false ? `form-editor__input--require` : ""}`}
                        type="password" name="password" value={user.password ? user.password : ""} onChange={x => updateUserData(x.target)} />
                </div>
            </div>
            <div className="box__text box__text--sub-title form-editor__item--half-border-top ">Dane Pracownika</div>
            <div className="form-editor--inline-flex-wrap ">
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center form-editor__text--require">Imie </div>
                    <input className={`form-editor__input form-editor__input--editor ${isValid.firstname == false ? `form-editor__input--require` : ""}`}
                        type="text" name="firstname" value={user.firstname ? user.firstname : ""} onChange={x => updateUserData(x.target)} />
                </div>
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center form-editor__text--require">Nazwisko </div>
                    <input className={`form-editor__input form-editor__input--editor ${isValid.lastname == false ? `form-editor__input--require` : ""} `}
                        type="text" name="lastname" value={user.lastname ? user.lastname : ""} onChange={x => updateUserData(x.target)} />
                </div>
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center form-editor__text--require">E-mail: </div>
                    <input className={`form-editor__input form-editor__input--editor ${isValid.email == false ? `form-editor__input--require` : ""}`}
                        type="text" name="email" value={user.email ? user.email : ""} onChange={x => updateUserData(x.target)} />
                </div>
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center">Telefon </div>
                    <input className={`form-editor__input form-editor__input--editor`} type="text" name="phone" value={user.phone ? user.phone : ""} onChange={x => { validPhone(x.target, x => updateUserData(x)) }} />
                </div>
            </div>
            <div className="form-editor__text form-editor__text--require-string">* Pole wymagane </div>
        </div>

    )

}