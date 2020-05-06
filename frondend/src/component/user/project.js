import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';

export const Project = (props) => {

    const [project, setProject] = useState(null);
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
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

    const validHoursField = (e, fun) => {
        const reg = /^\d+$/;
        if ((e.value.length <= 3 && reg.test(e.value)) || e.value == "") {
            fun(e);
        }

    }
    useEffect(() => {
        getProject(props.match.params.id)

    }, [props.match.params.id])

    useEffect(() => {
        getCurrentUserInfo();

    }, [project])

    useEffect(() => {
        console.log(currentUserInfo)
    }, [currentUserInfo])


    return (
        <>{project &&
            <div className="box box--large" >
                {project && project.isRetired && <div className="form-editor__text form-editor__text--archive-small">Zarchiwizowany </div>}
                <div className="box__item--inline box__item--full-width box__item button--edit-box">
                    <Link to={`/admin/project/edit/${project.id}`} className="button">EDYTUJ</Link>
                </div>
                <div className="box__text box__item box--half-border-bottom">
                    <span className="box__text--bold ">Projekt: </span>
                    <span className="box__text--bold ">{project.name}</span>
                </div>
                <div className="box__item--inline">
                    <div className="box__text box__text--bold box__text--vertical-center  ">Ilość godzin łącznie: </div>
                    <div className="box__text box__text--vertical-center "> {currentUserInfo && currentUserInfo.userProjects.hours}</div>
                    <input className="box__input box__input--add-hours" type="text" name="newHours"  value={currentUserInfo && currentUserInfo.newHours ? currentUserInfo.newHours : ""} onChange={(x) => validHoursField(x.target, x => setCurrentUserInfo({...currentUserInfo, [x.name]:x.value}))}  />
                </div>
                
                {project.description && <>
                    <div className="box__text ">Opis: </div>
                    <div className="box__text  box__item box__item--description ">
                        {project.description}
                    </div>
                </>}
                {!project.description && <div className="box__text  box__item box--half-border-bottom">
                    Brak Opisu
                </div>}
                {project.users && project.users.length != 0 && <>
                    <div className="box__text ">Przydzieleni pracownicy: </div>
                    <div className="box--employe-list  box--half-border-bottom">
                        {project.users.filter(xx => { return xx.userProjects.isRetired == false }).map((x) => (
                            <Link className="box__text  box__item box__item--employe" key={`emploact-${x.username}`} to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                        ))}
                    </div>
                </>}
                {project.users && project.users.length != 0 && project.users.find(x => { return x.userProjects.isRemove == true }) && <>
                    <div className="box__text ">Byli pracownicy: </div>
                    <div className="box--employe-list ">
                        {(project.users.filter(xx => { return xx.userProjects.isRetired == true })).map((x) => (
                            <Link className="box__text  box__item box__item--employe" key={`emploact-${x.username}`} to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                        ))}
                    </div>
                </>}
            </div>
        }</>
    )


}
