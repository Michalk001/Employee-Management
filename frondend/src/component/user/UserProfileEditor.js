import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom';


import {InfoBoxContext} from '../../context/InfoBox/InfoBoxContext';
import {AuthContext} from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';
import {ErrorPage} from "../common/ErrorPage";
import {useTranslation} from "react-i18next";
import {Fetch, FetchGet} from "../../models/Fetch";
import {UserEditValid, UserNewValid, UserPasswordValid, validPhone} from "../../models/ValidForm";

export const UserProfileEditor = (props) => {

    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [editUser, setEditUser] = useState({});
    const [isValid, setIsValid] = useState({})
    const [passEdit, setPassEdit] = useState({oldPassword: "", newPassword: ""})
    const [passIsValid, setPassIsValid] = useState({oldPassword: true, newPassword: true})
    const authContext = useContext(AuthContext);
    const {t} = useTranslation('common');
    const infoBoxContext = useContext(InfoBoxContext);

    const getUser = async (id) => {

        const result = await FetchGet(`${config.apiRoot}/user/${id}`)

        if (result.status === 404) {
            setError({code: 404, text: t('infoBox.userNotFound')})
        }
        const data = await result.json();
        if (data.succeeded) {
            setEditUser(data.user)
            setUser(data.user)

        }
    }

    const updateEditUser = (event) => {
        setEditUser({...editUser, [event.target.name]: event.target.value})
    }
    const updatePassEdit = (event) => {
        setPassEdit({...passEdit, [event.target.name]: event.target.value})
    }

    const valid = () => {
        const resultValid = UserEditValid(user);
        if (!resultValid.isOK) {
            infoBoxContext.addListInfo([], t('infoBox.require'));
        }
        setIsValid(resultValid.valid);
        return valid.isOK
    }


    const cancelEdit = () => {
        setEditUser(user)
    }

    const saveEdit = async () => {
        if (!valid())
            return
        const body = JSON.stringify({
            user: {
                firstname: editUser.firstname,
                lastname: editUser.lastname,
                phone: editUser.phone,
                email: editUser.email
            }
        })
        const result = await Fetch(`${config.apiRoot}/user/${user.username}`, "put", body)
        const data = await result.json();
        if (data.succeeded) {
            setUser(editUser);
            authContext.refreshToken();
            infoBoxContext.addInfo(t('infoBox.updated'), 3);
        } else {
            infoBoxContext.addInfo(t('infoBox.error'), 3);
        }
    }

    const validPassword = () => {

        const resultValid = UserPasswordValid(user);
        if (!resultValid.isOK) {
            const errorList = []
            if (resultValid.valid.password === false) {
                errorList.push(`${t('infoBox.errorPass')} ${config.users.passwordChar} ${t('infoBox.errorChar')}`)
            }
            infoBoxContext.addListInfo(errorList, t('infoBox.require'));
        }
        setPassIsValid(resultValid.valid);
        return valid.isOK
    }


    const changePassword = async () => {
        if (!validPassword())
            return
        setPassIsValid({oldPassword: true, newPassword: true})
        const body = JSON.stringify({password: {oldPassword: passEdit.oldPassword, newPassword: passEdit.oldPassword}});
        const result = await Fetch(`${config.apiRoot}/account/changePassword/${user.username}`, "put", body)
        const data = await result.json();
        if (data.succeeded) {
            setPassEdit({oldPassword: "", newPassword: ""})
            authContext.refreshToken();
            infoBoxContext.addInfo(t('infoBox.changePass'), 3);
        } else {
            if (data.code === 2) {
                infoBoxContext.addInfo(t('infoBox.wrongPass'));
                setPassIsValid({...passIsValid, oldPassword: false})
            } else
                infoBoxContext.addInfo(t('infoBox.error'), 3);
        }

    }

    const archiveUser = async (isRetired) => {
        const result = await Fetch(`${config.apiRoot}/user/${user.username}`, "put", JSON.stringify({user: {isRetired}}))
        const data = await result.json();

        if (data.succeeded) {
            setUser({...user, isRetired})
            setEditUser({...user, isRetired})
            if (isRetired)
                infoBoxContext.addInfo(t('infoBox.archiveUser'), 3);
            else
                infoBoxContext.addInfo(t('infoBox.restoreUser'), 3);
        } else {
            infoBoxContext.addInfo(t('infoBox.error'), 3);
        }

    }

    useEffect(() => {

        if (props.match.params.id)
            getUser(props.match.params.id)
        else if (authContext.userDate && authContext.userDate.username)
            getUser(authContext.userDate.username)

        document.title = t('title.editEmployee')
    }, [authContext.userDate, props.match.params.id])

    useEffect(() => {

    }, [user, editUser, isValid, passIsValid, passEdit])

    const validInput = (field) => {
        return field === false ? ` box__input--require` : ""
    }


    const getValueOrOther = (value, other = "") => {
        if (value)
            return value;
        return other;
    }


    return (
        <> {error != null && <ErrorPage text={error.text} code={error.code}/>}
            {user &&
            <div className="box box--large">
                {user.isRetired &&
                <div className="form-editor__text form-editor__text--archive-small">{t('infoBox.archive')} </div>}
                <div className="box__item--inline box__item--full-width box__item button--edit-box">
                    {authContext.isAdmin && <>
                        {!user.isRetired && <button className="button button--gap button--remove"
                                                    onClick={() => infoBoxContext.Confirm(t('infoBox.archiveUserConfirm'), () => archiveUser(true))}>{t('button.archive')}</button>}
                        {user.isRetired && <button className="button button--gap button--remove"
                                                   onClick={() => infoBoxContext.Confirm(t('infoBox.restoreUserConfirm'), () => archiveUser(false))}>{t('button.restore')}</button>}
                    </>}
                    <button onClick={() => infoBoxContext.Confirm(t('infoBox.saveEdit'), () => (saveEdit()))}
                            className="button button--gap button--save">{t('button.save')}</button>
                    <button onClick={() => infoBoxContext.Confirm(t('infoBox.cancelEdit'), () => (cancelEdit()))}
                            className="button button--gap button--remove">{t('button.cancel')}</button>
                    <Link to={`/user/${user.username}`} className="button button--gap">{t('button.profile')}</Link>
                </div>


                <div className="box__item">
                    <div className="box__item--inline box__item--user-edit-mode  ">
                        <div className="box__text box__text--require">{t('user.firstName')} </div>
                        <input className={`box__input box__input--user-edit ${validInput(isValid.firstname)}`}
                               id="firstnameEdit" name="firstname"
                               onChange={updateEditUser} value={getValueOrOther(editUser.firstname)}/>
                    </div>

                    <div className=" box__item--inline box__item--user-edit-mode">
                        <div className="box__text box__text--require">{t('user.lastName')} </div>
                        <input className={`box__input box__input--user-edit ${validInput(isValid.lastname)}`}
                               id="lastnameEdit" name="lastname"
                               onChange={updateEditUser} value={getValueOrOther(editUser.lastname)}/>
                    </div>

                    <div className=" box__item--inline box__item--user-edit-mode ">
                        <div className="box__text  box__text--require">{t('user.email')}</div>
                        <input className={`box__input box__input--user-edit  ${validInput(isValid.email)}`}
                               id="emailEdit" name="email"
                               onChange={updateEditUser} value={getValueOrOther(editUser.email)}/>
                    </div>

                    <div className=" box__item--inline box__item--user-edit-mode">
                        <div className=" box__text ">{t('user.phone')} </div>
                        <input className="box__input box__input--user-edit" id="phoneEdit" name="phone"
                               onChange={validPhone} value={getValueOrOther(editUser.phone)}/>
                    </div>
                </div>
                {authContext.userDate.username === user.username && <>
                    <div className=" box__item ">
                        <div className="box__text  box__text--bold box--half-border-top">{t('user.changePass')}</div>
                        <div className="box__item--inline ">
                            <div className="box__item box__item--user-edit-mode">
                                <div className="box__text  box__text--require">{t('user.oldPass')}</div>
                                <input
                                    className={`box__input box__input--user-edit ${validInput(passIsValid.oldPassword)}`}
                                    id="oldPassEdit" type="password" name="oldPassword"
                                    value={getValueOrOther(passEdit.oldPassword)} onChange={updatePassEdit}/>
                            </div>
                            <div className="box__item  box__item--user-edit-mode">
                                <div className="box__text  box__text--require">{t('user.newPass')}</div>
                                <input
                                    className={`box__input box__input--user-edit ${validInput(passIsValid.newPassword)}`}
                                    id="newPassEdit" type="password" name="newPassword"
                                    value={getValueOrOther(passEdit.newPassword)} onChange={updatePassEdit}/>
                            </div>
                        </div>
                    </div>
                    <div className="box__item">
                        <button className="button button--gap button--save" onClick={() => {
                            changePassword()
                        }}>{t('button.changePass')}</button>
                    </div>
                </>}
                <div className="form-editor__text form-editor__text--require-string">* {t('common.require')} </div>
            </div>
            }</>
    )
}