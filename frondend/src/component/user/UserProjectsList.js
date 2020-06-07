import React, { useState, useEffect, useContext, lazy, Suspense } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import { useTranslation } from 'react-i18next';
import {StatusFilter} from "../../models/StatusFilter";
import {FetchGet} from "../../models/Fetch";

const UserProjectListPDF = lazy(() => import('../reportCreation/teamplet/UserProjectListPDF'));


export const UserProjectsList = () => {

    const [projectList, setProjectList] = useState([]);
    const [filterProjectList, setFilterProjectList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const authContext = useContext(AuthContext)
    const [generatePDF, setGeneratePDF] = useState(false)
    const { t } = useTranslation('common');

    const getProjectList = async (name) => {

        const result = await  FetchGet(`${config.apiRoot}/user/${name}`)

        const data = await result.json();
        if (data.succeeded) {

            if (data.user != null) {
                let projects = [];
                data.user.projects.map((item) => {

                    if (item.userProjects.isRemove)
                        return
                    let project = {};
                    project.name = item.name;
                    project.search = item.name.toUpperCase();
                    project.id = item.id;
                    project.hours = item.userProjects.hours
                    project.isRetired = item.userProjects.isRetired
                    projects.push(project)
                })
                setProjectList(projects);
                setFilterProjectList(projects)
            }

        }
        setIsLoading(false)
    }



    const projectStatus = (isRetired) => {
        if (isRetired)
            return (
                <>
                    <div className="box__project--status-text ">{t('list.statusInactive')}</div>
                    <div className="box__project--status-ico box__project--status-ico-red "><i className="fas fa-times"/></div>
                </>
            )
        return (
            <>
                <div className="box__project--status-text ">{t('list.statusActive')}</div>
                <div className="box__project--status-ico "><i className="fas fa-check"/></div>
            </>
        )

    }

    useEffect(() => {
        setGeneratePDF(false)
    }, [projectList, filterProjectList])


    useEffect(() => {
        if (authContext.userDate)
            getProjectList(authContext.userDate.username)

        document.title = t('title.userProject')
    }, [authContext.userDate])



    return (
        <div className="box box--center box--medium ">

            <StatusFilter  listRaw={projectList} setFilterList={setFilterProjectList}/>

            <div className="box__text box__text--normal box__project">
                <span className="box__project--title-name ">{t('list.name')}</span>
                <span className="box__project--title-hours-user-list ">{t('list.hours')} </span>
                <span className="box__project--title-status-user-list  ">{t('list.status')}</span>
            </div>
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "/></div>}
            {!isLoading && filterProjectList && <>
                {projectList.length === 0 && <div className="box__item">
                    <div className="box__text box__text--center">{t('list.nonProject')}</div>
                </div>}
                {projectList.length !== 0 && filterProjectList.length === 0 && <div className="box__item">
                    <div className="box__text box__text--center">{t('list.noFoundProject')}</div>
                </div>}
                <div className="box__project--list">
                    {filterProjectList.length !== 0 && filterProjectList.map((item) => (

                        <Link to={`/project/${item.id}`} key={`activeProject-${item.id}`} className="box__project box__project--hover">
                            <span className="box__project--name ">{item.name}</span>
                            <span className="box__project--hours-user-list">{item.hours}</span>
                            <span className="box__project--status ">{projectStatus(item.isRetired)}</span>

                        </Link>
                    ))}
                </div>
            </>}
            <div className="box__text ">{t('common.report')}:</div>
            <div className="box__item">

                {!generatePDF && <div className="button" onClick={() => setGeneratePDF(true)}> {t('button.generatePDF')}</div>}
                {generatePDF && <Suspense fallback={<div className="button">{t('common.loading')}</div>}>          
                        <UserProjectListPDF  data={filterProjectList} name={`Project-List-Report.pdf`} />
                </Suspense>}


            </div>
        </div>
    )



} 