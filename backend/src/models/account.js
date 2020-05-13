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

    const user = await database.user.findOne({
        where: {
            username:
                { [database.Sequelize.Op.iLike]: `%${name}` }
        }
    });

    if (!user) {
        res.status(401).json({ succeeded: false, error: [{ code: 2, msg: "no such user found" }] });
        return;
    }

    if (user.isRemove) {
        res.status(401).json({ succeeded: false, error: [{ code: 1, msg: "account is removed" }] });
        return;
    }

    if (bcrypt.compareSync(password, user.password)) {
        console.log(user.isAdmin)
        const payload = { id: user.id, sub: user.username, firstname: user.firstname, lastname: user.lastname, isAdmin: user.isAdmin };
        const token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '3000m' });

        res.json({ succeeded: true, token: token });


    } else {
        res.status(401).json({ succeeded: false, error: ["passwords did not match"] });
    }
    res.end();
}


export const register = async (req, res) => {
    const bcrypt = require('bcryptjs');

    if (!req.body.username || !req.body.password) {
        res.status(400).json({ succeeded: false, error: ["requare password and username"] })
        res.end();
        return
    }
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    const user = {
        username: req.body.username,
        password: hashPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
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
        res.status(400).json({ succeeded: false, error: ["username bussy"] })
        res.end();
    }
    res.status(201).json({ succeeded: true });
    res.end();
}