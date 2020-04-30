

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { InfoBoxContext } from '../../context/InfoBox/InfoBoxContext';
import config from '../../config.json'
import Cookies from 'js-cookie';

export const ProjectEditor = (props) => {

    const infoBoxContext = useContext(InfoBoxContext);  

    const t2 = () =>{
        console.log(1111111111111111111)
    }

    const test = () =>{

    }

    useEffect(() => {
        console.log(props.match.params.id)

    }, [props.match.params.id])


    return (
        <div className="box box--large">
            <div className="form-editor--inline box__item button--edit-box">
                <div className="button button--gap">Zapisz</div>
                <div className="button button--save button--gap">Zaktualizuj</div>
                <div className="button button--remove button--gap">Zarchiwizuj</div>
            </div>
            <div className="form-editor--inline">
                <div className="form-editor__text form-editor__text--vertical-center">Nazwa </div>
                <input className="form-editor__input" type="text" />
            </div>
            <div className="box__text">Opis </div>
            <textarea className="form-editor__input form-editor__input--textarea " />
            <div className="box__text ">Przydzieleni pracownicy: </div>

            <div className="box__item form-editor__employe-box">
                <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/`}>Adam Nowak</Link>
                <div className="form-editor__employe-box--text  form-editor__employe-box--retired" > <i class="fas fa-ban"></i></div>
            </div>
            <div className="box__text  box--half-border-top">Byli pracownicy: </div>
            <div className="form-editor--inline-flex-wrap   ">
                <div className="box__item  form-editor__employe-box">
                    <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/`}>Adam Nowak</Link>
                    <div className="form-editor__employe-box--text  form-editor__employe-box--restore" > <i class="fas fa-undo-alt"></i></div>
                </div>
                <div className="box__item  form-editor__employe-box">
                    <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/`}>Adam Nowak</Link>
                    <div className="form-editor__employe-box--text  form-editor__employe-box--restore" > <i class="fas fa-undo-alt"></i></div>
                </div>
                <div className="box__item  form-editor__employe-box">
                    <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/`}>Adam Nowak</Link>
                    <div className="form-editor__employe-box--text  form-editor__employe-box--restore" > <i class="fas fa-undo-alt"></i></div>
                </div>
                <div className="box__item  form-editor__employe-box">
                    <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/`}>Adam Nowak</Link>
                    <div className="form-editor__employe-box--text  form-editor__employe-box--restore" > <i class="fas fa-undo-alt"></i></div>
                </div>
                <div className="box__item  form-editor__employe-box">
                    <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/`}>Adam Nowak</Link>
                    <div className="form-editor__employe-box--text  form-editor__employe-box--restore" > <i class="fas fa-undo-alt"></i></div>
                </div>
                <div className="box__item  form-editor__employe-box">
                    <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/`}>Adam Nowak</Link>
                    <div className="form-editor__employe-box--text  form-editor__employe-box--restore" > <i class="fas fa-undo-alt"></i></div>
                </div>
                <div className="box__item  form-editor__employe-box">
                    <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/`}>Adam Nowak</Link>
                    <div className="form-editor__employe-box--text  form-editor__employe-box--restore" > <i class="fas fa-undo-alt"></i></div>
                </div>
                <div className="box__item  form-editor__employe-box">
                    <Link className="form-editor__employe-box--text  form-editor__employe-box--name " to={`/user/`}>Adam Nowak</Link>
                    <div className="form-editor__employe-box--text  form-editor__employe-box--restore" > <i class="fas fa-undo-alt"></i></div>
                </div>
            </div>
        </div>
    )

}