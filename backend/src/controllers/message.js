import { save,get,getByID,update } from "../models/message"


export const messageController = (app, passport) => {

    app.post("/message",passport, save);
    app.get("/message",passport, get);
    app.get("/message/:id",passport, getByID);
    app.put("/message/:id",passport, update);


}