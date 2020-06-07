import React from "react";
import {useTranslation} from "react-i18next";


export const ErrorPage = ({ code, text }) => {
    const {t} = useTranslation('common');
    return (

        <div className="box box--center">

            <div className="box__text box__text--center box__text--error-code">
                {code ? code : "404"}
            </div>
            <div className="box__text box__text--center box__text--error-text ">
                {text ? text : t('common.NotFoundPage')}
            </div>

        </div>

    )
}
