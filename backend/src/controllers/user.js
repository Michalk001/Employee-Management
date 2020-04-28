import {get,getByLogin,update,remove} from "../models/user"

export const userController = (app, passport) => {

    app.get("/user", get);
    app.get("/user/:id", getByLogin);
    app.put("/user/:id", update);
    app.delete("/user/:id", remove);
}