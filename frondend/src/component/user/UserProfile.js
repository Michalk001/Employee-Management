

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';

export const UserProfile = (props) => {

    const [user, setUser] = useState(null);
    const authContext = useContext(AuthContext);
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
                    setUser(res.user)
                    console.log(res)
                }

            })
    }




    useEffect(() => {
        const asyncEffect = async () => {
            await getUser(props.match.params.id)
        }
        asyncEffect()


    }, [props.match.params.id])

    useEffect(() => {

    }, [user])


    return (
        <>{user &&
            <div className="box box--large" >
                {(authContext.isAdmin && authContext.userDate.username != user.username) &&
                    <div className="box__item--inline box__item--full-width box__item button--edit-box">
                        <Link to={`/user/profile/${authContext.userDate.username == user.username ? `` : user.username}`} className="button button--gap">EDYTUJ PRACOWNIKA</Link>

                    </div>
                }
                {(authContext.userDate.username == user.username) &&
                    <div className="box__item--inline box__item--full-width box__item button--edit-box">
                        <Link to="/user/profile" className="button button--gap">EDYTUJ</Link>

                    </div>
                }
                <div className="box__text box__item box__text--bold">
                    {user.firstname} {user.lastname}
                </div>
                <div className=" box__item box__item--inline ">
                    <div className="box__text box__item--inline ">
                        <div className=" box__text--bold box__text--vertical-center">E-mail: </div>
                        <div className=" box__text--text-item box__text--vertical-center">{user.email}</div>
                    </div>
                    <div className="box__text box__item--inline">
                        <div className=" box__text--bold box__text--vertical-center ">Telefon: </div>
                        <div className=" box__text--text-item box__text--vertical-center ">{user.phone}</div>
                    </div>
                </div>

                {user.projects && user.projects.find(x => { return (x.userProjects.isRemove == false && x.userProjects.isRetired == false) }) && <>
                    <div className="box__text ">Aktywne projekty: </div>
                    <div className="box--employe-list  box--half-border-bottom">
                        {user.projects.filter(x => { return (x.userProjects.isRetired == false) }).map((x) => (
                            <Link className="box__text  box__item box__item--employe" key={`emploact-${x.name}`} to={`/project/${x.id}`}>{x.name}</Link>
                        ))}
                    </div>
                </>}
                {!user.projects || !user.projects.find(x => { return (x.userProjects.isRemove == false && x.userProjects.isRetired == false) }) &&
                    <div className="box__text  box__item box--half-border-bottom">
                        Brak aktywnych pojektów
                    </div>
                }

                {user.projects && user.projects.find(x => { return (x.userProjects.isRemove == false && x.userProjects.isRetired == true) }) && <>
                    <div className="box__text ">Byłe projekty: </div>
                    <div className="box--employe-list ">
                        {(user.projects.filter(xx => { return xx.userProjects.isRetired == true })).map((x) => (
                            <Link className="box__text  box__item box__item--employe" key={`emploact-${x.name}`} to={`/project/${x.id}`}>{x.name}</Link>
                        ))}
                    </div>
                </>}
            </div>
        }</>
    )
}