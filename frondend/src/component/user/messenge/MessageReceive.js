import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import {FetchGet} from "../../../models/Fetch";
import config from "../../../config.json";


export const MessageReceive = () => {

    const { t } = useTranslation('common');

    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const convertDate = (date) => {
        return (date.substring(0, 10)).split("-").join('.');
    }

    const sortDate = (timeItem1, timeItem2) => {
        const dateTimeItem1 = new Date(timeItem1.createdAt);
        const dateTimeItem2 = new Date(timeItem2.createdAt);
        return dateTimeItem2 - dateTimeItem1;
    }

    const getMessages = async (signal) => {

        const result = await FetchGet(`${config.apiRoot}/message/received`,signal)
        const data = await result.json();

        const sortReceiveMessages = data.receiveMessages//.sort(sortDate);
        setMessages(sortReceiveMessages)
        setIsLoading(false)
    }


    const isRead = (isRead) => {
        return isRead ? "" : "message-list__item--no-read"
    }
    useEffect(() => {
        const abortController = new AbortController();
        getMessages(abortController.signal);
        document.title = t('title.messageReceived')
        return () => abortController.abort();

    }, [])
    return (
        <>
        {(!messages || messages.length === 0) &&
        <div className="message-list__text">
            {t('message.noMessage')}
            
        </div> }
            {messages  && messages.map((item) => (
                <Link to={`/message/${item.id}`} key={`ms-r-${item.id}`} className={`message-list__item ${isRead(item.isRead)}`}>
                    <div className="message-list__item--username"> {item.sender.firstname} {item.sender.lastname}</div>
                    <div className="message-list__item--topic-date">
                        <div> {item.topic} </div>
                        <div className="message-list__item--date"> {convertDate(item.createdAt)} </div>
                    </div>
                </Link>
            ))}

        </>
    )
}