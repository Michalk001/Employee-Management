
import { save,update,remove } from "../models/userProject"

export const userProjectController = (app, passport) => {

    app.post("/userproject",passport, save);
    app.put("/userproject/:id",passport, update);
    app.delete("/userproject/:id",passport, remove);

}