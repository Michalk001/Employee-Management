import database from "../database/models/database";


export const save = async (req, res) => {

    if (!req.body.idUser || !req.body.idProject) {
        res.status(400).json({ succeeded: false, error: ["requare idUser and idProject"] })
        res.end();
        return
    }

    const uP = await database.userProject.findOne({
        where: { userId: req.body.idUser, projectId: req.body.idProject }
    });

    if (uP) {
        uP.isRemove = false;
        uP.isRetired = false;
        uP.hours = 0;
        await uP.save();
        res.status(201).json({ succeeded: true, idUserProject: uP.id });
        res.end();
        return
    }
    const userProject = {
        userId: req.body.idUser,
        projectId: req.body.idProject,
    }


    const created = await database.userProject.create(userProject)
    res.status(201).json({ succeeded: true, idUserProject: created.id });
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
    if (req.body.userProject) {
        if (req.body.userProject.isRetired != null || req.body.userProject.isRetired != undefined) {
            userProject.isRetired = req.body.userProject.isRetired;
            await userProject.save();
            res.status(201).json({ succeeded: true });
            res.end();
        }


        if (req.body.userProject.hours) {
            userProject.hours = req.body.userProject.hours
            if (userProject.hours < 0)
                userProject.hours = 0;
        }


        await userProject.save();
    }
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