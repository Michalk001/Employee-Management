import {get,getByLogin,update,remove} from "../models/user"

export const userController = (app, passport) => {

    app.get("/user",passport, get);
    app.get("/user/:id",passport, getByLogin);
    app.put("/user/:id",passport, update);
    app.delete("/user/:id",passport, remove);
}