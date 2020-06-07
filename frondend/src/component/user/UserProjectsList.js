import React, { useState, useEffect, useContext, lazy, Suspense } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const UserProjectListPDF = lazy(() => import('../reportCreation/teamplet/UserProjectListPDF'));


export const UserProjectsList = (props) => {

    const [projectList, setProjectList] = useState([]);
    const [filterProjectList, setFilterProjectList] = useState([])
    const [filterOptions, setFilterOptions] = useState({ name: "", statusProject: "all" })
    const [isLoading, setIsLoading] = useState(true)
    const authContext = useContext(AuthContext)
    const [generatePDF, setGeneratePDF] = useState(false)
    const { t } = useTranslation('common');

    const getProjectList = async (name) => {

        const result = await fetch(`${config.apiRoot}/user/${name}`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        });

        const data = await result.json();

        if (data.succeeded) {

            if (data.user != null) {
                let projects = [];
                data.user.projects.map((item) => {

                    if (item.userProjects.isRemove)
                        return
                    let project = {};
                    project.name = item.name;
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


    const updateFilterOptions = (event) => {

        setFilterOptions({ ...filterOptions, [event.target.name]: event.target.value })
    }
    const isActiveRadio = (id) => {
        if (id === "filtr-all" && filterOptions.statusProject === "all")
            return "box__radio-button--active"
        else if (id === "filtr-active" && filterOptions.statusProject === "active")
            return "box__radio-button--active"
        else if (id === "filtr-inactive" && filterOptions.statusProject === "inactive")
            return "box__radio-button--active"

    }


    const filterList = () => {

        if (projectList != null) {
            let list = projectList.map((item) => {
                if (item.name.toUpperCase().includes(filterOptions.name.toUpperCase())) {
                    return item
                }

            }).filter(item => item !== undefined);

            if (filterOptions.statusProject === "inactive")
                list = list.filter(item => { return item.isRetired })
            else if (filterOptions.statusProject === "active")
                list = list.filter(item => { return !item.isRetired })
            setFilterProjectList(list)
        }


    }
    useEffect(() => {
        filterList();

    }, [filterOptions])

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


            <div className="box__item">
                <div className=" box__radio-button--position">
                    <div className="box__radio-button--select-list">
                        <label className={`box__radio-button ${isActiveRadio("filtr-all")}`} htmlFor={`filtr-all`}  >{t('list.all')}</label><input onChange={updateFilterOptions} className="box__project--radio" id="filtr-all" name="statusProject" value="all" type="radio" />
                        <label className={`box__radio-button ${isActiveRadio("filtr-active")}`} htmlFor={`filtr-active`} >{t('list.active')}</label><input onChange={updateFilterOptions} className="box__project--radio" id="filtr-active" name="statusProject" value="active" type="radio" />
                        <label className={`box__radio-button ${isActiveRadio("filtr-inactive")}`} htmlFor={`filtr-inactive`} >{t('list.inactive')}</label><input onChange={updateFilterOptions} className="box__project--radio" id="filtr-inactive" name="statusProject" value="inactive" type="radio" />
                    </div>
                    <div className="box__text"> {t('list.searchByName')}</div>
                </div>
                <input placeholder={`${t('list.search')}...`} type="text" className="box__input box__input--search" id="name" name="name" value={filterOptions.name} onChange={updateFilterOptions} />
            </div>

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