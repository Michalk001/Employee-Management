import React from "react";


export const ErrorPage = ({ code, text }) => {
    return (

        <div className="box box--center">

            <div className="box__text box__text--center box__text--error-code">
                {code ? code : "404"}
            </div>
            <div className="box__text box__text--center box__text--error-text ">
                {text ? text : "Nie znaleziono"}
            </div>

        </div>

    )
}
