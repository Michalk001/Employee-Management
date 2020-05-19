import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import config from '../../../config.json'
import Cookies from 'js-cookie';



export const ProjectList = () => {

    const [projectList, setProjectList] = useState(null);
    const [filterProjectList, setFilterProjectList] = useState(null)

    const getProjects = async () => {
        await fetch(`${config.apiRoot}/project`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.succeeded) {

                    let projects = [];

                    res.projects.filter(x => { return !x.isRemove })
                        .map(item => {
                            let project = {};
                            project.name = item.name;
                            project.id = item.id;
                            project.isRetired = item.isRetired;
                            let hoursActivUser = 0;
                            let hoursRetiredUser = 0;
                            item.users.map(user => {
                                if (!user.userProjects.isRetired) {
                                    hoursActivUser += user.userProjects.hours;
                                }
                                else if (user.userProjects.isRetired && !user.userProjects.isRemove) {
                                    hoursRetiredUser += user.userProjects.hours;
                                }
                            })
                            project.hoursActivUser = hoursActivUser;
                            project.hoursRetiredUser = hoursRetiredUser;
                            project.hoursTotal = hoursRetiredUser + hoursActivUser;
                            project.activUserQuantity = item.users.filter((user) => !(user.userProjects.isRemove || user.userProjects.isRetired)).length
                            project.totalUserQuantity = item.users.filter((user) => !(user.userProjects.isRetired)).length
                            projects.push(project);
                        })

                    setProjectList(projects)
                    setFilterProjectList(projects)
                }

            })
    }

    const projectStatus = (status) => {
        if (!status)
            return "Aktywny"
        else {
            return "Nieaktywny"
        }
    }

    useEffect(() => {
        getProjects()
    }, [])

    useEffect(() => {
        console.log(filterProjectList)
    }, [projectList, filterProjectList])

    return (
        <div className="box box--large">

            <div className="box__item--inline">
                <div> <label htmlFor={`filtr-all`}  >Wszystkie</label><input className="box__project--radio" id="filtr-all" name="filtrActive" value="all" type="radio" /></div>
                <div><label  htmlFor={`filtr-active`} >Aktywne</label><input className="box__project--radio" id="filtr-active" name="filtrActive" value="active" type="radio" /></div>
                <div><label  htmlFor={`filtr-inactive`} >Nieaktywne</label><input className="box__project--radio" id="filtr-inactive" name="filtrActive" value="inactive" type="radio" /></div>
            </div>

            <div className="box__text box__text--normal box__project">
                <span className="box__project--title-name ">Nazwa</span>
                <span className="box__project--title-hours ">Liczba godzin </span>
                <span className="box__project--employe ">Liczba aktywnych pracowników</span>
                <span className="box__project--employe-short ">Liczba pracowników</span>
                <span className="box__project--title-status ">Status</span>
            </div>
            {filterProjectList && filterProjectList.map((item) => (
                <Link to={`/project/${item.id}`} key={`activP-${item.id}`} className="box__project box__project--hover">
                    <span className="box__project--name ">{item.name}</span>
                    <span className="box__project--hours">{item.hoursTotal}</span>
                    <span className="box__project--employe">{item.activUserQuantity}</span>
                    <span className="box__project--employe-short">{item.totalUserQuantity}</span>
                    <span className="box__project--status ">{projectStatus(item.isRetired)}</span>

                </Link>
            ))}
        </div>
    )



} 