import React, { useState, useEffect, state, useContext, useReducer } from "react";

import { useTranslation } from 'react-i18next';

import {ActiveProject} from './ActiveProject'
import { Message } from "./Message";

export const Dashboard = () => {
    const { t, i18n } = useTranslation('common');
    useEffect(()=>{
        document.title = t('title.dashboard') 
    },[])

    return(
        <div className="dashboard">
            <ActiveProject />
            <Message />
        </div>
    )

}