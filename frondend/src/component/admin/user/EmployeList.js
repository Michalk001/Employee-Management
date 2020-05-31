import React, { useState, useEffect, state, useContext, useReducer, Suspense, lazy } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import config from '../../../config.json'
import Cookies from 'js-cookie';
const UserListPDF = lazy(() => import('../../reportCreation/UserListPDF'));
import { useTranslation } from 'react-i18next';


export const EmployeList = () => {

    const { t, i18n } = useTranslation('common');
    const [userList, setUserList] = useState(null);
    const [filterUserList, setFilterUserList] = useState(null)
    const [filterOptions, setFilterOptions] = useState({ name: "", statusProject: "all" })
    const [isLoading, setIsLoading] = useState(true)
    const [generatePDF, setGeneratePDF] = useState(false)

    const getUsers = async () => {

        const result = await fetch(`${config.apiRoot}/user`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        });
        const data = await result.json();
        if (data.succeeded) {
            const users = userData(data.user);
            setUserList(users)
            setFilterUserList(users)
        }

        setIsLoading(false)
    }

    const userData = (data) => {
        let users = [];
        data.filter(x => { return !x.isRemove })
            .map(item => {
                let user = {};
                user.firstname = item.firstname;
                user.lastname = item.lastname;
                user.id = item.id;
                user.username = item.username
                user.isRetired = item.isRetired;
                let hoursActivProject = 0;
                let hoursRetireProject = 0;
                item.projects.map(project => {
                    if (!project.userProjects.isRetired) {
                        hoursActivProject += project.userProjects.hours;
                    }
                    else if (project.userProjects.isRetired && !project.userProjects.isRemove) {
                        hoursRetireProject += project.userProjects.hours;
                    }
                })
                user.hoursActivProject = hoursActivProject;
                user.hoursRetireProject = hoursRetireProject;
                user.hoursTotal = hoursRetireProject + hoursActivProject;
                user.activProjectQuantity = item.projects.filter((project) => !(project.userProjects.isRemove || project.userProjects.isRetired)).length
                user.totalProjectQuantity = item.projects.filter((project) => !(project.userProjects.isRemove)).length
                users.push(user);
            })
        return users;
    }


    const projectStatus = (isRetired) => {
        if (isRetired)
            return (
                <>
                    <div className="box__project--status-text ">{t('list.statusInactive')}</div>
                    <div className="box__project--status-ico box__project--status-ico-red "><i className="fas fa-times"></i></div>
                </>
            )
        return (
            <>
                <div className="box__project--status-text ">{t('list.statusActive')}</div>
                <div className="box__project--status-ico "><i className="fas fa-check"></i></div>
            </>
        )

    }

    const updateFilterOptions = (event) => {
        setFilterOptions({ ...filterOptions, [event.target.name]: event.target.value })
    }


    const isActiveRadio = (id) => {
        if (id == "filtr-all" && filterOptions.statusProject == "all")
            return "box__radio-button--active"
        else if (id == "filtr-active" && filterOptions.statusProject == "active")
            return "box__radio-button--active"
        else if (id == "filtr-inactive" && filterOptions.statusProject == "inactive")
            return "box__radio-button--active"

    }



    const filterList = () => {

        if (userList != null) {
            let list = userList.map((item) => {
                if ((item.firstname.toUpperCase() + " " + item.lastname.toUpperCase()).includes(filterOptions.name.toUpperCase())) {
                    return item
                }

            }).filter(item => item != undefined);
            if (filterOptions.statusProject == "inactive")
                list = list.filter(item => { return item.isRetired })
            else if (filterOptions.statusProject == "active")
                list = list.filter(item => { return !item.isRetired })
            setFilterUserList(list)
        }


    }
    useEffect(() => {
        filterList();

    }, [filterOptions])

    useEffect(() => {
        setGeneratePDF(false)
    }, [userList, filterUserList])

    useEffect(() => {
        getUsers()
        document.title = t('title.listEmployees') 
    }, [])

    return (
        <div className="box box--large">
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "></i></div>}

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
                <span className="box__project--title-hours ">{t('list.hours')} </span>
                <span className="box__project--employe-title ">{t('list.activeProject')}</span>
                <span className="box__project--employe-short ">{t('list.totalProject')}</span>
                <span className="box__project--title-status ">{t('list.status')}</span>
            </div>
            {filterUserList && <>
                {userList.length == 0 && <div className="box__item">
                    <div className="box__text box__text--center">{t('list.nonEmployee')}</div>
                </div>}
                {userList.length != 0 && filterUserList.length == 0 && <div className="box__item">
                    <div className="box__text box__text--center">{t('list.notFoundEmployee')}</div>
                </div>}

                <div className="box__project--list">
                    {userList.length != 0 && filterUserList.map((item) => (
                        <Link to={`/user/${item.username}`} key={`activU-${item.username}`} className="box__project box__project--hover">
                            <span className="box__project--name ">{item.firstname} {item.lastname}</span>
                            <span className="box__project--hours">{item.hoursTotal}</span>
                            <span className="box__project--employe">{item.activProjectQuantity}</span>
                            <span className="box__project--employe-short">{item.totalProjectQuantity}</span>
                            <span className="box__project--status ">{projectStatus(item.isRetired)}</span>

                        </Link>
                    ))}
                </div>
                <div className="box__text box--half-border-top">{t('common.report')}:</div>
                <div className="box__item">

                    {!generatePDF && <div className="button" onClick={() => setGeneratePDF(true)}> {t('button.generatePDF')}</div>}

                    {generatePDF && filterUserList != null && <Suspense fallback={<div className="button">{t('common.loading')}</div>}>
                        <UserListPDF Doc={UserListPDF} data={filterUserList} name={`Employe-List-Report.pdf`} />
                    </Suspense>}

                </div>

            </>}
        </div>


    )



} 