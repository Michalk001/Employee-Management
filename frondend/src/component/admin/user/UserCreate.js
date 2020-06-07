import React, {useState, useEffect, useContext} from "react";


import {AuthContext} from '../../../context/AuthContext';
import {InfoBoxContext} from '../../../context/InfoBox/InfoBoxContext';
import config from '../../../config.json'
import {useTranslation} from "react-i18next";


export const UserCreate = () => {


    const {t} = useTranslation('common');
    const infoBoxContext = useContext(InfoBoxContext);
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState({isAdmin: false});
    const [isValid, setIsValid] = useState({})


    const updateUserData = e => {
        setUser({...user, [e.target.name]: e.target.value})
    }


    const validPhone = (e, fun) => {
        const reg = /^\d+$/;
        if ((e.target.value.length <= 9 && reg.test(e.target.value)) || e.target.value === "") {
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
        if (!user.firstname || user.firstname.replace(/ /g, '') === '') {
            valid.firstname = false;
            isOK = false;
        }
        if (!user.lastname || user.lastname.replace(/ /g, '') === '') {
            valid.lastname = false;
            isOK = false;
        }
        if (!user.username || user.username.replace(/ /g, '') === '') {
            valid.username = false;
            isOK = false;
        }
        if (!user.email || user.email.replace(/ /g, '') === '') {
            valid.email = false;
            isOK = false;
        }
        if (user.email) {

            if (!validEmail(user.email)) {
                valid.email = false;
                isOK = false;
            }
        }
        if (!user.password || user.password.replace(/ /g, '') === '') {
            valid.password = false
            isOK = false;
        } else {

            if (user.password.length < config.users.passwordChar) {
                valid.password = false
                errorList.push(`${t('infoBox.errorPass')} ${config.users.passwordChar} ${t('infoBox.errorChar')}`)
            }
        }
        setIsValid(valid);
        if (!isOK)
            infoBoxContext.addListInfo(errorList, t('infoBox.require'));
        return isOK
    }

    const createUser = async () => {
        if (!valid()) {
            return
        }
        const result = await authContext.register(user)
        const data = await result.json();

        if (data.succeeded) {
            infoBoxContext.addInfo(t('infoBox.createUser'), 3);
            setUser({isAdmin: false})

        } else {
            if (data.code === 2)
                infoBoxContext.addInfo(t('infoBox.busyLogin'), 3);
            else
                infoBoxContext.addInfo(t('infoBox.error'), 3);
        }

    }

    const isActiveRadio = (id) => {

        if (id === "isAdminTrue" && user.isAdmin)
            return "form-editor__radio-button--active"
        else if (id === "isAdminFalse" && !user.isAdmin)
            return "form-editor__radio-button--active"

    }

    const updateIsAdmin = (event) => {
        if (event.target.value === "true")
            setUser({...user, isAdmin: true})
        else
            setUser({...user, isAdmin: false})
    }

    useEffect(() => {

    }, [user, isValid])


    useEffect(() => {
        document.title = t('title.newEmployee')
    }, [])

    return (
        <div className="box box--large">
            <div className="form-editor--inline box__item button--edit-box">
                <div className="button button--save button--gap" onClick={() => createUser()}>{t('button.create')}</div>

            </div>
            <div className="box__text box__text--sub-title"> {t('user.dateLogin')}</div>
            <div className="form-editor--inline-flex-wrap ">
                <div className="form-editor__item--input-box">
                    <div
                        className="form-editor__text form-editor__text--vertical-center form-editor__text--require">{t('user.login')} </div>
                    <input
                        className={`form-editor__input form-editor__input--editor ${isValid.username === false? `form-editor__input--require` : ""}`}
                        type="text" id="loginCreate" name="username" value={user.username ? user.username : ""}
                        onChange={updateUserData}/>
                </div>
                <div className="form-editor__item--input-box">
                    <div
                        className="form-editor__text form-editor__text--vertical-center form-editor__text--require">{t('user.password')} </div>
                    <input
                        className={`form-editor__input form-editor__input--editor ${isValid.password === false ? `form-editor__input--require` : ""}`}
                        type="password" id="passCreate" name="password" value={user.password ? user.password : ""}
                        onChange={updateUserData}/>
                </div>
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center ">{t('user.admin')}</div>
                    <div className="form-editor--inline  form-editor__item--admin-access ">
                        <label className={`form-editor__radio-button ${isActiveRadio("isAdminTrue")}`}
                               htmlFor={`isAdminTrue`}>{t('user.yes')}</label><input
                        className="form-editor__radio-button--input" id="isAdminTrue" onChange={updateIsAdmin}
                        name="isAdmin" value={true} type="radio"/>
                        <label className={`form-editor__radio-button ${isActiveRadio("isAdminFalse")}`}
                               htmlFor={`isAdminFalse`}>{t('user.no')}</label><input
                        className="form-editor__radio-button--input" id="isAdminFalse" onChange={updateIsAdmin}
                        name="isAdmin" value={false} type="radio"/>

                    </div>
                </div>
            </div>
            <div
                className="box__text box__text--sub-title form-editor__item--half-border-top "> {t('user.userData')}</div>
            <div className="form-editor--inline-flex-wrap ">
                <div className="form-editor__item--input-box">
                    <div
                        className="form-editor__text form-editor__text--vertical-center form-editor__text--require">{t('user.firstName')} </div>
                    <input
                        className={`form-editor__input form-editor__input--editor ${isValid.firstname === false ? `form-editor__input--require` : ""}`}
                        type="text" id="firstnameCreate" name="firstname" value={user.firstname ? user.firstname : ""}
                        onChange={updateUserData}/>
                </div>
                <div className="form-editor__item--input-box">
                    <div
                        className="form-editor__text form-editor__text--vertical-center form-editor__text--require">{t('user.lastName')} </div>
                    <input
                        className={`form-editor__input form-editor__input--editor ${isValid.lastname === false ? `form-editor__input--require` : ""} `}
                        type="text" id="lastnameCreate" name="lastname" value={user.lastname ? user.lastname : ""}
                        onChange={updateUserData}/>
                </div>
                <div className="form-editor__item--input-box">
                    <div
                        className="form-editor__text form-editor__text--vertical-center form-editor__text--require">{t('user.email')} </div>
                    <input
                        className={`form-editor__input form-editor__input--editor ${isValid.email === false ? `form-editor__input--require` : ""}`}
                        type="text" id="emailCreate" name="email" value={user.email ? user.email : ""}
                        onChange={updateUserData}/>
                </div>
                <div className="form-editor__item--input-box">
                    <div className="form-editor__text form-editor__text--vertical-center">{t('user.phone')} </div>
                    <input className={`form-editor__input form-editor__input--editor`} id="phoneCreate" type="text"
                           name="phone" value={user.phone ? user.phone : ""}
                           onChange={x => {
                               validPhone(x, updateUserData)
                           }}/>
                </div>
            </div>
            <div className="form-editor__text form-editor__text--require-string">* {t('common.require')} </div>
        </div>

    )

}