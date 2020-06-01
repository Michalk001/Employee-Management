import { save,get,getById,update } from "../models/project"
import database from "../database/models/database"


export const projectController = (app, passport) => {

    app.post("/project",passport, save);
    app.get("/project",passport, get);
    app.get("/project/:id",passport, getById);
    app.put("/project/:id",passport,update)

}