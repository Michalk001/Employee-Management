import jwt from 'jsonwebtoken'
import { createToken, SECRET } from "../utils/token"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import database from "../database/models/database";
import jwt_decode from 'jwt-decode';


export const refreshToken = async (req, res) => {

    if (!req.body.token) {
        res.status(401).json({ succeeded: false });
        return;
    }
    const jwtDecode = require('jwt-decode');
    const decoded = jwtDecode(req.body.token);
    const jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = 'tasmanianDevil';
    const user = await database.user.findOne({
        where: {
            username:
                { [database.Sequelize.Op.iLike]: `%${decoded.sub}` }
        }
    });
    const payload = { id: user.id, sub: user.username, firstname: user.firstname, lastname: user.lastname, isAdmin: user.isAdmin };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '3000m' });

    res.json({ succeeded: true, token: token });


}

export const login = async (req, res) => {

    const bcrypt = require('bcryptjs');
    const jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = 'tasmanianDevil';
    let name;
    let password;
    if (req.body.username && req.body.password) {
        name = req.body.username;
        password = req.body.password;
    }
    else {
        res.json({ succeeded: false, error: "not found user or password did not match", code: 2 });
        res.end();
        return;
    }

    const user = await database.user.findOne({
        where: {
            username:
                { [database.Sequelize.Op.iLike]: `%${name}` }
        }
    });

    if (!user) {
        res.json({ succeeded: false, error: "not found user or password did not match", code: 2 });
        res.end();
        return;
    }

    if (user.isRemove) {
        res.json({ succeeded: false, error: "account is removed", code: 1 });
        res.end();
        return;
    }

    if (user.isRetired) {
        res.json({ succeeded: false, error: "account is retired", code: 3 });
        res.end();
        return;
    }
    if (bcrypt.compareSync(password, user.password)) {
        console.log(user.isAdmin)
        const payload = { id: user.id, sub: user.username, firstname: user.firstname, lastname: user.lastname, isAdmin: user.isAdmin };
        const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '3000m' });

        res.json({ succeeded: true, token: token });


    }
    res.json({ succeeded: false, error: "not found user or password did not match", code: 2 });
    res.end();
}


export const register = async (req, res) => {
    const bcrypt = require('bcryptjs');

    if (!req.body.user.username || !req.body.user.password) {
        res.status(400).json({ succeeded: false, error: "requare password and username", code: 1 })
        res.end();
        return
    }
    const hashPassword = bcrypt.hashSync(req.body.user.password, 10);
    const user = {
        username: req.body.user.username,
        password: hashPassword,
        firstname: req.body.user.firstname,
        lastname: req.body.user.lastname,
        email: req.body.user.email,
        phone: req.body.user.phone,
    }

    const users = await database.user.findAll({
        where: {
            username:
                { [database.Sequelize.Op.iLike]: `%${user.username}` }
        }
    });

    if (users.length == 0) {
        await database.user.create(user)
    }
    else {
        res.json({ succeeded: false, error: "username bussy", code: 2 })
        res.end();
    }
    res.json({ succeeded: true });
    res.end();
}

export const changePassword = async (req, res) => {

    const bcrypt = require('bcryptjs');
    const jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = 'tasmanianDevil';
    const oldPassword = req.body.password.oldPassword;
    const newPassword = req.body.password.newPassword;
    if (!(oldPassword && newPassword)) {
        res.json({ succeeded: false, error: "require old password and new password", code: 1 });
        res.end();
        return;
    }
 
    const user = await database.user.findOne({
        where: {
            username:
                { [database.Sequelize.Op.iLike]: `%${req.params.id}` }
        }
    });
    if (!user) {
        res.json({ succeeded: false, error: "not found user", code: 3 });
        res.end();
        return
    }
    if (!bcrypt.compareSync(oldPassword, user.password)) {
        res.json({ succeeded: false, error: "old password is wrong", code: 2 });
        res.end();
        return
    }
    const hashPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashPassword
    await user.save();
    res.json({ succeeded: true });
    res.end();
}