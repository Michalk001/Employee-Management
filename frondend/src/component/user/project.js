import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';

export const Project = (props) => {


    const [project, setProject] = useState(null);

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

    useEffect(() => {
        getProject(props.match.params.id)

    }, [props.match.params.id])

    useEffect(() => {

    }, [project])

    return (
        <>{project &&
            <div className="box box--large" >
                <div className="box__item--inline box__item button--edit-box">
                    <Link to={`/admin/project/edit/${project.id}`} className="button">EDYTUJ</Link>
                </div>
                <div className="box__text box__item box--half-border-bottom">
                    <span className="box__text--bold ">Projekt: </span>
                    <span className="box__text--bold ">{project.name}</span>
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
                        {project.users.map((x) => (
                            <Link className="box__text  box__item box__item--employe" key={`emploact-${x.username}`} to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                        ))}
                    </div>
                </>}
                {project.users && project.users.length != 0 && project.users.find(x => { return x.userProjects.isRemove == true }) && <>
                    <div className="box__text ">Byli pracownicy: </div>
                    <div className="box--employe-list ">
                        {(project.users.filter(xx => { return xx.userProjects.isRemove == true })).map((x) => (
                            <Link className="box__text  box__item box__item--employe" key={`emploact-${x.username}`} to={`/user/${x.username}`}>{x.firstname} {x.lastname}</Link>
                        ))}
                    </div>
                </>}
            </div>
        }</>
    )


}
