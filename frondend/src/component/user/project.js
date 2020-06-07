import React, {useState, useEffect, useContext, lazy} from "react";
import {Link} from 'react-router-dom';

import {AuthContext} from '../../context/AuthContext';
import config from '../../config.json'
import {InfoBoxContext} from '../../context/InfoBox/InfoBoxContext';
import {ErrorPage} from "../common/ErrorPage"
import {useTranslation} from 'react-i18next';
import {Fetch, FetchGet} from "../../models/Fetch";

const ProjectReportPDF = lazy(() => import('../reportCreation/teamplet/ProjectReportPDF'));


export const Project = (props) => {

    const [project, setProject] = useState(null);
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const infoBoxContext = useContext(InfoBoxContext);
    const authContext = useContext(AuthContext)
    const {t} = useTranslation('common');

    const [generatePDF, setGeneratePDF] = useState(false)

    const getProject = async (id) => {

        const result = await FetchGet(`${config.apiRoot}/project/${id}`)

        if (result.status === 404) {
            setError({code: 404, text: t('infoBox.projectNotFound')})
        }


        const data = await result.json()
        if (data.succeeded) {

            setProject(data.project)
        }


    }

    const getCurrentUserInfo = () => {
        if (project != null) {
            if (project.users)
                if (authContext.isLogin) {
                    const userData = project.users.find(x => {
                        return x.username === authContext.userDate.username && !x.userProjects.isRemove
                    })
                    if (userData)
                        setCurrentUserInfo(userData)
                }
        }

    }

    const addHours = async () => {
        if (currentUserInfo && currentUserInfo.newHours != null) {
            let newHours = +currentUserInfo.newHours + +currentUserInfo.userProjects.hours;
            if (newHours < 0)
                newHours = 0

            const result = await updateUserHours(currentUserInfo.userProjects.id, newHours);
            const data = await result.json();
            if (data.succeeded) {

                currentUserInfo.userProjects.hours = newHours

                infoBoxContext.addInfo(t('project.addHoursInfo'));
            } else {
                infoBoxContext.addInfo(t('infoBox.error'));
            }

            setCurrentUserInfo({...currentUserInfo, newHours: null})
        }
    }

    const removeHours = async () => {
        if (currentUserInfo && currentUserInfo.newHours != null) {
            let newHours = +currentUserInfo.userProjects.hours - +currentUserInfo.newHours;
            if (newHours < 0)
                newHours = 0
            const result = await updateUserHours(currentUserInfo.userProjects.id, newHours);

            const data = await result.json();
            if (data.succeeded) {
                currentUserInfo.userProjects.hours = newHours

                infoBoxContext.addInfo(t('project.subHoursInfo'));
            } else {
                infoBoxContext.addInfo(t('infoBox.error'));
            }


            setCurrentUserInfo({...currentUserInfo, newHours: 0})
        }
    }

    const updateUserHours = async (id, quantity) => {
        return await Fetch(`${config.apiRoot}/userproject/${id}`, "put", JSON.stringify({userProject: {hours: quantity}}))

    }


    const validHoursField = (e, fun) => {
        const reg = /^\d+$/;
        if ((e.value.length <= 10 && reg.test(e.value)) || e.value === "") {
            fun(e);
        }

    }
    useEffect(() => {
        getProject(props.match.params.id)
        document.title = t('title.project')
    }, [props.match.params.id])

    useEffect(() => {
        getCurrentUserInfo();
        setGeneratePDF(false)
    }, [project])

    useEffect(() => {
    }, [currentUserInfo])


    return (
        <>
            {error != null && <ErrorPage text={error.text} code={error.code}/>}
            {project &&
            <div className="box box--large">
                {project && project.isRetired && <div className="box--archive">{t('common.archive')} </div>}
                {authContext.isAdmin &&
                <div className="box__item--inline box__item--full-width box__item button--edit-box">
                    <Link to={`/admin/project/edit/${project.id}`} className="button">{t('button.edit')}</Link>
                </div>}
                <div className="box__text box__item ">
                    <span className="box__text--bold ">{t('project.title')}: </span>
                    <span className="box__text--bold ">{project.name}</span>
                </div>
                {currentUserInfo && <div className="box__item ">
                    <div className="box__item--inline">
                        <div
                            className="box__text box__text--bold box__text--vertical-center  ">{t('project.yoursQuantityHours')}:
                        </div>
                        <div
                            className="box__text box__text--vertical-center "> {currentUserInfo && currentUserInfo.userProjects.hours}</div>
                    </div>
                </div>
                }
                {project && !project.isRetired && currentUserInfo && !currentUserInfo.userProjects.isRemove && !currentUserInfo.userProjects.isRetired &&
                <div className="box__item">
                    <div className="box__item--inline">
                        <div
                            className="box__text box__text--bold box__text--vertical-center  ">{t('project.addHours')}</div>
                        <input className="box__input box__input--add-hours" type="text" name="newHours"
                               value={currentUserInfo && currentUserInfo.newHours ? currentUserInfo.newHours : ""}
                               onChange={(x) => validHoursField(x.target, x => setCurrentUserInfo({
                                   ...currentUserInfo,
                                   [x.name]: x.value
                               }))}/>
                        <div
                            className={`button button--gap ${!currentUserInfo || !currentUserInfo.newHours ? `button--disabled` : ``}`}
                            onClick={() => addHours()}>{t('button.add')}</div>
                        <div
                            className={`button button--gap ${!currentUserInfo || !currentUserInfo.newHours ? `button--disabled` : ``}`}
                            onClick={() => removeHours()}>{t('button.sub')}</div>
                    </div>
                </div>
                }
                {project.description && <>
                    <div className="box__text box--half-border-top ">{t('project.description')}:</div>
                    <div className="box__text box__item box__item--description ">
                        {project.description}
                    </div>
                </>}
                {!project.description && <div className="box__text  box__item box--half-border-bottom   ">
                    {t('project.noDescription')}
                </div>}
                {project.users && project.users.find(x => {
                    return (!x.userProjects.isRetired && !x.userProjects.isRemove)
                }) && <>
                    <div className="box__text ">{t('project.activeEmployee')}:</div>
                    <div className="box--employee-list ">
                        {project.users.filter(x => {
                            return !x.userProjects.isRetired && !x.userProjects.isRemove
                        }).map((x) => (
                            <Link className="box__text  box__item box__item--employe"
                                  key={`employeeActive-${x.username}`}
                                  to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                        ))}
                    </div>
                </>}
                {project.users && project.users.find(x => {
                    return (x.userProjects.isRetired && !x.userProjects.isRemove)
                }) && <>
                    <div className="box__text box--half-border-top">{t('project.inactiveEmployee')}:</div>
                    <div className="box--employee-list ">
                        {(project.users.filter(x => {
                            return (x.userProjects.isRetired && !x.userProjects.isRemove)
                        })).map((x) => (
                            <Link className="box__text  box__item box__item--employee"
                                  key={`employeeInactive-${x.username}`}
                                  to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                        ))}
                    </div>
                </>}
                <div className="box__text box--half-border-top">{t('common.report')}:</div>
                <div className="box__item">


                    {!generatePDF &&
                    <div className="button" onClick={() => setGeneratePDF(true)}> {t('button.generatePDF')}</div>}

                    {generatePDF &&
                    <Suspense fallback={<div className="button">{t('common.loading')}</div>}>
                        <ProjectReportPDF Doc={ProjectReportPDF} data={project} name={`${project.name}`}/>
                    </Suspense>}

                </div>
            </div>
            }</>
    )


}
