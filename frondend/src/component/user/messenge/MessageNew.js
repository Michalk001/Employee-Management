

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from "../../../context/AuthContext";
import { InfoBoxContext } from "../../../context/InfoBox/InfoBoxContext";
import Cookies from 'js-cookie';
import config from '../../../config.json'
import Select from 'react-select'
import { useTranslation } from 'react-i18next';

export const MessageNew = (props) => {


    const { t, i18n } = useTranslation('common');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState({ topic: "", description: "" });

    const [recipient, setRecipient] = useState(null);

    const authContext = useContext(AuthContext)
    const infoBoxContext = useContext(InfoBoxContext);

    const updateMessage = (event) => {
        setMessage({ ...message, [event.target.name]: event.target.value })
    }
    const updateRecipient = (value) => {
        setRecipient(value)
    }

    const getUser = async () => {
        const result = await fetch(`${config.apiRoot}/user/`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        });
        const data = await result.json();
        if (data.succeeded) {
            const usersTmp = data.user
                .filter(x => { return (x.isRetired == false && x.isRemove == false && x.username != authContext.userDate.username) })
                .map(x => {
                    return { label: x.firstname + " " + x.lastname, value: x.username }

                });
            setUsers(usersTmp)
        }
    }
    const sendMessage = async () => {


        const messageObj = { ...message, recipient: recipient.value }

        const result = await fetch(`${config.apiRoot}/message/`, {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
            body: JSON.stringify({ message: messageObj })
        });

        const data = await result.json();
   
        if (data.succeeded) {
            infoBoxContext.addInfo(t('infoBox.sent'));
            setMessage({ topic: "", description: "" })
            updateRecipient(null);
        }
        else {
            infoBoxContext.addInfo(t('infoBox.error'));
        }

    }

    const reply = () => {
        if (props.location.reply) {
            if (props.location.reply.topic) {
                setMessage({ ...message, topic: `RE: ${props.location.reply.topic}` })
            }
            if (props.location.reply.user){
                const userRecipient = props.location.reply.user;
                setRecipient({label: userRecipient.firstname + " " + userRecipient.lastname, value: userRecipient.username})
            }
        }
    }


    useEffect(() => {
      
        if (authContext.userDate)
            getUser();
    }, [authContext.userDate])

    useEffect(() => {

    }, [message])

    useEffect(() => {
        reply();
    }, [])

    return (
        <div className="box box--large">

            <div className="form-editor--inline ">
                <Select placeholder={t('message.to')} value={recipient} onChange={updateRecipient} noOptionsMessage={() => { return "Brak pracowników" }} options={users} className="form-editor__input form-editor__input--large  form-editor__input--select-receiver " />
            </div>

            <div className="form-editor--inline">
                <input placeholder={t('message.topic')} type="text" name="topic" value={message.topic} onChange={updateMessage} className="form-editor__input form-editor__input--large " />
            </div>
            <div className="message-view__text message-view__text--message"> {t('message.message')}:</div>
            <div className="form-editor--inline">
                <textarea className="form-editor__input form-editor__input--textarea" value={message.description} onChange={updateMessage} name="description" />
            </div>
            <div className="form-editor--inline box__item">
                <button onClick={sendMessage} className="button " >{t('button.sent')}</button>
            </div>
        </div>


    )
}