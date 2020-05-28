import database from "../database/models/database";


export const save = async (req, res) => {

    if (!req.headers.authorization) {
        res.status(401).json({ succeeded: false, error: ["require token "] });
        res.end();
        return
    }

    if (!req.body.message.recipient) {
        res.status(400).json({ succeeded: false, error: ["requare  recipient"] })
        res.end();
        return
    }
    const token = req.headers.authorization.substring(7, req.headers.authorization.length)
    const jwtDecode = require('jwt-decode');
    const tokenDecode = jwtDecode(token);


    const user = await database.user.findOne({
        where: {
            username: req.body.message.recipient
        }
    })
    if (!user) {
        res.status(400).json({ succeeded: false, error: ["not found recipient"] })
        res.end();
        return
    }
    const message = {
        senderId: tokenDecode.id,
        recipientId: user.id,
        description: req.body.message.description,
        topic: req.body.message.topic
    }
    console.log(message)
    await database.message.create(message)
    res.status(201).json({ succeeded: true });
    res.end();
}


export const update = async (req, res) => {

    if (!req.headers.authorization) {
        res.status(401).json({ succeeded: false, error: ["require token "] });
        res.end();
        return
    }
    if (!req.params.id) {
        res.status(400).json({ succeeded: false, error: ["requare ID message"] })
        res.end();
        return
    }

    const token = req.headers.authorization.substring(7, req.headers.authorization.length)
    const jwtDecode = require('jwt-decode');
    const tokenDecode = jwtDecode(token);

    const message = await database.message.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!message) {
        res.status(400).json({ succeeded: false, error: ["not found message"] })
        res.end();
        return
    }
    if (req.body.message.isRead != undefined) {
        message.isRead = req.body.message.isRead;
    }

    await message.save();
    res.status(201).json({ succeeded: true });
    res.end();

}

export const get = async (req, res) => {


    if (!req.headers.authorization) {
        res.status(401).json({ succeeded: false, error: ["require token "] });
        res.end();
        return
    }
    const token = req.headers.authorization.substring(7, req.headers.authorization.length)
    const jwtDecode = require('jwt-decode');
    const tokenDecode = jwtDecode(token);

    const sentMessages = await database.message.findAll({
        where: {
            senderId: tokenDecode.id,
            isRemove: false
        },
        attributes: ['topic', 'createdAt', 'id'],
        include: [{
            model: database.user,
            as: "recipient",
            attributes: ['firstname', 'lastname', 'username'],

        }]
    });

    const receiveMessages = await database.message.findAll({
        where: {
            recipientId: tokenDecode.id,
            isRemove: false
        },
        attributes: ['topic', 'isRead', 'createdAt', 'id'],
        include: [{
            model: database.user,
            as: "sender",
            attributes: ['firstname', 'lastname', 'username'],

        }]
    });


    res.status(200).json({ succeeded: true, sentMessages, receiveMessages });
}

export const getByID = async (req, res) => {

    try {
        const message = await database.message.findOne({
            where: {
                id: req.params.id,
                isRemove: false
            },
            attributes: ['topic', 'description', 'isRead', 'createdAt', 'id'],
            include: [{
                model: database.user,
                as: "sender",
                attributes: ['firstname', 'lastname', 'username'],

            }, {
                model: database.user,
                as: "recipient",
                attributes: ['firstname', 'lastname', 'username'],
            }]
        });


        res.status(200).json({ succeeded: true, message });
    } catch (err) {
        res.status(404).json({ succeeded: false, error: "not found", code: 1 });
    }
}
