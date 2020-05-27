

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from "../../../context/AuthContext";
import { InfoBoxContext } from "../../../context/InfoBox/InfoBoxContext";
import Cookies from 'js-cookie';
import config from '../../../config.json'


export const MessageSent = ({ sentMessages }) => {

    const convertDate = (date) => {
        return (date.substring(0, 10)).split("-").join('.');
    }


    return (
        sentMessages != undefined && sentMessages.map((item) => (
            <Link to={`/message/${item.id}`} key={`ms-r-${item.id}`} className={`message-list__item `}>
                <div className="message-list__item--username"> {item.recipient.firstname} {item.recipient.lastname}</div>
                <div className="message-list__item--topic-date">
                    <div> {item.topic} </div>
                    <div className="message-list__item--date"> {convertDate(item.createdAt)} </div>
                </div>
            </Link>
        ))


    )
}