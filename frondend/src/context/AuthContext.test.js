import React, {useEffect} from "react";
import 'regenerator-runtime/runtime';
import {render, fireEvent, waitFor} from "@testing-library/react";

import {AuthContext, AuthProvider} from "./AuthContext";
import {expect} from "@jest/globals";
import "@testing-library/jest-dom/extend-expect"

import loginMock from "../../__mocks__/Auth/loginMock.json"
import userDataMock from "../../__mocks__/Auth/userDataMock.json"


describe("login test ", () => {

    const renderComponent = (Component) => {
        return render(< AuthProvider>
            <Component/>
        </AuthProvider>)
    }

    test("singUP", async () => {
        const TestComponent = () => {
            const {singUp,isLogin, createUserData, userDate} = React.useContext(AuthContext);

            const LogIn = async () => {

                const result = await singUp({username:"admin",password:"test1234"})
                const data = await result.json();
                createUserData(data.token)
            }


            return (
                <>
                    {isLogin !== null &&
                    <div data-testid={"isLogin"}>{isLogin.toString()}</div>
                    }
                    {isLogin === true &&
                    <div data-testid={"isLoginCorrect"}>{isLogin.toString()}</div>
                    }
                    <button data-testid={"button"} onClick={() => LogIn()}>button</button>
                </>
            )
        }

        const {getByTestId, getByText} = renderComponent(TestComponent)

        expect(await waitFor(() => getByTestId("isLogin").firstChild.textContent)).toBe("false")
        fireEvent.click(getByTestId("button"))
        expect(await waitFor(() => getByTestId("isLoginCorrect").firstChild.textContent)).toBe("true")

    })

    test("user data from token", async () => {


        const TestComponent = () => {
            const {createUserData, userDate} = React.useContext(AuthContext);


            useEffect(() => {
                createUserData(loginMock.token)
            }, [])

            return (
                <>
                    {userDate && <>
                        <div data-testid={"username"}>{userDate.username}</div>
                        <div data-testid={"firstname"}>{userDate.firstname}</div>
                        <div data-testid={"lastname"}>{userDate.lastname}</div>
                        <div data-testid={"id"}>{userDate.id}</div>
                    </>}
                </>
            )
        }

        const {getByTestId, getByText} = renderComponent(TestComponent)


        expect(await waitFor(() => getByTestId("username").firstChild.textContent)).toBe(userDataMock.username)
        expect(await waitFor(() => getByTestId("firstname").firstChild.textContent)).toBe(userDataMock.firstname)
        expect(await waitFor(() => getByTestId("lastname").firstChild.textContent)).toBe(userDataMock.lastname)
        expect(await waitFor(() => getByTestId("id").firstChild.textContent)).toBe(userDataMock.id)

    })

})