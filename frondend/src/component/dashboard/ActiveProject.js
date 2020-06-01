import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

export const ActiveProject = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [activeProject, setActiveProject] = useState([]);
    const authContext = useContext(AuthContext)
    const { t, i18n } = useTranslation('common');

    const getProject = async () => {
        if (!authContext.userDate)
            return;
        const result = await fetch(`${config.apiRoot}/user/${authContext.userDate.username}`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        });
        const data = await result.json();

        if (data.succeeded) {
            const activePro = data.user.projects.filter(x => !x.userProjects.isRetired)
                .filter(x => !x.userProjects.isRemove)
                .map(x => ({
                    name: x.name,
                    idProject: x.id,
                    hours: x.userProjects.hours,
                    isRetired: x.userProjects.isRetired
                })
                )
            setActiveProject(activePro)
        }
        setIsLoading(false)
    }

    useEffect(() => {

        getProject();



    }, [authContext.userDate])

    useEffect(() => {
    }, [activeProject, authContext.userDate, isLoading])


    return (
        <div className="box">
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "></i></div>}
            <div className="dashboard__text dashboard__text--title dashboard__text--center">{t('dashboard.activProject')}</div>
            {!isLoading && <>
                {activeProject.length == 0 && <div className="dashboard__item">
                    <div className="dashboard__text dashboard__text--center">{t('dashboard.noneProject')}</div>
                </div>
                }
                {activeProject.length != 0 && <div className="dashboard__item">
                    <div className="dashboard__text dashboard__item--title ">
                        <span className="dashboard__text dashboard__text--name">{t('dashboard.name')}</span>
                        <span className="dashboard__text dashboard__text--hours-title ">{t('dashboard.hours')}</span>

                    </div>
                    <div className="box__scroll">
                        <div className="dashboard__list">
                            {activeProject.map((x, index) => (
                                <Link to={`/project/${x.idProject}`} key={`activP-${index}`} className="dashboard__item--list ">
                                    <span className="dashboard__text dashboard__text--name ">{x.name}</span>
                                    <span className="dashboard__text dashboard__text--hours ">{x.hours}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>}
            </>}
        </div>

    )

}