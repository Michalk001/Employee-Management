import database from "../database/models/database";


export const get = async (req, res) => {

    const user = await database.user.findAll({
        attributes: ['firstname', 'lastname', 'id', 'isRemove']
    });
    res.status(200).json({ succeeded: true, user });
    res.end();
}

export const getByLogin = async (req, res) => {

    const user = await database.user.findOne({
        where: {
            username:
                { [database.Sequelize.Op.iLike]: `%${req.params.id}` }
        },
        attributes: ['firstname', 'lastname', 'id', 'isRemove','isRetired','email','phone'],
        include: [{
            model: database.project,
            required: false,
            attributes: ['id', 'name'],
            through: {
                attributes: ['isRemove', 'hours','id'],
            }
        }]
    });
    res.status(200).json({ succeeded: true, user });
    res.end();
}

export const update = async (req, res) => {
    //console.log(req.headers.authorization) check id add
    const user = await database.user.findOne({
        where: {
            username:
                { [database.Sequelize.Op.iLike]: `%${req.params.id}` }
        },
        include: [{
            model: database.project,
            required: false,
            attributes: ['id', 'name'],
            through: {
                attributes: []
            }
        }]
    });
    if (!user) {
        res.status(401).json({ succeeded: false, error: ["no such user found"] });
        res.end();
        return
    }
    if (!req.body.user) {
        res.status(401).json({ succeeded: false, error: ["user model not found"] });
        res.end();
        return
    }

    user.name = req.body.user.name;
    user.lastname = req.body.user.lastname;
    await user.save();
    res.status(200).json({ succeeded: true });
    res.end();
}

export const remove = async (req, res) => {
    const user = await database.user.findOne({
        where: {
            username:
                { [database.Sequelize.Op.iLike]: `%${req.params.id}` }
        },
        include: [{
            model: database.project,
            required: false,
            attributes: ['id', 'name'],
            through: {
                attributes: []
            }
        }]
    });
    if (!user) {
        res.status(401).json({ succeeded: false, error: ["no such user found"] });
        res.end();
        return
    }
    user.isRemove = true;
    await user.save();
    res.status(200).json({ succeeded: true });
    res.end();
}