import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export const MessageReceive = ({ receiveMessages }) => {

    const { t } = useTranslation('common');
    const convertDate = (date) => {
        return (date.substring(0, 10)).split("-").join('.');
    }

    const isRead = (isRead) => {
        return isRead ? "" : "message-list__item--no-read"
    }
    useEffect(() => {
        document.title = t('title.messageReceived')
    }, [])
    return (
        <>
        {(!receiveMessages || receiveMessages.length === 0) &&
        <div className="message-list__text">
            {t('message.noMessage')}
            
        </div> }
            {receiveMessages  && receiveMessages.map((item) => (
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