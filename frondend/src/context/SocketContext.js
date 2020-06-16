import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "./AuthContext";

import config from "../config.json";
import socketIOClient from "socket.io-client";



export const SocketContext = React.createContext({
    socket:null


})


export const SocketProvider = (props) => {

    const [socket,setSocket] = useState(null)
    const authContext = useContext(AuthContext);
    useEffect(()=>{
        setSocket(socketIOClient(`${config.apiRoot}/`));

    },[])


    useEffect(() => {
        if(authContext.userDate){

            socket.emit("join",{username: authContext.userDate.username})
        }
    },[authContext.userDate])

    return (
        <SocketContext.Provider
            value={
                {
                    socket
                }
            }
        >

            {props.children}
        </SocketContext.Provider>
    );

}