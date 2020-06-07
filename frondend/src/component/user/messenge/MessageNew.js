import React, {useState, useEffect, useContext,} from "react";

import {AuthContext} from "../../../context/AuthContext";
import {InfoBoxContext} from "../../../context/InfoBox/InfoBoxContext";
import config from '../../../config.json'
import Select from 'react-select'
import {useTranslation} from 'react-i18next';
import {Fetch, FetchGet} from "../../../models/Fetch";

export const MessageNew = (props) => {


    const {t, i18n} = useTranslation('common');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState({topic: "", description: ""});

    const [recipient, setRecipient] = useState(null);

    const authContext = useContext(AuthContext)
    const infoBoxContext = useContext(InfoBoxContext);

    const updateMessage = (event) => {
        setMessage({...message, [event.target.name]: event.target.value})
    }
    const updateRecipient = (value) => {
        setRecipient(value)
    }

    const getUser = async () => {
        const result = await FetchGet(`${config.apiRoot}/user/`)

        const data = await result.json();
        if (data.succeeded) {
            const usersTmp = data.user
                .filter(x => {
                    return (!x.isRetired && !x.isRemove && x.username !== authContext.userDate.username)
                })
                .map(x => {
                    return {label: x.firstname + " " + x.lastname, value: x.username}

                });
            setUsers(usersTmp)
        }
    }
    const sendMessage = async () => {


        const messageObj = {...message, recipient: recipient.value}

        const result = await Fetch(`${config.apiRoot}/message/`, "post", JSON.stringify({message: messageObj}))


        const data = await result.json();

        if (data.succeeded) {
            infoBoxContext.addInfo(t('infoBox.sent'), 3);
            setMessage({topic: "", description: ""})
            updateRecipient(null);
        } else {
            infoBoxContext.addInfo(t('infoBox.error'), 3);
        }

    }

    const reply = () => {
        if (props.location.reply) {
            if (props.location.reply.topic) {
                setMessage({...message, topic: `RE: ${props.location.reply.topic}`})
            }
            if (props.location.reply.user) {
                const userRecipient = props.location.reply.user;
                setRecipient({
                    label: userRecipient.firstname + " " + userRecipient.lastname,
                    value: userRecipient.username
                })
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
        document.title = t('title.messageNew')
    }, [])

    return (
        <div className="box box--large">

            <div className="form-editor--inline ">
                <Select placeholder={t('message.to')} value={recipient} onChange={updateRecipient}
                        noOptionsMessage={() => {
                            return t('message.noRecipient')
                        }} options={users}
                        className="form-editor__input form-editor__input--large  form-editor__input--select-receiver "/>
            </div>

            <div className="form-editor--inline">
                <input placeholder={t('message.topic')} type="text" name="topic" value={message.topic}
                       onChange={updateMessage} className="form-editor__input form-editor__input--large "/>
            </div>
            <div className="message-view__text message-view__text--message"> {t('message.message')}:</div>
            <div className="form-editor--inline">
                <textarea className="form-editor__input form-editor__input--textarea" value={message.description}
                          onChange={updateMessage} name="description"/>
            </div>
            <div className="form-editor--inline box__item">
                <button onClick={sendMessage} className="button ">{t('button.sent')}</button>
            </div>
        </div>


    )
}