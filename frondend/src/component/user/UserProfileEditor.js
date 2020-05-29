

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';


import { InfoBoxContext } from '../../context/InfoBox/InfoBoxContext';
import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { ErrorPage } from "../common/ErrorPage";
import { useTranslation } from "react-i18next";

export const UserProfileEditor = (props) => {

    const passCharCount = 3;
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [editUser, setEditUser] = useState([]);
    const [isValid, setIsValid] = useState({})
    const [passEdit, setPassEdit] = useState({ oldPassword: "", newPassword: "" })
    const [passIsValid, setPassIsValid] = useState({ oldPassword: true, newPassword: true })
    const authContext = useContext(AuthContext);
    const { t, i18n } = useTranslation('common');
    const infoBoxContext = useContext(InfoBoxContext);

    const getUser = async (id) => {
        const result = await fetch(`${config.apiRoot}/user/${id}`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        });
        if (result.status == 404) {
            setError({ code: 404, text: t('infoBox.userNotFound') })
        }
        const data = await result.json();
        if (data.succeeded) {
            setEditUser(data.user)
            setUser(data.user)

        }
    }

    const updateEditUser = (event) => {
        setEditUser({ ...editUser, [event.target.name]: event.target.value })
    }
    const updatePassEdit = (event) => {
        setPassEdit({ ...passEdit, [event.target.name]: event.target.value })
    }
    const validPhone = (event) => {
        const reg = /^\d+$/;
        if ((e.target.value.length <= 9 && reg.test(e.target.value)) || e.target.value == "") {
            updateEditUser(event)
        }
    }

    function validEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const valid = () => {
        let isOK = true;
        let valid = {};
        let errorList = [];
        if (!editUser.firstname || editUser.firstname.replace(/ /g, '') == '') {
            valid.firstname = false;
            isOK = false;
        }
        if (!editUser.lastname || editUser.lastname.replace(/ /g, '') == '') {
            valid.lastname = false;
            isOK = false;
        }

        if (!editUser.email || editUser.email.replace(/ /g, '') == '') {
            valid.email = false;
            isOK = false;
        }
        if (editUser.email) {

            if (!validEmail(editUser.email)) {
                valid.email = false;
                isOK = false;
            }
        }
        setIsValid(valid);
        if (!isOK)
            infoBoxContext.addListInfo(errorList,  t('infoBox.require'));
        return isOK
    }


    const cancelEdit = () => {
        setEditUser(user)
    }

    const saveEdit = async () => {
        if (!valid())
            return
        const result = await fetch(`${config.apiRoot}/user/${user.username}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ user: { firstname: editUser.firstname, lastname: editUser.lastname, phone: editUser.phone, email: editUser.email } })
        });
        const data = await result.json();
        if (data.succeeded) {
            setUser(editUser);
            authContext.refreshToken();
            infoBoxContext.addInfo( t('infoBox.updated'));
        }
        else {
            infoBoxContext.addInfo(t('infoBox.error'));
        }
    }

    const validPassword = () => {
        let isOK = true;
        let valid = { oldPassword: true, newPassword: true };
        let errorList = [];
        if (passEdit.oldPassword.replace(/ /g, '') == '') {
            valid.oldPassword = false
            isOK = false;
        }
        if (passEdit.newPassword.replace(/ /g, '') == '') {
            valid.newPassword = false
            isOK = false;
        }
        else if (passEdit.newPassword.length <= passCharCount) {
            valid.newPassword = false
            isOK = false;
            errorList.push(`${t('infoBox.errorPass')} ${passCharCount} ${t('infoBox.errorChar')}`)

        }

        setPassIsValid(valid)
        if (!isOK)
            infoBoxContext.addListInfo(errorList, t('infoBox.require'));
        return isOK;
    }

    const changePassword = async () => {
        if (!validPassword())
            return
        setPassIsValid({ oldPassword: true, newPassword: true })
        const result = await fetch(`${config.apiRoot}/account/changePassword/${user.username}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ password: { oldPassword: passEdit.oldPassword, newPassword: passEdit.oldPassword } })
        });

        const data = await result.json();
        if (data.succeeded) {
            setPassEdit({ oldPassword: "", newPassword: "" })
            authContext.refreshToken();
            infoBoxContext.addInfo(t('infoBox.changePass'));
        }
        else {
            if (data.code == 2) {
                infoBoxContext.addInfo(t('infoBox.wrongPass'));
                setPassIsValid({ ...passIsValid, oldPassword: false })
            }
            else
                infoBoxContext.addInfo(t('infoBox.error'));
        }

    }

    const archiveUser = async (isRetired) => {
        if (!valid())
            return

        const result = await fetch(`${config.apiRoot}/user/${user.username}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ user: { isRetired } })
        });

        const data = await result.json();
        if (data.succeeded) {
            setUser({ ...user, isRetired })
            setEditUser({ ...user, isRetired })
            if (isRetired)
                infoBoxContext.addInfo(t('infoBox.archiveUser'));
            else
                infoBoxContext.addInfo(t('infoBox.restoreUser'));
        }
        else {
            infoBoxContext.addInfo(t('infoBox.error'));
        }

    }

    useEffect(() => {

        if (props.match.params.id)
            getUser(props.match.params.id)
        else if (authContext.userDate && authContext.userDate.username)
            getUser(authContext.userDate.username)


    }, [authContext.userDate, props.match.params.id])

    useEffect(() => {

    }, [user, editUser, isValid, passIsValid, passEdit])

    const validInput = (field) => {
        return field == false ? ` box__input--require` : ""
    }


    const getValueOrOther = (value, other = "") => {
        if (value)
            return value;
        return other;
    }


    return (
        <> {error != null && <ErrorPage text={error.text} code={error.code} />}
            {user &&
                <div className="box box--large" >
                    {user.isRetired && <div className="form-editor__text form-editor__text--archive-small">{t('infoBox.archive')} </div>}
                    <div className="box__item--inline box__item--full-width box__item button--edit-box">
                        {authContext.isAdmin && <>
                            {!user.isRetired && <button className="button button--gap button--remove" onClick={() => archiveUser(true)}>{t('button.archive')}</button>}
                            {user.isRetired && <button className="button button--gap button--remove" onClick={() => archiveUser(false)}>{t('button.restore')}</button>}
                        </>}
                        <button onClick={() => infoBoxContext.Confirm("Czy napewno chcesz zapisać?", () => (saveEdit()))} className="button button--gap button--save">{t('button.save')}</button>
                        <button onClick={() => infoBoxContext.Confirm("Czy napewno chcesz anulować edycje?", () => (cancelEdit()))} className="button button--gap button--remove">{t('button.cancel')}</button>
                        <Link to={`/user/${user.username}`} className="button button--gap">{t('button.profile')}</Link>
                    </div>


                    <div className="box__item">
                        <div className="box__item--inline box__item--user-edit-mode  ">
                            <div className="box__text box__text--require">{t('user.firstname')} </div>
                            <input className={`box__input box__input--user-edit ${validInput(isValid.firstname)}`} name="firstname"
                                onChange={updateEditUser} value={getValueOrOther(editUser.firstname)} />
                        </div>

                        <div className=" box__item--inline box__item--user-edit-mode">
                            <div className="box__text box__text--require">{t('user.lastname')} </div>
                            <input className={`box__input box__input--user-edit ${validInput(isValid.lastname)}`} name="lastname"
                                onChange={updateEditUser} value={getValueOrOther(editUser.lastname)} />
                        </div>

                        <div className=" box__item--inline box__item--user-edit-mode ">
                            <div className="box__text  box__text--require">{t('user.email')}</div>
                            <input className={`box__input box__input--user-edit  ${validInput(isValid.email)}`} name="email"
                                onChange={updateEditUser} value={getValueOrOther(editUser.email)} />
                        </div>

                        <div className=" box__item--inline box__item--user-edit-mode">
                            <div className=" box__text ">{t('user.phone')} </div>
                            <input className="box__input box__input--user-edit" name="phone" onChange={validPhone} value={getValueOrOther(editUser.phone)} />
                        </div>
                    </div>
                    {authContext.userDate.username == user.username && <>
                        <div className=" box__item ">
                            <div className="box__text  box__text--bold box--half-border-top">{t('user.changePass')}</div>
                            <div className="box__item--inline ">
                                <div className="box__item box__item--user-edit-mode">
                                    <div className="box__text  box__text--require">{t('user.oldPass')}</div>
                                    <input className={`box__input box__input--user-edit ${validInput(passIsValid.oldPassword)}`} type="password" name="oldPassword"
                                        value={getValueOrOther(passEdit.oldPassword)} onChange={updatePassEdit} />
                                </div>
                                <div className="box__item  box__item--user-edit-mode">
                                    <div className="box__text  box__text--require">{t('user.newPass')}</div>
                                    <input className={`box__input box__input--user-edit ${validInput(passIsValid.newPassword)}`} type="password" name="newPassword"
                                        value={getValueOrOther(passEdit.newPassword)} onChange={updatePassEdit} />
                                </div>
                            </div>
                        </div>
                        <div className="box__item">
                            <button className="button button--gap button--save" onClick={() => { changePassword() }}>{t('button.changePass')}</button>
                        </div>
                    </>}
                    <div className="form-editor__text form-editor__text--require-string">* {t('common.require')} </div>
                </div>
            }</>
    )
}