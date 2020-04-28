import database from "../database/models/database";

export const save = async (req, res) => {

    if (!req.body.name) {
        res.status(400).json({ succeeded: false, error: ["requare name"] })
        res.end();
        return
    }

    const project = {
        name: req.body.name,
        description: req.body.description,
    }


    await database.project.create(project)
    res.status(201).json({ succeeded: true });
    res.end();

}

export const get = async (req, res) => {
    const projects = await database.project.findAll({
    });
    res.status(200).json({ succeeded: true, projects });
    res.end();
}

export const getById = async (req, res) => {
    const project = await database.project.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: database.user,
                required: false,
                through: {
                    attributes: []
                }
            }]
    });
    res.status(200).json({ succeeded: true, project });
    res.end();
}