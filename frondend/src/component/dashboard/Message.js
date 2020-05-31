import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

export const Message = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [messages, setMessages] = useState({})
    const authContext = useContext(AuthContext)
    const { t, i18n } = useTranslation('common');


    const sortDate = (timeItem1, timeItem2) => {
        var dateTimeItem1 = new Date(timeItem1.createdAt);
        var dateTimeItem2 = new Date(timeItem2.createdAt);
        return dateTimeItem2 - dateTimeItem1;
    }

    const getMessages = async () => {

        const result = await fetch(`${config.apiRoot}/message/`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            },
        });
        const data = await result.json();

        const sortReceiveMessages = data.receiveMessages.sort(sortDate).slice(0,4);
        setMessages(sortReceiveMessages)
        console.log(sortReceiveMessages)
        setIsLoading(false)
    }

    const isRead = (isRead) => {
        return isRead ? "" : "dashboard__item--no-read"
    }

    useEffect(() =>{
        getMessages();
    },[])

    return (
        <div className="box">
            {isLoading && <div className="box__loading">  <i className="fas fa-spinner load-ico load-ico--center load-ico__spin "></i></div>}
            <div className="dashboard__text dashboard__text--title dashboard__text--center">{t('dashboard.messages')}</div>
            {!isLoading && <>
                {messages.length == 0 && <div className="dashboard__item">
                    <div className="dashboard__text dashboard__text--center">{t('dashboard.noneMessages')}</div>
                </div>
                }
                {messages.length != 0 && <div className="dashboard__item">
                    <div className="dashboard__text dashboard__item--title dashboard__item--message-title{">
                        <span className="dashboard__text dashboard__text--sender dashboard__text--column-name">{t('dashboard.sender')}</span>
                        <span className="dashboard__text dashboard__text--topic dashboard__text--center dashboard__text--column-name">{t('dashboard.topic')}</span>

                    </div>
                    <div className="box__scroll">
                        <div className="dashboard__list">
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