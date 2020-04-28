import { save,get,getById } from "../models/project"
import database from "../database/models/database"


export const projectController = (app, passport) => {

    app.post("/project", save);
    app.get("/project", get);
    app.get("/project/:id", getById);

}

/* const u = await database.user.findAll({include: [{
            model: database.project,
            as: 'project',
            required: false,
            // Pass in the Product attributes that you want to retrieve
            attributes: ['id', 'name'],
            through: {
                // This block of code allows you to retrieve the properties of the join table
                model: userProject,
                as: 'userProjects'
            }
        }]});
        console.log(u);

        res.status(201).json({ succeeded: true });
        res.end();
        */