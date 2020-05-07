

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { InfoBoxContext } from '../../context/InfoBox/InfoBoxContext';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { Project } from "../user/Project";
import Select from 'react-select'



export const ProjectEditor = (props) => {

    const infoBoxContext = useContext(InfoBoxContext);
    const [project, setProject] = useState(null);
    const [users, setUsers] = useState([]);
    const [employeeToAdd, setEmployeeToAdd] = useState(null);

    const updateProjectData = e => {
        setProject({ ...project, [e.name]: e.value })
    }

    const getProject = async (id) => {
        await fetch(`${config.apiRoot}/project/${id}`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.succeeded) {

                    setProject(res.project)

                }
                return res;
            })
            .then(
                res => {
                    getUser(res.project.users);
                }
            )
    }

    const getUser = async (users) => {
        await fetch(`${config.apiRoot}/user/`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.succeeded) {
                    const usersTmp = res.user
                        .filter(x => { return (x.isRetired == false && x.isRemove == false) })
                        .filter(x => !users.find(z => x.id === z.id))
                        .map(x => {
                            return { label: x.firstname + " " + x.lastname, value: x.id, username: x.username, firstname: x.firstname, lastname: x.lastname }

                        });

                    const a = usersTmp;// usersTmp.map(x => {return users.find(z => {return z.id != x.value})})

                    setUsers(usersTmp)

                }

            })
    }

    const updateProject = async () => {
        await fetch(`${config.apiRoot}/project/${project.id}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ project: { name: project.name, description: project.description, id: project.id } })
        })
            .then(res => res.json())
            .then(res => {
                if (res.succeeded) {
                    infoBoxContext.addInfo("Zaktualizowano");
                }
                else {
                    infoBoxContext.addInfo("Wystąpił błąd");
                }

            })

    }

    const archiveProject = async (id, isRetired) => {
        await fetch(`${config.apiRoot}/project/${id}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ project: { isRetired } })
        })
            .then(res => res.json())
            .then(res => {
                if (res.succeeded) {
                    project.isRetired = isRetired;
                    if (isRetired)
                        infoBoxContext.addInfo("Zarchiwizowano projekt");
                    else
                        infoBoxContext.addInfo("Przywrócono projekt");
                }
                else {
                    infoBoxContext.addInfo("Wystąpił błąd");
                }
            })
    }

    const archiveUser = async (id, isRetired) => {
        await fetch(`${config.apiRoot}/userproject/${id}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ userProject: { isRetired } })
        })
            .then(res => res.json())
            .then(res => {
                if (res.succeeded) {

                    const a = project.users.find(x => { return x.userProjects.id == id })
                    a.userProjects.isRetired = isRetired;
                    if (isRetired)
                        infoBoxContext.addInfo("Usunięto pracownika z projektu");
                    else
                        infoBoxContext.addInfo("Przywrócono pracownika do projektu");
                }
                else {
                    infoBoxContext.addInfo("Wystąpił błąd");
                }
            })
    }

    const addEmployee = async () => {
     
        await fetch(`${config.apiRoot}/userproject/`, {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ idUser: employeeToAdd.value, idProject: project.id })
        })
            .then(res => res.json())
            .then(res => {
                if (res.succeeded) {
                
                    const u = project.users;
                    u.push({ firstname: employeeToAdd.firstname, lastname: employeeToAdd.lastname, id: employeeToAdd.value, username: employeeToAdd.username, userProjects: { isRetired: false, isRemove: false, id: res.idUserProject } })
                    setProject({ ...project, users: u })

                    setUsers(users.filter(x => { return x.value != employeeToAdd.value }))

                    infoBoxContext.addInfo("Dodano pracownika do projektu");
                }
                else {
                    infoBoxContext.addInfo("Wystąpił błąd");
                }
                setEmployeeToAdd(null)
            })
    }

    const removeUser = async (id) => {
        await fetch(`${config.apiRoot}/userproject/${id}`, {
            method: "delete",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.succeeded) {
                    const user = project.users.find(x => { return x.userProjects.id == id });
                    setUsers([...users, {label: user.firstname + " " + user.lastname,  firstname: user.firstname, lastname: user.lastname, value: user.id, username: user.username, userProjects: { isRetired: false, isRemove: false, id: id } }])
                    project.users = project.users.filter(x => { return x.userProjects.id != id })
                    infoBoxContext.addInfo("Usunięto pracownika z projektu");
                }
                else {
                    infoBoxContext.addInfo("Wystąpił błąd");        
                }
            })
    }



    useEffect(() => {
        if (props.match.params.id)
            getProject(props.match.params.id);

    }, [props.match.params.id])

    useEffect(() => {
    }, [project, users, employeeToAdd])


    return (
        <div className="box box--large">
            {project && project.isRetired && <div className="form-editor__text form-editor__text--archive-small">Zarchiwizowany </div>}
            <div className="form-editor--inline box__item button--edit-box">
                <div className="button button--save button--gap" onClick={() => { updateProject() }}>Zaktualizuj</div>
                {project && !project.isRetired && <div className="button button--remove button--gap"
                    onClick={() => infoBoxContext.Confirm("Czy napewno chcesz zarchiwizować projekt", () => (archiveProject(project.id, true)))}>
                    Zarchiwizuj
                </div>}
                {project && project.isRetired && <div className="button button--gap"
                    onClick={() => infoBoxContext.Confirm("Czy napewno chcesz przywrócić projekt", () => (archiveProject(project.id, false)))}>
                    Przywróć
                </div>}
            </div>
            <div className="form-editor--inline">
                <div className="form-editor__text form-editor__text--vertical-center">Nazwa </div>
                <input className="form-editor__input" type="text" name="name" value={project ? project.name : ""} onChange={x => updateProjectData(x.target)} />
            </div>
            <div className="form-editor__text">Opis </div>
            <textarea className="form-editor__input form-editor__input--textarea" name="description" value={project ? project.description : ""} onChange={x => updateProjectData(x.target)} />
            {project && !project.isRetired && <div className="form-editor--inline">
                <div className="form-editor__text form-editor__text--vertical-center">Dodaj nowego pracownika: </div>
                <Select value={employeeToAdd} onChange={(x) => setEmployeeToAdd(x)} placeholder="Wybierz" noOptionsMessage={() => { return "Brak pracowników" }} options={users} className="form-editor__input form-editor__input--select " />
                <div className="button" onClick={() => addEmployee()} >Dodaj</div>
            </div>}
            <div className="form-editor__text">Przydzieleni pracownicy: </div>
            {project && project.users.filter(xx => { return xx.userProjects.isRetired == false }).map((x) => (
                <div key={`UserPE-${x.username}`} className="box__item form-editor__employe-box">
                    <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                    <div className="form-editor__employe-box--text  form-editor__employe-box--retired" onClick={() => infoBoxContext.Confirm("Czy napewno chcesz usunąć pracownika z projektu", () => (archiveUser(x.userProjects.id, true)))}> <i className="fas fa-ban"></i></div>
                </div>))}
            {project && !project.users.find(x => { return x.userProjects.isRetired == false }) &&
                <div className="form-editor__text">
                    Brak
            </div>}
            {project && project.users.find(x => { return x.userProjects.isRetired == true }) &&
                <>
                    <div className="form-editor__text  box--half-border-top">Byli pracownicy: </div>
                    {project && project.users.filter(xx => { return xx.userProjects.isRetired == true }).map((x) => (
                        <div key={`unUserPE-${x.username}`} className="box__item form-editor__employe-box">
                            <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                            <div className="form-editor__employe-box--text  form-editor__employe-box--restore" onClick={() => infoBoxContext.Confirm("Czy napewno chcesz przywrócić pracownika do projektu", () => (archiveUser(x.userProjects.id, false)))}>  <i className="fas fa-undo-alt"></i></div>
                            <div className="form-editor__employe-box--text  form-editor__employe-box--retired" onClick={() => infoBoxContext.Confirm("Czy napewno chcesz trwale usunąć pracownika z projektu", () => (removeUser(x.userProjects.id)))}>  <i className="fas fa-trash"></i></div>
                        </div>
                    ))}
                </>}
        </div>

    )

}