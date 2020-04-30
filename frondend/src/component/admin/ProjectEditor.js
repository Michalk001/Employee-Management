

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';

export const ProjectEditor = (props) => {


    useEffect(() => {
       console.log(props.match.params.id)

    }, [props.match.params.id])


    return (
        <div className="box box--large">
            <div className="box__item--inline">
                <div className="box__text">Nazwa </div>
                <input type="text" />
            </div>
            <div className="box__text">Opis </div>
            <textarea />
        </div>
    )

}