import database from "../database/models/database";


export const save = async (req, res) => {

    if (!req.body.idUser || !req.body.idProject) {
        res.status(400).json({ succeeded: false, error: ["requare idUser and idProject"] })
        res.end();
        return
    }

    const userProject = {
        userId: req.body.idUser,
        projectId: req.body.idProject,
    }


    await database.userProject.create(userProject)
    res.status(201).json({ succeeded: true });
    res.end();
}


export const update = async (req, res) => {
    const userProject = await database.userProject.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!userProject) {
        res.status(400).json({ succeeded: false, error: ["not found userProject"] })
        res.end();
        return
    }
    if (req.body.hours)
        userProject.hours = req.body.hours


    await userProject.save();
    res.status(201).json({ succeeded: true });
    res.end();
}

export const remove = async (req, res) => {
    const userProject = await database.userProject.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!userProject) {
        res.status(400).json({ succeeded: false, error: ["not found userProject"] })
        res.end();
        return
    }
    userProject.isRemove = true;
    await userProject.save();
    res.status(200).json({ succeeded: true });
    res.end();
}