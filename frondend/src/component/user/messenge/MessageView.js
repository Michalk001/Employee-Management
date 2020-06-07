import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom';
import {AuthContext} from "../../../context/AuthContext";
import config from '../../../config.json'
import {ErrorPage} from "../../common/ErrorPage";
import {useTranslation} from 'react-i18next';
import {Fetch, FetchGet} from "../../../models/Fetch";

export const MessageView = (props) => {

    const {t} = useTranslation('common');
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null);
    const authContext = useContext(AuthContext)

    const getMessage = async (id) => {

        const result = await FetchGet(`${config.apiRoot}/message/${id}`)

        if (result.status === 404) {
            setError({code: 404, text: t('infoBox.messageNotFound')})
        }
        const data = await result.json();
        setMessage(data.message)
        await readMessage(data.message);
        setIsLoading(false)
    }

    const convertDate = (date) => {
        return (date.substring(0, 10)).split("-").join('.');
    }

    const readMessage = async (message) => {
        if (!message)
            return
        if (!message.isRead) {
            await Fetch(`${config.apiRoot}/message/${message.id}`, "put", JSON.stringify({message: {isRead: true}}))
        }
    }
    const getHeader = () => {
        if (!message || !authContext.userDate)
            return
        if (message.sender.username === authContext.userDate.username)
            return (
                <div className="message-view__header message-view__header--sender">
                    <div className="message-view__text">
                        <span className="message-view__text--vertical-center">{t('message.recipient')}:</span>
                        <Link to={`/user/${message.recipient.username}`}
                              className="message-view__text--vertical-center message-view__text--author-name">
                            {message.recipient.firstname} {message.recipient.lastname}
                        </Link>
                    </div>

                </div>
            )
        else
            return (
                <div className="message-view__header ">
                    <div className="message-view__text">
                        <span className="message-view__text--vertical-center">{t('message.author')}:</span>
                        <Link to={`/user/${message.sender.username}`}
                              className="message-view__text--vertical-center message-view__text--author-name">
                            {message.sender.firstname} {message.sender.lastname}
                        </Link>
                    </div>
                    <Link to={{pathname: '/message/new', reply: {topic: message.topic, user: message.sender}}}
                          className="button">{t('button.reply')}</Link>
                </div>
            )
    }
    useEffect(() => {
        getMessage(props.match.params.id)
        document.title = t('title.message')
    }, [props.match.params.id])


    useEffect(() => {


    }, [message, authContext.userDate, isLoading])


    return (
        <>
            {error != null && <ErrorPage text={error.text} code={error.code}/>}
            <div className="box box--large">
                {isLoading &&
                <div className="box__loading"><i className="fas fa-spinner load-ico load-ico--center load-ico__spin "/>
                </div>}
                {!isLoading && message && <>
                    <div className="message-view__text--date">{convertDate(message.createdAt)}</div>
                    {getHeader()}
                    <div className="message-view__topic">
                        <div className="message-view__text">
                            <span className="">{t('message.topic')}:</span>
                            <span className="message-view__text--topic">{message.topic}</span>
                        </div>

                    </div>

                    <div className="message-view__description">
                        <div className="message-view__text">{t('message.message')}:</div>
                        <div className="message-view__description--content">
                            {message.description}
                        </div>
                    </div>

                </>}
            </div>
        </>
    )
}