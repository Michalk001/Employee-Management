import React, { useState, useEffect,lazy, Suspense } from "react";
import { Link } from 'react-router-dom';
import config from '../../../config.json'
import { useTranslation } from "react-i18next";
import {FetchGet} from "../../../models/Fetch";
import {StatusFilter} from "../../../models/StatusFilter";
import {UserProjectsData} from "../../../models/UserProjectsData";

const ProjectListPDF = lazy(() => import('../../reportCreation/teamplet/ProjectListPDF'));


export const ProjectList = () => {

    const { t } = useTranslation('common');
    const [projectList, setProjectList] = useState(null);
    const [filterProjectList, setFilterProjectList] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [generatePDF, setGeneratePDF] = useState(false);

    const getProjects = async () => {

        const result = await  FetchGet(`${config.apiRoot}/project`)

        const data = await result.json();

        if (data.succeeded) {
            const projects = projectData(data.projects)
            setProjectList(projects)
            setFilterProjectList(projects)
        }
        setIsLoading(false)
    }

    const projectData = (data) => {
        let projects = [];
        data.filter(x => { return !x.isRemove })
            .map(item => {
                let project = {};
                project.name = item.name;
                project.id = item.id;
                project.isRetired = item.isRetired;
                project.search = item.name.toUpperCase();
                const userProjectData = UserProjectsData(item.users)
                project.hoursTotal = userProjectData.hoursRetired + userProjectData.hoursActive;
                project.activUserQuantity = userProjectData.activeQuantity;
                project.totalUserQuantity =userProjectData.totalQuantity;
                projects.push(project);
            })
        return projects;
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
        getProjects()
        document.title = t('title.listProjects') 
    }, [])

    useEffect(() => {

        setGeneratePDF(false)
    }, [projectList, filterProjectList, isLoading])



    return (
        <div className="box box--large">
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "/></div>}

            <StatusFilter  listRaw={projectList} setFilterList={setFilterProjectList}/>

            <div className="box__text box__text--normal box__project">
                <span className="box__project--title-name ">{t('list.name')}</span>
                <span className="box__project--title-hours ">{t('list.hours')} </span>
                <span className="box__project--employee-title">{t('list.activeEmployee')}</span>
                <span className="box__project--employee-short ">{t('list.totalEmployee')}</span>
                <span className="box__project--title-status ">{t('list.status')}</span>
            </div>
            {!isLoading && filterProjectList && <>
                {projectList.length === 0 && <div className="box__item">
                    <div className="box__text box__text--center">{t('list.nonProject')}</div>
                </div>}
                {projectList.length !== 0 && filterProjectList.length === 0 && <div className="box__item">
                    <div className="box__text box__text--center">{t('list.noFoundProject')}</div>
                </div>}
                <div className="box__project--list">
                    {projectList.length !== 0 && filterProjectList.map((item) => (
                        <Link to={`/project/${item.id}`} key={`activeP-${item.id}`} className="box__project box__project--hover">
                            <span className="box__project--name ">{item.name}</span>
                            <span className="box__project--hours">{item.hoursTotal}</span>
                            <span className="box__project--employee">{item.activUserQuantity}</span>
                            <span className="box__project--employee-short">{item.totalUserQuantity}</span>
                            <span className="box__project--status ">{projectStatus(item.isRetired)}</span>

                        </Link>
                    ))}
                </div>
            </>}
            <div className="box__text box--half-border-top">{t('common.report')}:</div>
            <div className="box__item">


                {!generatePDF && <div className="button" onClick={() => setGeneratePDF(true)}> {t('button.generatePDF')}</div>}

                {generatePDF && filterProjectList != null && <Suspense fallback={<div className="button">{t('common.loading')}</div>}>
                    <ProjectListPDF Doc={null} data={filterProjectList} name={`Project-List-Report`} />
                </Suspense>}

            </div>
        </div>
    )



} 