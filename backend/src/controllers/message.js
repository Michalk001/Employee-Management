import { save,get,getByID,update,getReceived } from "../models/message"


export const messageController = (app, passport,io) => {

    app.post("/message",passport, save(io));
    app.get("/message",passport, get);
    app.get("/message/received/:id",passport, getReceived);
    app.get("/message/sent",passport, get);
    app.get("/message/:id",passport, getByID);
    app.put("/message/:id",passport, update);


}