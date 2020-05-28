

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { UserReportPDF } from "../reportCreation/UserReportPDF"
import { ErrorPage } from "../common/ErrorPage";


export const UserProfile = (props) => {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false)
    const [user, setUser] = useState(null);
    const authContext = useContext(AuthContext);
    const getUser = async (id) => {
        const result = await fetch(`${config.apiRoot}/user/${id}`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        });
        const data = await result.json();
        if (result.status == 404) {
            setError({ code: 404, text: "User Not Found" })
        }
        if (data.succeeded) {
            setUser(data.user)
        }

    }

    const getPhone = (phone) => {
        if (phone != null)
            return phone
        return "Brak"
    }
    const canEditByUser = () => {

        return authContext.userDate.username == user.username
    }
    const canEditByAdmin = () => {

        return authContext.isAdmin  && authContext.userDate.username != user.username
    }
    useEffect(() => {

        getUser(props.match.params.id)

    }, [props.match.params.id])

    useEffect(() => {
        setIsLoaded(true)
    }, [user])


    return (
        <>  {error != null && <ErrorPage text={error.text} code={error.code} />}
            {user &&
                <div className="box box--large" >


                    <div className="box__item--inline box__item--full-width box__item button--edit-box">
                        {authContext.userDate.username != user.username &&
                            <Link to={{ pathname: '/message/new', reply: { user: user } }} className="button button--gap">Napisz Wiadomość</Link>}
                        {canEditByUser() && <Link to="/user/profile" className="button button--gap">EDYTUJ</Link>}
                        {canEditByAdmin() && <Link to={`/user/profile/${user.username}`} className="button button--gap">EDYTUJ</Link>}
                    </div>

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
                            <div className=" box__text--text-item box__text--vertical-center ">{getPhone(user.phone)}</div>
                        </div>
                    </div>

                    {user.projects && user.projects.find(x => { return (x.userProjects.isRemove == false && x.userProjects.isRetired == false) }) && <>
                        <div className="box__text ">Aktywne projekty: </div>
                        <div className="box--employe-list">
                            {user.projects.filter(x => { return (x.userProjects.isRetired == false) }).map((x) => (
                                <Link className="box__text  box__item box__item--employe" key={`emploact-${x.name}`} to={`/project/${x.id}`}>{x.name}</Link>
                            ))}
                        </div>
                    </>}
                    {!user.projects || !user.projects.find(x => { return (x.userProjects.isRemove == false && x.userProjects.isRetired == false) }) &&
                        <div className="box__text  box__item box--half-border-top">
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

                    <div className="box__text ">Raport</div>
                    <div className="box__item">
                        {isLoaded && user != null && <PDFDownloadLink
                            document={<UserReportPDF data={user} />}
                            fileName={`${user.firstname}-${user.lastname}.pdf`}
                            className="button"
                        >
                            {({ blob, url, loading, error }) =>
                                loading ? "Ładowanie" : "Pobierz"
                            }
                        </PDFDownloadLink>}

                    </div>
                </div>
            }</>
    )
}