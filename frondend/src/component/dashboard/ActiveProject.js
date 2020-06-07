import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import { useTranslation } from 'react-i18next';
import {FetchGet} from "../../models/Fetch";

export const ActiveProject = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [activeProject, setActiveProject] = useState([]);
    const authContext = useContext(AuthContext)
    const { t} = useTranslation('common');

    const getProject = async (signal) => {
        if (!authContext.userDate)
            return;
        const result = await FetchGet(`${config.apiRoot}/user/${authContext.userDate.username}`,signal);
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
        const abortController = new AbortController();
        getProject(abortController.signal);

        return () => abortController.abort();
    }, [authContext.userDate])

    useEffect(() => {
    }, [activeProject, authContext.userDate, isLoading])


    return (
        <div className="box">
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "/></div>}
            <div className="dashboard__text dashboard__text--title dashboard__text--center">{t('dashboard.activeProject')}</div>
            {!isLoading && <>
                {activeProject.length === 0 && <div className="dashboard__item">
                    <div className="dashboard__text dashboard__text--center">{t('dashboard.noneProject')}</div>
                </div>
                }
                {activeProject.length !== 0 && <div className="dashboard__item">
                    <div className="dashboard__text dashboard__item--title ">
                        <span className="dashboard__text dashboard__text--name">{t('dashboard.name')}</span>
                        <span className="dashboard__text dashboard__text--hours-title ">{t('dashboard.hours')}</span>

                    </div>
                    <div className="box__scroll">
                        <div className="dashboard__list">
                            {activeProject.map((x, index) => (
                                <Link to={`/project/${x.idProject}`} key={`activeP-${index}`} className="dashboard__item--list ">
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