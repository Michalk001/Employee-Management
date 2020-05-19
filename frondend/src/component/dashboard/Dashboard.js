import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';

export const Dashboard = () => {


    const [activeProject, setActiveProject] = useState([]);
    const authContext = useContext(AuthContext)

    const getProject = async () => {
        if (!authContext.userDate)
            return;
        await fetch(`${config.apiRoot}/user/${authContext.userDate.username}`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.succeeded) {
                    const activePro = res.user.projects.filter(x => (!x.userProjects.isRemove || !x.userProjects.isRetired))
                        .map(x => ({
                            name: x.name,
                            idProject: x.id,
                            hours: x.userProjects.hours
                        })
                        )
                    console.log(activePro)
                    setActiveProject(activePro)
                }

            })

    }

    useEffect(() => {
        getProject();
    }, [authContext.userDate])

    useEffect(() => {
    }, [activeProject, authContext.userDate])

    return (
        <div className="box">
            <div className="box__text box__text--center  ">Aktywne Projekty</div>
            <div className="box__text box__text--normal box__project ">
                <span className="box__project--name ">Nazwa</span>
                <span className="box__project--hours ">Godziny</span>

            </div>
            <div className="box__scroll">
                {activeProject.map((x, index) => (
                    <Link to={`/project/${x.idProject}`} key={`activP-${index}`} className="box__project box__project--hover">
                        <span className="box__project--name ">{x.name}</span>
                        <span className="box__project--hours ">{x.hours}</span>
                    </Link>
                ))}
            </div>
        </div>

    )

}