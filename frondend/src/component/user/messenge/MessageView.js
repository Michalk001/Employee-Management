import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from "../../../context/AuthContext";
import { InfoBoxContext } from "../../../context/InfoBox/InfoBoxContext";

import Cookies from 'js-cookie';
import config from '../../../config.json'
import { ErrorPage } from "../../common/ErrorPage";



export const MessageView = (props) => {

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null);
    const authContext = useContext(AuthContext)

    const getMessage = async (id) => {
        const result = await fetch(`${config.apiRoot}/message/${id}`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        });
        if (result.status == 404) {
            setError({ code: 404, text: "Message Not Found" })
        }
        const data = await result.json();
        setMessage(data.message)
        readMessage(data.message);
        setIsLoading(false)
    }

    const convertDate = (date) => {
        return (date.substring(0, 10)).split("-").join('.');
    }

    const readMessage = async (message) => {
        if (!message)
            return
        if (!message.isRead) {
            await fetch(`${config.apiRoot}/message/${message.id}`, {
                method: "put",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization': 'Bearer ' + Cookies.get('token'),
                },
                body: JSON.stringify({ message: { isRead: true } })
            });
        }
    }
    const getHeader = () => {
        if (!message || !authContext.userDate)
            return
        if (message.sender.username == authContext.userDate.username)
            return (
                <div className="message-view__header message-view__header--sender">
                    <div className="message-view__text">
                        <span className="message-view__text--vertical-center">Odbiora:</span>
                        <Link to={`/user/${message.recipient.username}`} className="message-view__text--vertical-center message-view__text--author-name">
                            {message.recipient.firstname} {message.recipient.lastname}
                        </Link>
                    </div>

                </div>
            )
        else
            return (
                <div className="message-view__header ">
                    <div className="message-view__text">
                        <span className="message-view__text--vertical-center">Autor:</span>
                        <Link to={`/user/${message.sender.username}`} className="message-view__text--vertical-center message-view__text--author-name">
                            {message.sender.firstname} {message.sender.lastname}
                        </Link>
                    </div>
                    <Link to={{ pathname: '/message/new', reply: { topic: message.topic, user: message.sender } }} className="button">Odpowiedz</Link>
                </div>
            )
    }
    useEffect(() => {
        getMessage(props.match.params.id)
    }, [props.match.params.id])


    useEffect(() => {


    }, [message, authContext.userDate, isLoading])


    return (
        <>
            {error != null && <ErrorPage text={error.text} code={error.code} />}
            <div className="box box--large">
                {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "></i></div>}
                {!isLoading && message && <>
                    <div className="message-view__text--date">{convertDate(message.createdAt)}</div>
                    {getHeader()}
                    <div className="message-view__topic">
                        <div className="message-view__text">
                            <span className="">Temat:</span>
                            <span className="message-view__text--topic">{message.topic}</span>
                        </div>

                    </div>

                    <div className="message-view__description">
                        <div className="message-view__text">Wiadomość:</div>
                        <div className="message-view__description--content">
                            {message.description}
                        </div>
                    </div>

                </>}
            </div >
        </>
    )
}