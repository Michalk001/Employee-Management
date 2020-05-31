import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import config from '../../config.json'
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

import {ActiveProject} from './ActiveProject'
import { Message } from "./Message";

export const Dashboard = () => {

    return(
        <div className="dashboard">
            <ActiveProject />
            <Message />
        </div>
    )

}