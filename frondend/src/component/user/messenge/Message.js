import React, { useState, useEffect} from "react";
import { Link } from 'react-router-dom';


import config from '../../../config.json'

import { MessageReceive } from "./MessageReceive"
import { MessageSent } from "./MessageSent"
import { useTranslation } from 'react-i18next';
import { FetchGet } from "../../../models/Fetch";

export const Message = () => {

    const { t } = useTranslation('common');
    const [messages, setMessages] = useState({})
    const [selectMessageType, setSelectMessageType] = useState("receive")
    const [isLoading, setIsLoading] = useState(true);

    const updateSelectMessageType = (event) => {
        setSelectMessageType(event.target.value)
    }

    const getMessages = async () => {

        const result = await FetchGet(`${config.apiRoot}/message/`)
        const data = await result.json();

        const sortReceiveMessages = data.receiveMessages.sort(sortDate);
        const sortSentMessages = data.sentMessages.sort(sortDate);
        setMessages({ sentMessages: sortSentMessages, receiveMessages: sortReceiveMessages })
        setIsLoading(false)
    }

    const selectMessageTypeRadio = (id) => {
        if (id === "message-receive" && selectMessageType === "receive")
            return "box__radio-button--active"
        else if (id === "message-sent" && selectMessageType === "sent")
            return "box__radio-button--active"
        return ""
    }

    const sortDate = (timeItem1, timeItem2) => {
        const dateTimeItem1 = new Date(timeItem1.createdAt);
        const dateTimeItem2 = new Date(timeItem2.createdAt);
        return dateTimeItem2 - dateTimeItem1;
    }

    useEffect(() => {
        getMessages();
        document.title = t('title.messages') 
    }, [])

    useEffect(() => {
      
    }, [messages])

    const chooseMessageType = () => {
        if (selectMessageType === "receive")
            return <MessageReceive receiveMessages={messages.receiveMessages} />
        if (selectMessageType === "sent")
            return <MessageSent sentMessages={messages.sentMessages} />
    }

    return (


        <div className="box box--large ">

            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "/></div>}
            <div className="message-list__menu-type ">
                <div className="message-list__menu-type--select">
                    <label className={`box__radio-button ${selectMessageTypeRadio("message-receive")}`} htmlFor={`message-receive`}  >{t('message.received')}</label><input onChange={updateSelectMessageType} className="box__project--radio" id="message-receive" name="statusProject" value="receive" type="radio" />
                    <label className={`box__radio-button ${selectMessageTypeRadio("message-sent")}`} htmlFor={`message-sent`} >{t('message.send')}</label><input onChange={updateSelectMessageType} className="box__project--radio" id="message-sent" name="statusProject" value="sent" type="radio" />
                </div>
                <Link to={`/message/new`} className="button message-list__item--button">{t('button.create')}</Link>
            </div>

            <div className="message-list">
                {!isLoading && chooseMessageType()}
            </div>
        </div>

    )
}