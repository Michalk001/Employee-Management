

import React, { useState, useEffect, state, useContext, useReducer, lazy, Suspense } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { ErrorPage } from "../common/ErrorPage";
import { useTranslation } from 'react-i18next';

const UserReportPDF = lazy(() => import('../reportCreation/UserReportPDF'));

export const UserProfile = (props) => {

    const { t, i18n } = useTranslation('common');

    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const authContext = useContext(AuthContext);

    const [generatePDF, setGeneratePDF] = useState(false)

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
            setError({ code: 404, text: t('common.noUserFound') })
        }
        if (data.succeeded) {
            setUser(data.user)
        }

    }

    const getPhone = (phone) => {
        if (phone != null)
            return phone
        return t('common.nonPhone')
    }
    const canEditByUser = () => {

        return authContext.userDate.username == user.username
    }
    const canEditByAdmin = () => {

        return authContext.isAdmin && authContext.userDate.username != user.username
    }
    useEffect(() => {

        getUser(props.match.params.id)

    }, [props.match.params.id])

    useEffect(() => {
        setGeneratePDF(false)
    }, [user])


    return (
        <>  {error != null && <ErrorPage text={error.text} code={error.code} />}
            {user &&
                <div className="box box--large" >


                    <div className="box__item--inline box__item--full-width box__item button--edit-box">
                        {authContext.userDate.username != user.username &&
                            <Link to={{ pathname: '/message/new', reply: { user: user } }} className="button button--gap">{t('message.write')}</Link>}
                        {canEditByUser() && <Link to="/user/profile" className="button button--gap">{t('button.edit')}</Link>}
                        {canEditByAdmin() && <Link to={`/user/profile/${user.username}`} className="button button--gap">{t('button.edit')}</Link>}
                    </div>

                    <div className="box__text box__item box__text--bold">
                        {user.firstname} {user.lastname}
                    </div>
                    <div className=" box__item box__item--inline ">
                        <div className="box__text box__item--inline ">
                            <div className=" box__text--bold ">{t('user.email')}: </div>
                            <div className=" box__text--text-item ">{user.email}</div>
                        </div>
                        <div className="box__text box__item--inline">
                            <div className=" box__text--bold ">{t('user.phone')}: </div>
                            <div className=" box__text--text-item ">{getPhone(user.phone)}</div>
                        </div>
                    </div>

                    {user.projects && user.projects.find(x => { return (x.userProjects.isRemove == false && x.userProjects.isRetired == false) }) && <>
                        <div className="box__text ">{t('dashboard.activProject')}: </div>
                        <div className="box--employe-list">
                            {user.projects.filter(x => { return (x.userProjects.isRetired == false) }).map((x) => (
                                <Link className="box__text  box__item box__item--employe" key={`emploact-${x.name}`} to={`/project/${x.id}`}>{x.name}</Link>
                            ))}
                        </div>
                    </>}
                    {!user.projects || !user.projects.find(x => { return (x.userProjects.isRemove == false && x.userProjects.isRetired == false) }) &&
                        <div className="box__text  box__item box--half-border-top">
                            {t('common.lackInactiveProject')}
                        </div>
                    }

                    {user.projects && user.projects.find(x => { return (x.userProjects.isRemove == false && x.userProjects.isRetired == true) }) && <>
                        <div className="box__text ">  {t('common.inactiveProject')}: </div>
                        <div className="box--employe-list ">
                            {(user.projects.filter(xx => { return xx.userProjects.isRetired == true })).map((x) => (
                                <Link className="box__text  box__item box__item--employe" key={`emploact-${x.name}`} to={`/project/${x.id}`}>{x.name}</Link>
                            ))}
                        </div>
                    </>}

                    <div className="box__text "> {t('common.report')}</div>
                    <div className="box__item">

                        {!generatePDF && <div className="button" onClick={() => setGeneratePDF(true)}> {t('button.generatePDF')}</div>}

                        {generatePDF && user != null && <Suspense fallback={<div className="button">{t('common.loading')}</div>}>
                            <UserReportPDF Doc={UserReportPDF} data={user} name={`${user.firstname}-${user.lastname}`} />
                        </Suspense>}
                    </div>
                </div>
            }</>
    )
}

