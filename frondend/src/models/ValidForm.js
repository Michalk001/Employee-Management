import config from "../config.json";
import React from "react";

export const validPhone = (e, fun) => {
    const reg = /^\d+$/;
    if ((e.target.value.length <= 9 && reg.test(e.target.value)) || e.target.value === "") {
        fun(e);
    }
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const UserLoginValid = (data) => {

    let isOK = true;
    let valid = {};
    if (!data.username || data.username.replace(/ /g, '') === '') {
        valid.username = false;
        isOK = false;
    }
    if (!data.password || data.password.replace(/ /g, '') === '' || data.password.length < config.users.passwordChar) {
        valid.password = false
        isOK = false;
    }
    return {isOK, valid};

}

const UserDataValid = (data) => {

    let isOK = true;
    let valid = {};
    if (!data.firstname || data.firstname.replace(/ /g, '') === '') {
        valid.firstname = false;
        isOK = false;
    }
    if (!data.lastname || data.lastname.replace(/ /g, '') === '') {
        valid.lastname = false;
        isOK = false;
    }

    if (!data.email || data.email.replace(/ /g, '') === '') {
        valid.email = false;
        isOK = false;
    }
    if (data.email) {

        if (!validEmail(data.email)) {
            valid.email = false;
            isOK = false;
        }
    }
    return {isOK, valid};

}

export const UserNewValid = (data) => {

    const userDataValid = UserDataValid(data);
    const userLoginValid = UserLoginValid(data);
    const isOK = (userDataValid.isOK && userLoginValid.isOK)
    return {isOK, valid: {...userDataValid.valid, ...userLoginValid.valid}};

}

export const UserEditValid = (data) =>{
    const userDataValid = UserDataValid(data);
    return {isOK: userDataValid.isOK, valid: userDataValid.valid};
}

export const UserPasswordValid = (data) =>{

    let isOK = true;
    let valid = {oldPassword: true, newPassword: true};
    if (data.oldPassword.replace(/ /g, '') === '') {
        valid.oldPassword = false
        isOK = false;
    }
    if (data.newPassword.replace(/ /g, '') === '' || data.newPassword.length < config.users.passwordChar) {
        valid.newPassword = false
        isOK = false;
    }
    return {isOK, valid};
}