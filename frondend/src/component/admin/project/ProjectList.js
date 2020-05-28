import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import config from '../../../config.json'
import Cookies from 'js-cookie';
import { ProjectListPDF } from "../../reportCreation/ProjectListPDF";
import { PDFDownloadLink,BlobProvider } from "@react-pdf/renderer";



export const ProjectList = () => {

    const [projectList, setProjectList] = useState(null);
    const [filterProjectList, setFilterProjectList] = useState(null)
    const [filterOptions, setFilterOptions] = useState({ name: "", statusProject: "all" })
    const [isLoading, setIsLoading] = useState(true)
    const [reloadPDF, setReloadPDF] = useState(true);

    const getProjects = async () => {

        const result = await fetch(`${config.apiRoot}/project`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        })
        const data = await result.json();

        if (data.succeeded) {
            const projects = projectData(data.projects)
            setProjectList(projects)
            setFilterProjectList(projects)
        }
        setIsLoading(false)
    }

    const projectData = (data) => {
        let projects = [];
        data.filter(x => { return !x.isRemove })
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
                project.totalUserQuantity = item.users.filter((user) => !(user.userProjects.isRemove)).length
                projects.push(project);
            })
        return projects;
    }


    const projectStatus = (status) => {
        if (!status)
            return "Aktywny"
        else {
            return "Nieaktywny"
        }
    }
    const updateFilterOptions = (event) => {

        setFilterOptions({ ...filterOptions, [event.target.name]: event.target.value })
    }
    const isActiveRadio = (id) => {
        if (id == "filtr-all" && filterOptions.statusProject == "all")
            return "box__radio-button--active"
        else if (id == "filtr-active" && filterOptions.statusProject == "active")
            return "box__radio-button--active"
        else if (id == "filtr-inactive" && filterOptions.statusProject == "inactive")
            return "box__radio-button--active"

    }

    useEffect(() => {
        getProjects()

    }, [])

    const filterList = () => {

        if (projectList != null) {
            let list = projectList.map((item) => {
                if (item.name.toUpperCase().includes(filterOptions.name.toUpperCase())) {
                    return item
                }

            }).filter(item => item != undefined);

            if (filterOptions.statusProject == "inactive")
                list = list.filter(item => { return item.isRetired })
            else if (filterOptions.statusProject == "active")
                list = list.filter(item => { return !item.isRetired })
            setFilterProjectList(list)
        }


    }
    useEffect(() => {
        filterList();
        setReloadPDF(false)
    }, [filterOptions])

    useEffect(() => {

      
    }, [projectList, filterProjectList, isLoading])

    useEffect(() => {
        setReloadPDF(true)
       
    }, [reloadPDF])

    return (
        <div className="box box--large">
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "></i></div>}

            <div className="box__item">
                <div className=" box__radio-button--position">
                    <div className="box__item--inline">
                        <label className={`box__radio-button ${isActiveRadio("filtr-all")}`} htmlFor={`filtr-all`}  >Wszystkie</label><input onChange={updateFilterOptions} className="box__project--radio" id="filtr-all" name="statusProject" value="all" type="radio" />
                        <label className={`box__radio-button ${isActiveRadio("filtr-active")}`} htmlFor={`filtr-active`} >Aktywne</label><input onChange={updateFilterOptions} className="box__project--radio" id="filtr-active" name="statusProject" value="active" type="radio" />
                        <label className={`box__radio-button ${isActiveRadio("filtr-inactive")}`} htmlFor={`filtr-inactive`} >Nieaktywne</label><input onChange={updateFilterOptions} className="box__project--radio" id="filtr-inactive" name="statusProject" value="inactive" type="radio" />
                    </div>
                    <div className="box__text"> Wyszukaj po nazwie</div>
                </div>
                <input placeholder="Wyszukaj..." type="text" className="box__input box__input--search" id="name" name="name" value={filterOptions.name} onChange={updateFilterOptions} />
            </div>
            <div className="box__text box__text--normal box__project">
                <span className="box__project--title-name ">Nazwa</span>
                <span className="box__project--title-hours ">Liczba godzin </span>
                <span className="box__project--employe ">Liczba aktywnych pracowników</span>
                <span className="box__project--employe-short ">Liczba pracowników</span>
                <span className="box__project--title-status ">Status</span>
            </div>
            {!isLoading && filterProjectList && <>
                {projectList.length == 0 && <div className="box__item">
                    <div className="box__text box__text--center">Brak Projektów</div>
                </div>}
                {projectList.length != 0 && filterProjectList.length == 0 && <div className="box__item">
                    <div className="box__text box__text--center">Nie znaleziono Projektów</div>
                </div>}
                {projectList.length != 0 && filterProjectList.map((item) => (
                    <Link to={`/project/${item.id}`} key={`activP-${item.id}`} className="box__project box__project--hover">
                        <span className="box__project--name ">{item.name}</span>
                        <span className="box__project--hours">{item.hoursTotal}</span>
                        <span className="box__project--employe">{item.activUserQuantity}</span>
                        <span className="box__project--employe-short">{item.totalUserQuantity}</span>
                        <span className="box__project--status ">{projectStatus(item.isRetired)}</span>

                    </Link>
                ))}
            </>}
            <div className="box__text box--half-border-top">Raport:</div>
            <div className="box__item">
                {!isLoading && reloadPDF && filterProjectList != null && <PDFDownloadLink
                    document={<ProjectListPDF data={filterProjectList} />}
                    fileName={`Project-List-Report.pdf`}
                    className="button"
                >
                    {({ blob, url, loading, error }) =>
                        loading ? "Ładowanie" : "Pobierz"
                    }
                </PDFDownloadLink>}

            </div>
        </div>
    )



} 