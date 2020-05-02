

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { InfoBoxContext } from '../../context/InfoBox/InfoBoxContext';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { Project } from "../user/Project";

export const ProjectEditor = (props) => {

    const infoBoxContext = useContext(InfoBoxContext);
    const [project, setProject] = useState(null);


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

            })
    }

    const updateProject = async () => {
        console.log({ ...project, isRetired: null })
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

    useEffect(() => {
        if (props.match.params.id)
            getProject(props.match.params.id)

    }, [props.match.params.id])

    useEffect(() => {
        console.log(project)
    }, [project])


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
            <div className="box__text">Opis </div>
            <textarea className="form-editor__input form-editor__input--textarea" name="description" value={project ? project.description : ""} onChange={x => updateProjectData(x.target)} />
            <div className="box__text ">Przydzieleni pracownicy: </div>
            {project && project.users.filter(xx => { return xx.userProjects.isRetired == false }).map((x) => (
                <div key={`UserPE-${x.username}`} className="box__item form-editor__employe-box">
                    <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                    <div className="form-editor__employe-box--text  form-editor__employe-box--retired" onClick={() => infoBoxContext.Confirm("Czy napewno chcesz usunąć pracownika z projektu", () => (archiveUser(x.userProjects.id, true)))}> <i className="fas fa-ban"></i></div>
                </div>))}
            {project && !project.users.find(x => { return x.userProjects.isRetired == false }) &&
                <div className="box__text">
                    Brak
            </div>}
            {project && project.users.find(x => { return x.userProjects.isRetired == true }) &&
                <>
                    <div className="box__text  box--half-border-top">Byli pracownicy: </div>
                    {project && project.users.filter(xx => { return xx.userProjects.isRetired == true }).map((x) => (
                        <div key={`unUserPE-${x.username}`} className="box__item form-editor__employe-box">
                            <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                            <div className="form-editor__employe-box--text  form-editor__employe-box--retired" onClick={() => infoBoxContext.Confirm("Czy napewno chcesz przywrócić pracownika do projektu", () => (archiveUser(x.userProjects.id, false)))}>  <i className="fas fa-undo-alt"></i></div>
                        </div>
                    ))}
                </>}
        </div>

    )

}