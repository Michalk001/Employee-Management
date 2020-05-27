

import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from "../../../context/AuthContext";
import { InfoBoxContext } from "../../../context/InfoBox/InfoBoxContext";
import Cookies from 'js-cookie';
import config from '../../../config.json'


export const MessageReceive = ({ receiveMessages }) => {

    const convertDate = (date) => {
        return (date.substring(0, 10)).split("-").join('.');
    }

    const isRead = (isRead) => {
        return isRead ? "" : "message-list__item--no-read"
    }

    return (

        receiveMessages != undefined && receiveMessages.map((item) => (
            <Link to={`/message/${item.id}` } key={`ms-r-${item.id}`} className={`message-list__item ${isRead(item.isRead)}`}>
                <div className="message-list__item--username"> {item.sender.firstname} {item.sender.lastname}</div>
                <div className="message-list__item--topic-date">
                    <div> {item.topic} </div>
                    <div className="message-list__item--date"> {convertDate(item.createdAt)} </div>
                </div>
            </Link>
        ))


    )
}