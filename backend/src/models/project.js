import database from "../database/models/database";

export const save = async (req, res) => {

    if (!req.body.project.name) {
        res.status(400).json({ succeeded: false, error: "requare name" })
        res.end();
        return
    }
    const transaction = await database.sequelize.transaction();
    try {
        const project = {
            name: req.body.project.name.trim(),
            description: req.body.project.description,
        }

        const created = await database.project.create(project, { transaction: transaction });
        console.log(created.id)
        if (req.body.project.users) {
            let users;
            users = await req.body.project.users.map(async (x) => {
                await database.userProject.create({
                    userId: x.id,
                    projectId: created.id,
                }, { transaction: transaction })
            })
            await Promise.all(users)

        }


        await transaction.commit();
        res.status(201).json({ succeeded: true });
        res.end();
    }
    catch
    {
        await transaction.rollback();
        res.status(201).json({ succeeded: false });
        res.end();
    }
}

export const get = async (req, res) => {
    const projects = await database.project.findAll({
        include: [
            {
                model: database.user,
                required: false,
                attributes: ["id", "firstname", "lastname", "username", "isRetired"],
                through: {
                    attributes: ["id", "hours", "isRemove", "isRetired"],
                    where: {
                        isRemove: false
                    }
                }
            }]
    });
    res.status(200).json({ succeeded: true, projects });
    res.end();
}

export const getById = async (req, res) => {

    try {
        const project = await database.project.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: database.user,
                    required: false,
                    attributes: ["id", "firstname", "lastname", "username", "isRetired"],
                    through: {
                        attributes: ["id", "hours", "isRemove", "isRetired"],
                        where: {
                            isRemove: false
                        }
                    }
                }]
        });
        res.status(200).json({ succeeded: true, project });
        res.end();
    } catch (err) {
        res.status(404).json({ succeeded: false,  error: "not found"});
    }
}


export const update = async (req, res) => {

    const project = await database.project.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: database.user,
                required: false,
                attributes: ["id", "firstname", "lastname", "username", "isRetired"],
                through: {
                    attributes: ["id", "hours", "isRemove", "isRetired"],
                }
            }]
    });


    if (req.body.project.isRetired != null || req.body.project.isRetired != undefined) {

        project.isRetired = req.body.project.isRetired;
        await project.save();
        res.status(200).json({ succeeded: true });
        res.end();
        return
    }

    if (req.body.project.name)
        project.name = req.body.project.name.trim();
    if (req.body.project.description)
        project.description = req.body.project.description;
    await project.save();
    res.status(200).json({ succeeded: true });
    res.end();

}