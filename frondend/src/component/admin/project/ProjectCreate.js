import React, {useState, useEffect, useContext} from "react";

import {InfoBoxContext} from '../../../context/InfoBox/InfoBoxContext';
import config from '../../../config.json'
import Select from 'react-select'

import {useTranslation} from 'react-i18next';
import {FetchGet} from "../../../models/Fetch";

export const ProjectCreate = () => {


    const {t} = useTranslation('common');
    const infoBoxContext = useContext(InfoBoxContext);
    const [project, setProject] = useState({});
    const [users, setUsers] = useState([]);
    const [employeeToAdd, setEmployeeToAdd] = useState(null);
    const [isValidName, setIsValidName] = useState(true);
    const updateProjectData = e => {
        setProject({...project, [e.target.name]: e.target.value})
    }


    const getUser = async () => {
        const result = await FetchGet(`${config.apiRoot}/user/`);

        const data = await result.json();
        if (data.succeeded) {
            const usersTmp = data.user
                .filter(x => {
                    return (x.isRetired === false && x.isRemove === false)
                })
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

    const valid = () => {
        if (!project.name || project.name.replace(/ /g, '') === '') {
            setIsValidName(false)
            infoBoxContext.addInfo(t('infoBox.requireName'), 3);
            return false
        }
        return true;
    }

    const createProject = async () => {
        if (!valid())
            return
        const result = await FetchGet(`${config.apiRoot}/project/`);

        const response = await result.json();

        if (response.succeeded) {
            infoBoxContext.addInfo(t('infoBox.createProject'), 3);
            setProject({})
            setIsValidName(true)
        } else {
            infoBoxContext.addInfo(t('infoBox.error'), 3);
        }
    }

    const addEmployee = () => {

        if (employeeToAdd == null)
            return
        if (!project.users) {
            setProject({
                ...project,
                users: [{
                    id: employeeToAdd.value,
                    firstname: employeeToAdd.firstname,
                    lastname: employeeToAdd.lastname,
                    username: employeeToAdd.username
                }]
            });
        } else {
            project.users.push({
                id: employeeToAdd.value,
                firstname: employeeToAdd.firstname,
                lastname: employeeToAdd.lastname,
                username: employeeToAdd.username
            })
        }
        setUsers(users.filter(x => x.value !== employeeToAdd.value))

        setEmployeeToAdd(null)
    }

    const removeEmployee = (id) => {
        const user = project.users.find(x => x.id === id);
        const usersTmp = project.users.filter(x => x.id !== id)
        setProject({...project, users: usersTmp})
        setUsers([...users, {
            label: user.firstname + " " + user.lastname,
            value: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname
        }]);
    }

    useEffect(() => {
        getUser();
        document.title = t('title.newProject')
    }, [])

    useEffect(() => {

    }, [users, employeeToAdd, project])

    const validInput = (field) => {
        return field === false ? ` box__input--require` : ""
    }

    return (
        <div className="box box--large">
            <div className="form-editor--inline box__item button--edit-box">
                <div className="button button--save button--gap" onClick={async () => {
                    await createProject()
                }}>{t('button.createProject')}</div>

            </div>
            <div className="form-editor--inline-flex-wrap ">
                <div className="form-editor__item--input-box form-editor__item--project-name">
                    <div
                        className="form-editor__text form-editor__text--vertical-center form-editor__text--require">{t('project.name')}</div>
                    <input id="nameCreatePro"
                           className={`form-editor__input form-editor__input--large form-editor__input--editor ${validInput(isValidName)}`}
                           type="text" name="name" value={project.name ? project.name : ""}
                           onChange={updateProjectData}/>
                </div>
            </div>
            <div className="form-editor__text">{t('project.description')} </div>
            <textarea className="form-editor__input form-editor__input--textarea" id="descriptionCreatePro"
                      name="description" value={project.description ? project.description : ""}
                      onChange={updateProjectData}/>
            <div className="form-editor--inline">
                <div
                    className="form-editor__text form-editor__text--vertical-center">{t('project.addNewEmployee')} </div>
                <Select value={employeeToAdd} onChange={setEmployeeToAdd} placeholder={t('project.select')}
                        noOptionsMessage={() => {
                            return t('project.emptyEmployeeList')
                        }} options={users} className="form-editor__input form-editor__input--select "/>
                <div className={`button ${!employeeToAdd ? `button--disabled` : ``}`}
                     onClick={() => addEmployee()}>{t('button.add')}</div>
            </div>
            <div className="form-editor__text">{t('project.activeEmployee')}:</div>
            {project.users && project.users.map((x) => (
                <div key={`UserPE-${x.username}`} className="box__item form-editor__employeebox">
                    <div
                        className="form-editor__employee-box--text  form-editor__employee-box--name ">{x.firstname} {x.lastname}</div>
                    <div className="form-editor__employee-box--text  form-editor__employee-box--retired"
                         onClick={() => removeEmployee(x.id)}><i className="fas fa-ban"/></div>
                </div>))}
            {(!project.users || project.users.length === 0) &&
            <div className="form-editor__text">
                {t('project.non')}
            </div>}
            <div className="form-editor__text form-editor__text--require-string">* {t('common.require')} </div>
        </div>

    )

}