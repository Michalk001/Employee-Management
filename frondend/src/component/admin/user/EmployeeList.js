import React, { useState, useEffect,  Suspense, lazy } from "react";
import { Link } from 'react-router-dom';

import config from '../../../config.json'
const UserListPDF = lazy(() => import('../../reportCreation/teamplet/UserListPDF'));
import { useTranslation } from 'react-i18next';
import {StatusFilter} from "../../../models/StatusFilter";
import {UserProjectsData} from "../../../models/UserProjectsData";
import { FetchGet} from "../../../models/Fetch";


export const EmployeeList = () => {

    const { t } = useTranslation('common');
    const [userList, setUserList] = useState(null);
    const [filterUserList, setFilterUserList] = useState(null)

    const [isLoading, setIsLoading] = useState(true)
    const [generatePDF, setGeneratePDF] = useState(false)

    const getUsers = async (signal = null) => {

        const result = await  FetchGet( `${config.apiRoot}/user`,signal)
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
                user.search = item.firstname.toUpperCase() + " " + item.lastname.toUpperCase();
                const userProjectData = UserProjectsData(item.projects)
                user.hoursTotal =  userProjectData.hoursRetired + userProjectData.hoursActive;
                user.activProjectQuantity = userProjectData.activeQuantity;
                user.totalProjectQuantity = userProjectData.totalQuantity;
                users.push(user);
            })
        return users;
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
    }, [userList, filterUserList])

    useEffect(() => {
        const abortController = new AbortController();
        getUsers(abortController.signal)
        document.title = t('title.listEmployees')
        return () => abortController.abort();
    }, [])

    return (
        <div className="box box--large">
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "/></div>}

            <StatusFilter  listRaw={userList} setFilterList={setFilterUserList}/>

            <div className="box__text box__text--normal box__project">
                <span className="box__project--title-name ">{t('list.name')}</span>
                <span className="box__project--title-hours ">{t('list.hours')} </span>
                <span className="box__project--employee-title ">{t('list.activeProject')}</span>
                <span className="box__project--employee-short ">{t('list.totalProject')}</span>
                <span className="box__project--title-status ">{t('list.status')}</span>
            </div>
            {filterUserList && <>
                {userList.length === 0 && <div className="box__item">
                    <div className="box__text box__text--center">{t('list.nonEmployee')}</div>
                </div>}
                {userList.length !== 0 && filterUserList.length === 0 && <div className="box__item">
                    <div className="box__text box__text--center">{t('list.notFoundEmployee')}</div>
                </div>}

                <div className="box__project--list">
                    {userList.length !== 0 && filterUserList.map((item) => (
                        <Link to={`/user/${item.username}`} key={`activeU-${item.username}`} className="box__project box__project--hover">
                            <span className="box__project--name ">{item.firstname} {item.lastname}</span>
                            <span className="box__project--hours">{item.hoursTotal}</span>
                            <span className="box__project--employee">{item.activProjectQuantity}</span>
                            <span className="box__project--employee-short">{item.totalProjectQuantity}</span>
                            <span className="box__project--status ">{projectStatus(item.isRetired)}</span>

                        </Link>
                    ))}
                </div>
                <div className="box__text box--half-border-top">{t('common.report')}:</div>
                <div className="box__item">

                    {!generatePDF && <div className="button" onClick={() => setGeneratePDF(true)}> {t('button.generatePDF')}</div>}

                    {generatePDF && filterUserList != null && <Suspense fallback={<div className="button">{t('common.loading')}</div>}>
                        <UserListPDF data={filterUserList} name={`Employee-List-Report.pdf`} />
                    </Suspense>}

                </div>

            </>}
        </div>


    )



} 