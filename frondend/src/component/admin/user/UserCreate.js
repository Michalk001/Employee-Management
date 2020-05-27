

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
    const [user, setUser] = useState({ isAdmin: false });
    const [isValid, setIsValid] = useState({})



    const updateUserData = e => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }


    const validPhone = (e, fun) => {
        const reg = /^\d+$/;
        if ((e.target.value.length <= 9 && reg.test(e.target.value)) || e.target.value == "") {
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
        const result = await authContext.register(user)
        const data = await result.json();

        if (data.succeeded) {
            infoBoxContext.addInfo("Utworzono pracownika");
            setUser({isAdmin: false})

        }
        else {
            if (data.code == 2)
                infoBoxContext.addInfo("Login zajęty");
            else
                infoBoxContext.addInfo("Wystąpił błąd");
        }

    }

    const isActiveRadio = (id) => {

        if (id == "isAdminTrue" && user.isAdmin == true)
            return "form-editor__radio-button--active"
        else if (id == "isAdminFalse" && user.isAdmin == false)
            return "form-editor__radio-button--active"

    }

    const updateIsAdmin = (event) => {
        if (event.target.value === "true")
            setUser({ ...user, isAdmin: true })
        else
            setUser({ ...user, isAdmin: false })
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
                        type="text" name="username" value={user.username ? user.username : ""} onChange={updateUserData} />
                </div>
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center form-editor__text--require">Hasło </div>
                    <input className={`form-editor__input form-editor__input--editor ${isValid.password == false ? `form-editor__input--require` : ""}`}
                        type="password" name="password" value={user.password ? user.password : ""} onChange={updateUserData} />
                </div>
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center ">Uprawnienie Administratora </div>
                    <div className="form-editor--inline form-editor__item--center">
                        <label className={`form-editor__radio-button ${isActiveRadio("isAdminTrue")}`} htmlFor={`isAdminTrue`}  >TAK</label><input className="form-editor__radio-button--input" id="isAdminTrue" onChange={updateIsAdmin} name="isAdmin" value={true} type="radio" />
                        <label className={`form-editor__radio-button ${isActiveRadio("isAdminFalse")}`} htmlFor={`isAdminFalse`} >NIE</label><input className="form-editor__radio-button--input" id="isAdminFalse" onChange={updateIsAdmin} name="isAdmin" value={false} type="radio" />

                    </div>
                </div>
            </div>
            <div className="box__text box__text--sub-title form-editor__item--half-border-top ">Dane Pracownika</div>
            <div className="form-editor--inline-flex-wrap ">
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center form-editor__text--require">Imie </div>
                    <input className={`form-editor__input form-editor__input--editor ${isValid.firstname == false ? `form-editor__input--require` : ""}`}
                        type="text" name="firstname" value={user.firstname ? user.firstname : ""} onChange={updateUserData} />
                </div>
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center form-editor__text--require">Nazwisko </div>
                    <input className={`form-editor__input form-editor__input--editor ${isValid.lastname == false ? `form-editor__input--require` : ""} `}
                        type="text" name="lastname" value={user.lastname ? user.lastname : ""} onChange={updateUserData} />
                </div>
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center form-editor__text--require">E-mail: </div>
                    <input className={`form-editor__input form-editor__input--editor ${isValid.email == false ? `form-editor__input--require` : ""}`}
                        type="text" name="email" value={user.email ? user.email : ""} onChange={updateUserData} />
                </div>
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center">Telefon </div>
                    <input className={`form-editor__input form-editor__input--editor`} type="text" name="phone" value={user.phone ? user.phone : ""} onChange={x => { validPhone(x, updateUserData) }} />
                </div>
            </div>
            <div className="form-editor__text form-editor__text--require-string">* Pole wymagane </div>
        </div>

    )

}