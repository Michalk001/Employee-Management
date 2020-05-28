import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import config from '../../../config.json'
import Cookies from 'js-cookie';
import { UserListPDF } from "../../reportCreation/UserListPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";


export const EmployeList = () => {

    const [userList, setUserList] = useState(null);
    const [filterUserList, setFilterUserList] = useState(null)
    const [filterOptions, setFilterOptions] = useState({ name: "", statusUser: "all" })
    const [isLoading, setIsLoading] = useState(true)
    const [reloadPDF, setReloadPDF] = useState(true);

    const getUsers = async () => {

        const result = await fetch(`${config.apiRoot}/user`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        });
        const data = await result.json();
        if (data.succeeded) {
            const users = userData(data.user);
            setUserList(users)
            setFilterUserList(users)
        }

        setIsLoading(false)
    }

    const userData = (data) => {
        let users = [];
        data.filter(x => { return !x.isRemove })
            .map(item => {
                let user = {};
                user.firstname = item.firstname;
                user.lastname = item.lastname;
                user.id = item.id;
                user.username = item.username
                user.isRetired = item.isRetired;
                let hoursActivProject = 0;
                let hoursRetireProject = 0;
                item.projects.map(project => {
                    if (!project.userProjects.isRetired) {
                        hoursActivProject += project.userProjects.hours;
                    }
                    else if (project.userProjects.isRetired && !project.userProjects.isRemove) {
                        hoursRetireProject += project.userProjects.hours;
                    }
                })
                user.hoursActivProject = hoursActivProject;
                user.hoursRetireProject = hoursRetireProject;
                user.hoursTotal = hoursRetireProject + hoursActivProject;
                user.activProjectQuantity = item.projects.filter((project) => !(project.userProjects.isRemove || project.userProjects.isRetired)).length
                user.totalProjectQuantity = item.projects.filter((project) => !(project.userProjects.isRemove)).length
                users.push(user);
            })
        return users;
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
        if (id == "filtr-all" && filterOptions.statusUser == "all")
            return "box__radio-button--active"
        else if (id == "filtr-active" && filterOptions.statusUser == "active")
            return "box__radio-button--active"
        else if (id == "filtr-inactive" && filterOptions.statusUser == "inactive")
            return "box__radio-button--active"

    }



    const filterList = () => {

        if (userList != null) {
            let list = userList.map((item) => {
                if ((item.firstname.toUpperCase() + " " + item.lastname.toUpperCase()).includes(filterOptions.name.toUpperCase())) {
                    return item
                }

            }).filter(item => item != undefined);

            if (filterOptions.statusProject == "inactive")
                list = list.filter(item => { return item.isRetired })
            else if (filterOptions.statusProject == "active")
                list = list.filter(item => { return !item.isRetired })
            setFilterUserList(list)
        }


    }
    useEffect(() => {
        filterList();
        setReloadPDF(true)
    }, [filterOptions])

    useEffect(() => {
     
    }, [userList, filterUserList])

    useEffect(() => {
        getUsers()

    }, [])
    useEffect(() => {
        setReloadPDF(false)

    }, [reloadPDF])
    return (
        <div className="box box--large">
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "></i></div>}

            <div className="box__item">
                <div className=" box__radio-button--position">
                    <div className="box__item--inline">
                        <label className={`box__radio-button ${isActiveRadio("filtr-all")}`} htmlFor={`filtr-all`}  >Wszystkie</label><input onChange={updateFilterOptions} className="box__project--radio" id="filtr-all" name="statusUser" value="all" type="radio" />
                        <label className={`box__radio-button ${isActiveRadio("filtr-active")}`} htmlFor={`filtr-active`} >Aktywne</label><input onChange={updateFilterOptions} className="box__project--radio" id="filtr-active" name="statusUser" value="active" type="radio" />
                        <label className={`box__radio-button ${isActiveRadio("filtr-inactive")}`} htmlFor={`filtr-inactive`} >Nieaktywne</label><input onChange={updateFilterOptions} className="box__project--radio" id="filtr-inactive" name="statusUser" value="inactive" type="radio" />
                    </div>
                    <div className="box__text"> Wyszukaj po nazwie</div>
                </div>
                <input placeholder="Wyszukaj..." type="text" className="box__input box__input--search" id="name" name="name" value={filterOptions.name} onChange={updateFilterOptions} />
            </div>
            <div className="box__text box__text--normal box__project">
                <span className="box__project--title-name ">Nazwa</span>
                <span className="box__project--title-hours ">Liczba godzin </span>
                <span className="box__project--employe ">Liczba aktywnych projektów</span>
                <span className="box__project--employe-short ">Liczba projektów</span>
                <span className="box__project--title-status ">Status</span>
            </div>
            {filterUserList && <>
                {userList.length == 0 && <div className="box__item">
                    <div className="box__text box__text--center">Brak Pracowników</div>
                </div>}
                {userList.length != 0 && filterUserList.length == 0 && <div className="box__item">
                    <div className="box__text box__text--center">Nie znaleziono Pracowników</div>
                </div>}


                {userList.length != 0 && filterUserList.map((item) => (
                    <Link to={`/user/${item.username}`} key={`activU-${item.username}`} className="box__project box__project--hover">
                        <span className="box__project--name ">{item.firstname} {item.lastname}</span>
                        <span className="box__project--hours">{item.hoursTotal}</span>
                        <span className="box__project--employe">{item.activProjectQuantity}</span>
                        <span className="box__project--employe-short">{item.totalProjectQuantity}</span>
                        <span className="box__project--status ">{projectStatus(item.isRetired)}</span>

                    </Link>
                ))}
                <div className="box__text box--half-border-top">Raport:</div>
                <div className="box__item">
                    {!isLoading && !reloadPDF && filterUserList != null && <PDFDownloadLink
                        document={<UserListPDF data={filterUserList} />}
                        fileName={`Employe-List-Report.pdf`}
                        className="button"
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? "Ładowanie" : "Pobierz"
                        }
                    </PDFDownloadLink>}

                </div>

            </>}
        </div>


    )



} 