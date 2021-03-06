import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom';

import {InfoBoxContext} from '../../../context/InfoBox/InfoBoxContext';
import config from '../../../config.json'
import Cookies from 'js-cookie';
import Select from 'react-select'
import {ErrorPage} from "../../common/ErrorPage";

import {useTranslation} from 'react-i18next';
import {Fetch, FetchGet} from "../../../models/Fetch";

export const ProjectEditor = (props) => {

    const {t} = useTranslation('common');
    const infoBoxContext = useContext(InfoBoxContext);
    const [project, setProject] = useState(null);
    const [users, setUsers] = useState([]);
    const [employeeToAdd, setEmployeeToAdd] = useState(null);
    const [error, setError] = useState(null);
    const [isValidName, setIsValidName] = useState(true);
    const updateProjectData = e => {
        setProject({...project, [e.target.name]: e.target.value})
    }

    const getProject = async (id) => {
        const result = await FetchGet(`${config.apiRoot}/project/${id}`)
        if (result.status === 404) {
            setError({code: 404, text: t('infoBox.projectNotFound')})
            return
        }
        const data = await result.json();
        if (data.succeeded) {
            setProject(data.project);
            await getUsersSelect(data.project.users);
        }

    }

    const valid = () => {
        if (!project.name || project.name.replace(/ /g, '') === '') {
            setIsValidName(false)
            infoBoxContext.addInfo(t('infoBox.requireName'), 3);
            return false
        }
        return true;
    }

    const getUsersSelect = async (projectUsers) => {
        const result = await fetch(`${config.apiRoot}/user/`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        });

        const data = await result.json();

        if (data.succeeded) {
            const usersTmp = data.user
                .filter(x => {
                    return (x.isRetired === false && x.isRemove === false)
                })
                .filter(x => !projectUsers.find(z => x.id === z.id))
                .map(x => {
                    return {
                        label: x.firstname + " " + x.lastname,
                        value: x.id,
                        username: x.username,
                        firstname: x.firstname,
                        lastname: x.lastname
                    }

                });
            setUsers(usersTmp)
        }
    }


    const updateProject = async () => {
        if (!valid())
            return
        const body = JSON.stringify({project: {name: project.name, description: project.description, id: project.id}});
        const result = await Fetch(`${config.apiRoot}/message/`, "post", body);
        const data = await result.json();
        if (data.succeeded) {
            infoBoxContext.addInfo(t('infoBox.updated'), 3);
            setIsValidName(true)
        } else {
            infoBoxContext.addInfo(t('infoBox.error'), 3);
        }

    }

    const archiveProject = async (id, isRetired) => {

        const body = JSON.stringify({project: {isRetired}});
        const result = await Fetch(`${config.apiRoot}/message/`, "post", body);
        const data = await result.json();

        if (data.succeeded) {
            setProject({...project, isRetired})
            if (isRetired)
                infoBoxContext.addInfo(t('infoBox.archive'), 3);
            else
                infoBoxContext.addInfo(t('infoBox.restore'), 3);
        } else {
            infoBoxContext.addInfo(t('infoBox.error'), 3);
        }

    }

    const archiveUser = async (id, isRetired) => {

        const body = JSON.stringify({userProject: {isRetired}})
        const result = await Fetch(`${config.apiRoot}/message/`, "post",body);
        const data = await result.json();

        if (data.succeeded) {

            const user = project.users.find(x => {
                return x.userProjects.id === id
            })
            user.userProjects.isRetired = isRetired;
            if (isRetired)
                infoBoxContext.addInfo(t('project.removeEmployee'), 3);
            else
                infoBoxContext.addInfo(t('project.restoreEmployee'), 3);
        } else {
            infoBoxContext.addInfo(t('infoBox.error'), 3);
        }
    }

    const addEmployee = async () => {

        const body = JSON.stringify({idUser: employeeToAdd.value, idProject: project.id})
        const result = await Fetch(`${config.apiRoot}/message/`, "post", body);

        const data = await result.json();
        if (data.succeeded) {

            const usersProject = project.users;
            usersProject.push({
                firstname: employeeToAdd.firstname,
                lastname: employeeToAdd.lastname,
                id: employeeToAdd.value,
                username: employeeToAdd.username,
                userProjects: {isRetired: false, isRemove: false, id: data.idUserProject}
            })
            setProject({...project, users: usersProject})

            setUsers(users.filter(x => {
                return x.value !== employeeToAdd.value
            }))

            infoBoxContext.addInfo(t('project.addEmployee'), 3);
        } else {
            infoBoxContext.addInfo(t('infoBox.error'), 3);
        }
        setEmployeeToAdd(null)
    }

    const removeUser = async (id) => {

        const result = await Fetch(`${config.apiRoot}/message/`, "post", JSON.stringify({message: messageObj}));

        const data = await result.json();
        if (data.succeeded) {

            const user = project.users.find(x => {
                return x.userProjects.id === id
            });
            setUsers([...users, {
                label: user.firstname + " " + user.lastname,
                firstname: user.firstname,
                lastname: user.lastname,
                value: user.id,
                username: user.username,
                userProjects: {isRetired: false, isRemove: false, id: id}
            }])
            project.users = project.users.filter(x => {
                return x.userProjects.id !== id
            })
            infoBoxContext.addInfo(t('project.removeEmployee'), 3);
        } else {
            infoBoxContext.addInfo(t('infoBox.error'), 3);
        }
    }

    const validInput = (field) => {
        return !field ? ` box__input--require` : ""
    }

    const isArchived = () => {
        return project.isRetired
    }

    useEffect(() => {

        if (props.match.params.id)
            getProject(props.match.params.id);
        document.title = t('title.editProject')
    }, [props.match.params.id])

    useEffect(() => {
    }, [project, users, employeeToAdd])


    return (
        <>
            {error != null && <ErrorPage text={error.text} code={error.code}/>}
            {project && <div className="box box--large">
                {project && project.isRetired &&
                <div className="form-editor__text form-editor__text--archive-small">{t('common.archive')} </div>}
                <div className="form-editor--inline box__item button--edit-box">
                    <div className="button button--save button--gap" onClick={async () => {
                        await updateProject()
                    }}>{t('button.update')}</div>
                    {project && !project.isRetired &&
                    <div className="button button--remove button--gap"
                         onClick={() => infoBoxContext.Confirm(t('infoBox.archiveProject'), () => (archiveProject(project.id, true)))}>
                        {t('button.archive')}
                    </div>}
                    {project && project.isRetired &&
                    <div className="button button--gap"
                         onClick={() => infoBoxContext.Confirm(t('infoBox.restoreProject'), () => (archiveProject(project.id, false)))}>
                        {t('button.restore')}
                    </div>}
                </div>
                <div className="form-editor--inline-flex-wrap">
                    <div
                        className="form-editor__text form-editor__text--vertical-center form-editor__text--require">  {t('project.name')} </div>
                    <input id="nameEditPro"
                           className={`form-editor__input form-editor__input--large form-editor__input--editor ${validInput(isValidName)}`}
                           type="text" name="name" value={project ? project.name : ""} onChange={updateProjectData}/>
                </div>
                <div className="form-editor__text"> {t('project.description')} </div>
                <textarea id="descriptionEditPro" className="form-editor__input form-editor__input--textarea"
                          name="description" value={project ? project.description : ""} onChange={updateProjectData}/>
                {project && !project.isRetired && <div className="form-editor--inline">
                    <div
                        className="form-editor__text form-editor__text--vertical-center"> {t('project.addNewEmployee')}:
                    </div>
                    <Select value={employeeToAdd} onChange={(x) => setEmployeeToAdd(x)}
                            placeholder={t('project.select')} noOptionsMessage={() => {
                        return t('project.emptyEmployeeList')
                    }} options={users} className="form-editor__input form-editor__input--select "/>
                    <div className={`button ${!employeeToAdd ? `button--disabled` : ``}`}
                         onClick={() => addEmployee()}> {t('button.add')}</div>
                </div>}
                <div className="form-editor__text"> {t('project.activeEmployee')}:</div>
                {project && project.users.filter(user => {
                    return user.userProjects.isRetired === false
                }).map((x) => (
                    <div key={`UserPE-${x.username}`} className="box__item form-editor__employee-box">
                        <Link className="form-editor__employee-box--text  form-editor__employee-box--name "
                              to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                        {!isArchived() &&
                        <div className="form-editor__employee-box--text  form-editor__employee-box--retired"
                             onClick={() => infoBoxContext.Confirm(t('infoBox.removeUserFromProject'), () => (archiveUser(x.userProjects.id, true)))}>
                            <i className="fas fa-ban"/></div>}
                    </div>))}
                {project && !project.users.find(user => {
                    return user.userProjects.isRetired === false
                }) &&
                <div className="form-editor__text">
                    {t('project.non')}
                </div>}
                {project && project.users.find(user => {
                    return user.userProjects.isRetired === true
                }) &&
                <>
                    <div className="form-editor__text  box--half-border-top"> {t('project.inactiveEmployee')}:</div>
                    {project && project.users.filter(xx => {
                        return xx.userProjects.isRetired === true
                    }).map((x) => (
                        <div key={`unUserPE-${x.username}`} className="box__item form-editor__employee-box">
                            <Link className="form-editor__employee-box--text  form-editor__employee-box--name "
                                  to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                            {!isArchived() && <>
                                <div className="form-editor__employee-box--text  form-editor__employee-box--restore"
                                     onClick={() => infoBoxContext.Confirm(t('infoBox.restoreUserToProject'), () => (archiveUser(x.userProjects.id, false)))}>
                                    <i className="fas fa-undo-alt"/></div>
                                <div className="form-editor__employee-box--text  form-editor__employee-box--retired"
                                     onClick={() => infoBoxContext.Confirm(t('infoBox.deleteUserFromProject'), () => (removeUser(x.userProjects.id)))}>
                                    <i className="fas fa-trash"/></div>
                            </>}
                        </div>
                    ))}
                </>}
                <div className="form-editor__text form-editor__text--require-string">* {t('common.require')} </div>
            </div>}

        </>
    )

}