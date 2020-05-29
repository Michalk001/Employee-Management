

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import { InfoBoxContext } from '../../../context/InfoBox/InfoBoxContext';
import config from '../../../config.json'
import Cookies from 'js-cookie';
import { Project } from "../../user/Project";
import Select from 'react-select'
import { ErrorPage } from "../../common/ErrorPage";

import { useTranslation } from 'react-i18next';

export const ProjectEditor = (props) => {

    const { t, i18n } = useTranslation('common');
    const infoBoxContext = useContext(InfoBoxContext);
    const [project, setProject] = useState(null);
    const [users, setUsers] = useState([]);
    const [employeeToAdd, setEmployeeToAdd] = useState(null);
    const [error, setError] = useState(null);
    const updateProjectData = e => {
        setProject({ ...project, [e.target.name]: e.target.value })
    }

    const getProject = async (id) => {
        const result = await fetch(`${config.apiRoot}/project/${id}`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            }
        });
        if (result.status == 404) {
            setError({ code: 404, text: t('infoBox.projectNotFound') })
            return
        }
        const data = await result.json();
        if (data.succeeded) {
            setProject(data.project);
            await getUsersSelect(data.project.users);
        }

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
                .filter(x => { return (x.isRetired == false && x.isRemove == false) })
                .filter(x => !projectUsers.find(z => x.id === z.id))
                .map(x => {
                    return { label: x.firstname + " " + x.lastname, value: x.id, username: x.username, firstname: x.firstname, lastname: x.lastname }

                });
            setUsers(usersTmp)
        }
    }


    const updateProject = async () => {
        const result = await fetch(`${config.apiRoot}/project/${project.id}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ project: { name: project.name, description: project.description, id: project.id } })
        });

        const data = await result.json();
        if (data.succeeded) {
            infoBoxContext.addInfo(t('infoBox.updated'));
        }
        else {
            infoBoxContext.addInfo(t('infoBox.error'));
        }

    }

    const archiveProject = async (id, isRetired) => {
        const result = await fetch(`${config.apiRoot}/project/${id}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ project: { isRetired } })
        });

        const data = await result.json();

        if (data.succeeded) {
            setProject({ ...project, isRetired })
            if (isRetired)
                infoBoxContext.addInfo(t('infoBox.archive'));
            else
                infoBoxContext.addInfo(t('infoBox.restore'));
        }
        else {
            infoBoxContext.addInfo(t('infoBox.error'));
        }

    }

    const archiveUser = async (id, isRetired) => {
        const result = await fetch(`${config.apiRoot}/userproject/${id}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ userProject: { isRetired } })
        });
        const data = await result.json();
        if (data.succeeded) {

            const user = project.users.find(x => { return x.userProjects.id == id })
            user.userProjects.isRetired = isRetired;
            if (isRetired)
                infoBoxContext.addInfo(t('project.removeEmploye'));
            else
                infoBoxContext.addInfo(t('project.restoreEmploye'));
        }
        else {
            infoBoxContext.addInfo(t('infoBox.error'));
        }
    }

    const addEmployee = async () => {

        const result = await fetch(`${config.apiRoot}/userproject/`, {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ idUser: employeeToAdd.value, idProject: project.id })
        });

        const data = await result.json();
        if (data.succeeded) {

            const usersProject = project.users;
            usersProject.push({ firstname: employeeToAdd.firstname, lastname: employeeToAdd.lastname, id: employeeToAdd.value, username: employeeToAdd.username, userProjects: { isRetired: false, isRemove: false, id: data.idUserProject } })
            setProject({ ...project, users: usersProject })

            setUsers(users.filter(x => { return x.value != employeeToAdd.value }))

            infoBoxContext.addInfo(t('project.addEmploye'));
        }
        else {
            infoBoxContext.addInfo(t('infoBox.error'));
        }
        setEmployeeToAdd(null)
    }

    const removeUser = async (id) => {
        const result = await fetch(`${config.apiRoot}/userproject/${id}`, {
            method: "delete",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            }
        });

        const data = await result.json();
        if (data.succeeded) {

            const user = project.users.find(x => { return x.userProjects.id == id });
            setUsers([...users, { label: user.firstname + " " + user.lastname, firstname: user.firstname, lastname: user.lastname, value: user.id, username: user.username, userProjects: { isRetired: false, isRemove: false, id: id } }])
            project.users = project.users.filter(x => { return x.userProjects.id != id })
            infoBoxContext.addInfo(t('project.removeEmploye'));
        }
        else {
            infoBoxContext.addInfo(t('infoBox.error'));
        }
    }

    useEffect(() => {

        if (props.match.params.id)
            getProject(props.match.params.id);

    }, [props.match.params.id])

    useEffect(() => {
    }, [project, users, employeeToAdd])


    return (
        <>
            {error != null && <ErrorPage text={error.text} code={error.code} />}
            {project && <div className="box box--large">
                {project && project.isRetired && <div className="form-editor__text form-editor__text--archive-small">{t('common.archive')} </div>}
                <div className="form-editor--inline box__item button--edit-box">
                    <div className="button button--save button--gap" onClick={() => { updateProject() }}>{t('button.update')}</div>
                    {project && !project.isRetired && <div className="button button--remove button--gap"
                        onClick={() => infoBoxContext.Confirm("Czy napewno chcesz zarchiwizować projekt", () => (archiveProject(project.id, true)))}>
                        {t('button.archive')}
                </div>}
                    {project && project.isRetired && <div className="button button--gap"
                        onClick={() => infoBoxContext.Confirm("Czy napewno chcesz przywrócić projekt", () => (archiveProject(project.id, false)))}>
                         {t('button.restore')}
                </div>}
                </div>
                <div className="form-editor--inline-flex-wrap">
                    <div className="form-editor__text form-editor__text--vertical-center form-editor__text--require">  {t('project.name')} </div>
                    <input className="form-editor__input form-editor__input--large form-editor__input--editor " type="text" name="name" value={project ? project.name : ""} onChange={updateProjectData} />
                </div>
                <div className="form-editor__text"> {t('project.description')} </div>
                <textarea className="form-editor__input form-editor__input--textarea" name="description" value={project ? project.description : ""} onChange={updateProjectData} />
                {project && !project.isRetired && <div className="form-editor--inline">
                    <div className="form-editor__text form-editor__text--vertical-center"> {t('project.addNewEmployee')}: </div>
                    <Select value={employeeToAdd} onChange={(x) => setEmployeeToAdd(x)} placeholder="Wybierz" noOptionsMessage={() => { return t('project.emptyEmployeList') }} options={users} className="form-editor__input form-editor__input--select " />
                    <div className={`button ${!employeeToAdd ? `button--disabled` : ``}`} onClick={() => addEmployee()} > {t('button.add')}</div>
                </div>}
                <div className="form-editor__text"> {t('project.activeEmployee')}: </div>
                {project && project.users.filter(xx => { return xx.userProjects.isRetired == false }).map((x) => (
                    <div key={`UserPE-${x.username}`} className="box__item form-editor__employe-box">
                        <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                        <div className="form-editor__employe-box--text  form-editor__employe-box--retired" onClick={() => infoBoxContext.Confirm("Czy napewno chcesz usunąć pracownika z projektu", () => (archiveUser(x.userProjects.id, true)))}> <i className="fas fa-ban"></i></div>
                    </div>))}
                {project && !project.users.find(x => { return x.userProjects.isRetired == false }) &&
                    <div className="form-editor__text">
                         {t('project.non')}
            </div>}
                {project && project.users.find(x => { return x.userProjects.isRetired == true }) &&
                    <>
                        <div className="form-editor__text  box--half-border-top"> {t('project.inactiveEmployee')}: </div>
                        {project && project.users.filter(xx => { return xx.userProjects.isRetired == true }).map((x) => (
                            <div key={`unUserPE-${x.username}`} className="box__item form-editor__employe-box">
                                <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                                <div className="form-editor__employe-box--text  form-editor__employe-box--restore" onClick={() => infoBoxContext.Confirm("Czy napewno chcesz przywrócić pracownika do projektu", () => (archiveUser(x.userProjects.id, false)))}>  <i className="fas fa-undo-alt"></i></div>
                                <div className="form-editor__employe-box--text  form-editor__employe-box--retired" onClick={() => infoBoxContext.Confirm("Czy napewno chcesz trwale usunąć pracownika z projektu", () => (removeUser(x.userProjects.id)))}>  <i className="fas fa-trash"></i></div>
                            </div>
                        ))}
                    </>}
            </div>}
        </>
    )

}