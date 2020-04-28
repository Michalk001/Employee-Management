
import { save,update,remove } from "../models/userProject"

export const userProjectController = (app, passport) => {

    app.post("/userproject", save);
    app.put("/userproject/:id", update);
    app.delete("/userproject/:id", remove);

}