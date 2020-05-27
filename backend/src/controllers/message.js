import { save,get,getByID,update } from "../models/message"


export const messageController = (app, passport) => {

    app.post("/message", save);
    app.get("/message", get);
    app.get("/message/:id", getByID);
    app.put("/message/:id", update);


}