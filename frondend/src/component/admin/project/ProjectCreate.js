

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import { InfoBoxContext } from '../../../context/InfoBox/InfoBoxContext';
import config from '../../../config.json'
import Cookies from 'js-cookie';
import { Project } from "../../user/Project";
import Select from 'react-select'



export const ProjectCreate = (props) => {

    const infoBoxContext = useContext(InfoBoxContext);
    const [project, setProject] = useState({});
    const [users, setUsers] = useState([]);
    const [employeeToAdd, setEmployeeToAdd] = useState(null);
    const [isValidName, setIsValidName] = useState(true);
    const updateProjectData = e => {
        setProject({ ...project, [e.target.name]: e.target.value })
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
                        .map(x => {
                            return { label: x.firstname + " " + x.lastname, value: x.id, username: x.username, firstname: x.firstname, lastname: x.lastname }

                        });

                    setUsers(usersTmp)

                }

            })
    }
    const createProject = async () => {

        if (!project.name || project.name.replace(/ /g, '') == '') {
            setIsValidName(false)
            infoBoxContext.addInfo("Wymagana nazwa projektu");
            return
        }
        await fetch(`${config.apiRoot}/project/`, {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ project })
        })
            .then(res => res.json())
            .then(res => {
                if (res.succeeded) {
                    infoBoxContext.addInfo("Utworzono projekt");
                    setProject(null)
                    setIsValidName(true)
                }
                else {
                    infoBoxContext.addInfo("Wystąpił błąd");
                }
            })
    }

    const addEmployee = () => {

        if (employeeToAdd == null)
            return
        if (!project.users) {
            setProject({ ...project, users: [{ id: employeeToAdd.value, firstname: employeeToAdd.firstname, lastname: employeeToAdd.lastname, username: employeeToAdd.username }] });
        }
        else {
            project.users.push({ id: employeeToAdd.value, firstname: employeeToAdd.firstname, lastname: employeeToAdd.lastname, username: employeeToAdd.username })
        }
        setUsers(users.filter(x => x.value != employeeToAdd.value))

        setEmployeeToAdd(null)
    }

    const removeEmployee = (id) => {
        const user = project.users.find(x => x.id == id);
        const usersTmp = project.users.filter(x => x.id != id)
        setProject({ ...project, users: usersTmp })
        setUsers([...users, { label: user.firstname + " " + user.lastname, value: user.id, username: user.username, firstname: user.firstname, lastname: user.lastname }]);
    }

    useEffect(() => {
        getUser();
    }, [])

    useEffect(() => {

    }, [users, employeeToAdd, project])

    const validInput = (field) => {
        return field == false ? ` box__input--require` : ""
    }

    return (
        <div className="box box--large">
            <div className="form-editor--inline box__item button--edit-box">
                <div className="button button--save button--gap" onClick={() => { createProject() }}>Utwórz nowy projekt</div>

            </div>
            <div className="form-editor--inline-flex-wrap ">
                <div className="form-editor__item--input-box form-editor__item--project-name">
                    <div className="form-editor__text form-editor__text--vertical-center form-editor__text--require">Nazwa</div>
                    <input className={`form-editor__input form-editor__input--large form-editor__input--editor ${validInput(isValidName)}`} type="text" name="name" value={project.name ? project.name : ""} onChange={updateProjectData} />
                </div>
            </div>
            <div className="form-editor__text">Opis </div>
            <textarea className="form-editor__input form-editor__input--textarea" name="description" value={project.description ? project.description : ""} onChange={updateProjectData} />
            <div className="form-editor--inline">
                <div className="form-editor__text form-editor__text--vertical-center">Dodaj nowego pracownika: </div>
                <Select value={employeeToAdd} onChange={setEmployeeToAdd} placeholder="Wybierz" noOptionsMessage={() => { return "Brak pracowników" }} options={users} className="form-editor__input form-editor__input--select " />
                <div className={`button ${!employeeToAdd ? `button--disabled` : ``}`} onClick={() => addEmployee()} >Dodaj</div>
            </div>
            <div className="form-editor__text">Przydzieleni pracownicy: </div>
            {project.users && project.users.map((x) => (
                <div key={`UserPE-${x.username}`} className="box__item form-editor__employe-box">
                    <div className="form-editor__employe-box--text  form-editor__employe-box--name " >{x.firstname} {x.lastname}</div>
                    <div className="form-editor__employe-box--text  form-editor__employe-box--retired" onClick={() => removeEmployee(x.id)} > <i className="fas fa-ban"></i></div>
                </div>))}
            {(!project.users || project.users.length == 0) &&
                <div className="form-editor__text">
                    Brak
            </div>}
            <div className="form-editor__text form-editor__text--require-string">* Pole wymagane </div>
        </div>

    )

}