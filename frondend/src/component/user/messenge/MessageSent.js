

import React, { useEffect } from "react";
import { Link } from 'react-router-dom';


import { useTranslation } from "react-i18next";


export const MessageSent = ({ sentMessages }) => {
    const { t } = useTranslation('common');
    const convertDate = (date) => {
        return (date.substring(0, 10)).split("-").join('.');
    }

    useEffect(() => {
        document.title = t('title.messageSend')
    }, [])
    return (
        <>
            {(!sentMessages  || sentMessages.length === 0) &&
                <div className="message-list__text">
                    {t('message.noMessage')}

                </div>}
            {sentMessages  && sentMessages.map((item) => (
                <Link to={`/message/${item.id}`} key={`ms-r-${item.id}`} className={`message-list__item `}>
                    <div className="message-list__item--username"> {item.recipient.firstname} {item.recipient.lastname}</div>
                    <div className="message-list__item--topic-date">
                        <div> {item.topic} </div>
                        <div className="message-list__item--date"> {convertDate(item.createdAt)} </div>
                    </div>
                </Link>
            ))}

        </>
    )
}