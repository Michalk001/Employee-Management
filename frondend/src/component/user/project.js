import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';

import { InfoBoxContext } from '../../context/InfoBox/InfoBoxContext';

export const Project = (props) => {

    const [project, setProject] = useState(null);
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const infoBoxContext = useContext(InfoBoxContext);
    const authContext = useContext(AuthContext)
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

    const getCurrentUserInfo = () => {
        if (project != null) {
            if (project.users)
                if (authContext.isLogin) {
                    const userData = project.users.find(x => { return x.username == authContext.userDate.username && x.userProjects.isRemove == false })
                    if (userData != undefined)
                        setCurrentUserInfo(userData)
                }
        }

    }

    const addHours = async () => {
        if (currentUserInfo && currentUserInfo.newHours != null) {
            let newHours = +currentUserInfo.newHours + +currentUserInfo.userProjects.hours;
            if (newHours < 0)
                newHours = 0
            await updateUserHours(currentUserInfo.userProjects.id, newHours)
                .then(res => res.json())
                .then(res => {
                    if (res.succeeded) {

                        currentUserInfo.userProjects.hours = newHours

                        infoBoxContext.addInfo("Dodano godziny pracy");
                    }
                    else {
                        infoBoxContext.addInfo("Wystąpił błąd");
                    }

                })
            setCurrentUserInfo({ ...currentUserInfo, newHours: null })
        }
    }

    const removeHours = async () => {
        if (currentUserInfo && currentUserInfo.newHours != null) {
            let newHours = +currentUserInfo.userProjects.hours - +currentUserInfo.newHours;
            if (newHours < 0)
                newHours = 0
            await updateUserHours(currentUserInfo.userProjects.id, newHours)
                .then(res => res.json())
                .then(res => {
                    if (res.succeeded) {
                        currentUserInfo.userProjects.hours = newHours

                        infoBoxContext.addInfo("Zmniejszono godziny pracy");
                    }
                    else {
                        infoBoxContext.addInfo("Wystąpił błąd");
                    }

                })

            setCurrentUserInfo({ ...currentUserInfo, newHours: 0 })
        }
    }

    const updateUserHours = async (id, quantity) => {
        return await fetch(`${config.apiRoot}/userproject/${id}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ userProject: { hours: quantity } })
        })


    }


    const validHoursField = (e, fun) => {
        const reg = /^\d+$/;
        if ((e.value.length <= 10 && reg.test(e.value)) || e.value == "") {
            fun(e);
        }

    }
    useEffect(() => {
        const asyncEffect = async () => {
           await getProject(props.match.params.id)
        }
        asyncEffect()

    }, [props.match.params.id])

    useEffect(() => {
        getCurrentUserInfo();

    }, [project])

    useEffect(() => {
    }, [currentUserInfo])


    return (
        <>{project &&
            <div className="box box--large" >
                {project && project.isRetired && <div className="form-editor__text form-editor__text--archive-small">Zarchiwizowany </div>}
                {authContext.isAdmin && <div className="box__item--inline box__item--full-width box__item button--edit-box">
                    <Link to={`/admin/project/edit/${project.id}`} className="button">EDYTUJ</Link>
                </div>}
                <div className="box__text box__item ">
                    <span className="box__text--bold ">Projekt: </span>
                    <span className="box__text--bold ">{project.name}</span>
                </div>
                {currentUserInfo && <div className="box__item box--half-border-top">
                    <div className="box__item--inline">
                        <div className="box__text box__text--bold box__text--vertical-center  ">Ilość twoich godzin łącznie: </div>
                        <div className="box__text box__text--vertical-center "> {currentUserInfo && currentUserInfo.userProjects.hours}</div>
                    </div>
                </div>
                }
                {project && !project.isRetired && currentUserInfo && !currentUserInfo.userProjects.isRemove && !currentUserInfo.userProjects.isRetired &&
                    <div className="box__item">
                        <div className="box__item--inline">
                            <div className="box__text box__text--bold box__text--vertical-center  ">Nowe godziny</div>
                            <input className="box__input box__input--add-hours" type="text" name="newHours" value={currentUserInfo && currentUserInfo.newHours ? currentUserInfo.newHours : ""} onChange={(x) => validHoursField(x.target, x => setCurrentUserInfo({ ...currentUserInfo, [x.name]: x.value }))} />
                            <div className={`button button--gap ${!currentUserInfo || !currentUserInfo.newHours ? `button--disabled` : ``}`} onClick={() => addHours()}>Dodaj</div>
                            <div className={`button button--gap ${!currentUserInfo || !currentUserInfo.newHours ? `button--disabled` : ``}`} onClick={() => removeHours()}>Odejmnij</div>
                        </div>
                    </div>
                }
                {project.description && <>
                    <div className="box__text box--half-border-top ">Opis: </div>
                    <div className="box__text box__item box__item--description ">
                        {project.description}
                    </div>
                </>}
                {!project.description && <div className="box__text  box__item box--half-border-bottom   ">
                    Brak Opisu
                </div>}
                {project.users && project.users.find(x => { return (x.userProjects.isRetired == false && x.userProjects.isRemove == false) }) && <>
                    <div className="box__text ">Przydzieleni pracownicy: </div>
                    <div className="box--employe-list ">
                        {project.users.filter(x => { return x.userProjects.isRetired == false && x.userProjects.isRemove == false }).map((x) => (
                            <Link className="box__text  box__item box__item--employe" key={`emploact-${x.username}`} to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                        ))}
                    </div>
                </>}
                {project.users && project.users.find(x => { return (x.userProjects.isRetired == true && x.userProjects.isRemove == false) }) && <>
                    <div className="box__text box--half-border-bottom">Byli pracownicy: </div>
                    <div className="box--employe-list ">
                        {(project.users.filter(x => { return (x.userProjects.isRetired == true && x.userProjects.isRemove == false) })).map((x) => (
                            <Link className="box__text  box__item box__item--employe" key={`emploact-${x.username}`} to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                        ))}
                    </div>
                </>}

            </div>
        }</>
    )


}
