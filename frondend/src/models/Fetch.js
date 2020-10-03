import Cookies from "js-cookie";


export const  FetchGet = async (url) =>{
    const fetch = require("node-fetch");
    return await fetch(url, {
        method: "get",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': 'Bearer ' + Cookies.get('token'),
        },

    });
}


export const Fetch = async (url, method, body) =>{
    if(method === "get"){
        return FetchGet(url)
    }
    const fetch = require("node-fetch");
    return await fetch(url, {
        method: method,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': 'Bearer ' + Cookies.get('token'),
        },
        body: body
    });
}