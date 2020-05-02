import { save,get,getById,update } from "../models/project"
import database from "../database/models/database"


export const projectController = (app, passport) => {

    app.post("/project", save);
    app.get("/project", get);
    app.get("/project/:id", getById);
    app.put("/project/:id",update)

}