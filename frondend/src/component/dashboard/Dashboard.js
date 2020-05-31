import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

export const Dashboard = () => {

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
            const activePro = data.user.projects.filter(x => (!x.userProjects.isRemove || !x.userProjects.isRetired))
                .map(x => ({
                    name: x.name,
                    idProject: x.id,
                    hours: x.userProjects.hours
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
            <div className="box__text box__text--center  ">{t('dashboard.activProject')}</div>
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "></i></div>}
            {!isLoading && <>
                {activeProject.length == 0 && <div className="box__item">
                    <div className="box__text box__text--center">{t('dashboard.non')}</div>
                </div>
                }
                {activeProject.length != 0 && <div className="box__item">
                    <div className="box__text box__text--normal box__project ">
                        <span className="box__project--name-dashboard ">{t('dashboard.name')}</span>
                        <span className="box__project--hours-dashboard ">{t('dashboard.hours')}</span>

                    </div>
                    <div className="box__scroll">
                        <div className="box__project--list">
                            {activeProject.map((x, index) => (
                                <Link to={`/project/${x.idProject}`} key={`activP-${index}`} className="box__project box__project--hover">
                                    <span className="box__project--name-dashboard ">{x.name}</span>
                                    <span className="box__project--hours-dashboard ">{x.hours}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>}
            </>}
        </div>

    )

}