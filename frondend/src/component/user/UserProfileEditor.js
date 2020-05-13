

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';


import { InfoBoxContext } from '../../context/InfoBox/InfoBoxContext';
import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';

export const UserProfileEditor = (props) => {

    const [user, setUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const authContext = useContext(AuthContext);

    const infoBoxContext = useContext(InfoBoxContext);

    const getUser = async (id) => {
        await fetch(`${config.apiRoot}/user/${id}`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.succeeded) {
                    setEditUser(res.user)
                    setUser(res.user)

                }

            })
    }

    const updateEditUser = (x) => {
        setEditUser({ ...editUser, [x.name]: x.value })
    }

    const validPhoneField = (e, fun) => {
        const reg = /^\d+$/;
        if ((e.value.length <= 9 && reg.test(e.value)) || e.value == "") {
            fun(e);
        }

    }

    const cancelEdit = () => {
        setEditUser(user)
    }

    const saveEdit = async () => {

        await fetch(`${config.apiRoot}/user/${user.username}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ user: { firstname: editUser.firstname, lastname: editUser.lastname, phone: editUser.phone, email: editUser.email } })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.succeeded) {
                    setUser(editUser);
                    authContext.refreshToken();
                    infoBoxContext.addInfo("Zaktualizowano dane pracownika");
                }
                else {
                    infoBoxContext.addInfo("Wystąpił błąd");
                }

            })
    }



    useEffect(() => {
        console.log(props.match.params.id);
        if (props.match.params.id)
            getUser(props.match.params.id)
        else if (authContext.userDate && authContext.userDate.username)
            getUser(authContext.userDate.username)

    }, [authContext.userDate, props.match.params.id])

    useEffect(() => {
        console.log(user)
    }, [user, editUser])


    return (
        <>{user &&
            <div className="box box--large" >

                <div className="box__item--inline box__item--full-width box__item button--edit-box">
                    {authContext.isAdmin &&
                        <div className="button button--gap button--remove">Zarchiwizuj</div>
                    }
                    <div onClick={() => infoBoxContext.Confirm("Czy napewno chcesz zapisać?", () => (saveEdit()))} className="button button--gap button--save">Zapisz</div>
                    <div onClick={() => infoBoxContext.Confirm("Czy napewno chcesz anulować?", () => (cancelEdit()))} className="button button--gap button--remove">Anuluj</div>
                    <Link to={`/user/${authContext.userDate.username}`} className="button button--gap">Profil</Link>
                </div>


                <div className="box__item">
                    <div className="box__text box__item--inline box__item--user-edit-mode  ">
                        <div className="box__text box__text--bold">Imie: </div>
                        <input className="box__input box__input--user-edit" name="firstname" onChange={(x) => updateEditUser(x.target)} value={editUser.firstname} />
                    </div>

                    <div className="box__text box__item--inline box__item--user-edit-mode">
                        <div className="box__text box__text--bold">Nazwisko: </div>
                        <input className="box__input box__input--user-edit" name="lastname" onChange={(x) => updateEditUser(x.target)} value={editUser.lastname} />
                    </div>

                    <div className="box__text box__item--inline box__item--user-edit-mode ">
                        <div className=" box__text--bold box__text--vertical-center">E-mail: </div>
                        <input className="box__input box__input--user-edit" name="email" onChange={(x) => updateEditUser(x.target)} value={editUser.email} />
                    </div>

                    <div className="box__text box__item--inline box__item--user-edit-mode">
                        <div className=" box__text--bold box__text--vertical-center ">Telefon: </div>
                        <input className="box__input box__input--user-edit" name="phone" onChange={(x) => validPhoneField(x.target, x => updateEditUser(x))} value={editUser.phone} />
                    </div>
                </div>
                {authContext.userDate.username == user.username && <>
                    <div className=" box__item ">
                        <div className="box__text  box__text--bold box__text--vertical-center">Zmiana Hasła: </div>
                        <div className="box__item--inline ">
                            <div className="box__item    box__item--user-edit-mode">
                                <div className="box__text box__text--bold box__text--vertical-center ">Stare Hasła: </div>
                                <input className="box__input box__input--user-edit" type="password" name="phone" />
                            </div>
                            <div className="box__item  box__item--user-edit-mode">
                                <div className="box__text box__text--bold box__text--vertical-center ">Nowe Hasła: </div>
                                <input className="box__input box__input--user-edit" type="password" name="phone" />
                            </div>
                        </div>
                    </div>
                    <div className="box__item">
                        <div className="button button--gap button--save">Zmień hasło</div>
                    </div>
                </>}
            </div>
        }</>
    )
}