import React from "react";
import 'regenerator-runtime/runtime';
import {render,fireEvent} from "@testing-library/react";

import {Login} from "./Login";
import {expect} from "@jest/globals";
import "@testing-library/jest-dom/extend-expect"

import { I18nextProvider } from 'react-i18next';
import { i18nInit } from '../../localization/i18nInit';
import {AuthProvider} from "../../context/AuthContext";


// eslint-disable-next-line no-unused-expressions
describe("Login component Test",  () => {

    const renderComponent = () => {
        return render(
            <I18nextProvider i18n={i18nInit()}>
                <Login />
            </I18nextProvider>
        )
    }

    test("render",  ()=>{
        const { getByTestId } = renderComponent();
        const sub = getByTestId("login")
        expect(sub).not.toBeNull()
    })
    test("login correct", async () =>{
        const { getByTestId,debug } =render(
            <I18nextProvider i18n={i18nInit()}>
                <AuthProvider>
                    <Login />
                </AuthProvider>
            </I18nextProvider>
        )
        const inputUser = getByTestId("username")
        const inputPass = getByTestId("password")
        fireEvent.change(inputUser,{target:{value:"admin"}})
        fireEvent.change(inputPass,{target:{value:"test1234"}})
        fireEvent.click(getByTestId("submit"))

    })

})