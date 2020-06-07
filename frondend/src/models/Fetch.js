import Cookies from "js-cookie";


export const  FetchGet = async (url,signal = null) =>{
    return await fetch(url, {
        signal: signal,
        method: "get",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': 'Bearer ' + Cookies.get('token'),
        },

    });
}


export const Fetch = async (url, method, body,signal=null) =>{
    if(method === "get"){
        return FetchGet(url,signal)
    }
    return await fetch(url, {
        signal: signal,
        method: method,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': 'Bearer ' + Cookies.get('token'),
        },
        body: body
    });
}