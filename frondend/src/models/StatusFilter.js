import React, {useEffect, useState} from "react";
import {useTranslation} from 'react-i18next';


export const StatusFilter = ({listRaw, setFilterList}) => {

    const [filterOptions, setFilterOptions] = useState({ name: "", status: "all" })
    const {t} = useTranslation('common');
    const filterList = () => {

        if (listRaw != null) {
            let list = listRaw.map((item) => {
                if (item.search.includes(filterOptions.name.toUpperCase())) {
                    return item
                }

            }).filter(item => item !== undefined);
            if (filterOptions.status === "inactive")
                list = list.filter(item => {
                    return item.isRetired
                })
            else if (filterOptions.status === "active")
                list = list.filter(item => {
                    return !item.isRetired
                })
            setFilterList(list)
        }


    }

    const updateFilterOptions = (event) => {
        setFilterOptions({...filterOptions, [event.target.name]: event.target.value})
    }

    const isActiveRadio = (id) => {
        if (id === "filter-all" && filterOptions.status === "all")
            return "box__radio-button--active"
        else if (id === "filter-active" && filterOptions.status === "active")
            return "box__radio-button--active"
        else if (id === "filter-inactive" && filterOptions.status === "inactive")
            return "box__radio-button--active"

    }

    useEffect(() => {
        filterList()
    }, [filterOptions])

    return (
        <div className="box__item">
            <div className=" box__radio-button--position">
                <div className="box__radio-button--select-list">
                    <label className={`box__radio-button ${isActiveRadio("filter-all")}`}
                           htmlFor={`filter-all`}>{t('list.all')}</label>
                    <input onChange={updateFilterOptions}
                           className="box__project--radio"
                           id="filter-all"
                           name="status"
                           value="all" type="radio"/>
                    <label className={`box__radio-button ${isActiveRadio("filter-active")}`}
                           htmlFor={`filter-active`}>{t('list.active')}</label>
                    <input onChange={updateFilterOptions}
                           className="box__project--radio"
                           id="filter-active"
                           name="status"
                           value="active" type="radio"/>
                    <label className={`box__radio-button ${isActiveRadio("filter-inactive")}`}
                           htmlFor={`filter-inactive`}>{t('list.inactive')}</label>
                    <input onChange={updateFilterOptions}
                           className="box__project--radio"
                           id="filter-inactive"
                           name="status"
                           value="inactive"
                           type="radio"/>
                </div>
            </div>
            <input placeholder={`${t('list.search')}...`} type="text" className="box__input box__input--search"
                   id="name" name="name" value={filterOptions.name} onChange={updateFilterOptions}/>
        </div>
    )

}