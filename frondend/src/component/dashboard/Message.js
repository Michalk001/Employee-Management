import React, {useState, useEffect, useContext} from "react";
import { Link } from 'react-router-dom';

import config from '../../config.json'

import { useTranslation } from 'react-i18next';
import {FetchGet} from "../../models/Fetch";
import {SocketContext} from "../../context/SocketContext";

export const Message = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [messages, setMessages] = useState([])
    const { t } = useTranslation('common');
    const socketContext = useContext(SocketContext)

    const sortDate = (timeItem1, timeItem2) => {
        const dateTimeItem1 = new Date(timeItem1.createdAt);
        const dateTimeItem2 = new Date(timeItem2.createdAt);
        return dateTimeItem2 - dateTimeItem1;
    }

    const getMessages = async (signal) => {
        const result = await FetchGet(`${config.apiRoot}/message/`,signal)

        const data = await result.json();

        const sortReceiveMessages = data.receiveMessages.sort(sortDate).slice(0,4);
      //  console.log(sortReceiveMessages)
        setMessages(sortReceiveMessages)
        setIsLoading(false)
    }

    useEffect(()=>{
        if(socketContext.socket)
            socketContext.socket.on("receiveNewMessage",(data)=>{
                const newMessages =messages;
                newMessages.unshift({...data});
                newMessages.pop();
                setMessages(newMessages);

            })
    },[socketContext.socket,messages])

    const isRead = (isRead) => {
        return isRead ? "" : "dashboard__item--no-read"
    }

    useEffect(() =>{
        const abortController = new AbortController();
        getMessages(abortController.signal);
        return () => abortController.abort();
    },[])

    useEffect(()=>{
        console.log(messages)
    },[messages])

    return (
        <div className="box">
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "/></div>}
            <div className="dashboard__text dashboard__text--title dashboard__text--center">{t('dashboard.messages')}</div>
            {!isLoading && <>
                {messages.length === 0 && <div className="dashboard__item">
                    <div className="dashboard__text dashboard__text--center">{t('dashboard.noneMessages')}</div>
                </div>
                }
                {messages.length !== 0 && <div className="dashboard__item">
                    <div className="dashboard__text dashboard__item--title dashboard__item--message-title{">
                        <span className="dashboard__text dashboard__text--sender dashboard__text--column-name">{t('dashboard.sender')}</span>
                        <span className="dashboard__text dashboard__text--topic dashboard__text--center dashboard__text--column-name">{t('dashboard.topic')}</span>

                    </div>
                    <div className="box__scroll">
                        <div className="dashboard__list">
                            {console.log(messages)}
                            {messages.map((item, index) => (

                                <Link to={`/message/${item.id}`} key={`messages-${index}`} className={`dashboard__item--list dashboard__item--message-title ${isRead(item.isRead)}`} >
                                    <span className="dashboard__text dashboard__text--sender">{item.sender.firstname} {item.sender.lastname}</span>
                                    <span className="dashboard__text dashboard__text--topic">{item.topic}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>}
            </>}

        </div>


    )

}