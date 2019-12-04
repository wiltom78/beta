"user strict";
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const login = (req,res) => {
    passport.authenticate('local', {session:false}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                message: "Something went wrong with login",
                user: user
            });
        }
        req.login(user, {session: false}, err => {
            if (err) {
                res.send(err);
            }
            const token = jwt.sign(user, "suolattu_avain");
            return res.json({user, token});
        });
    })(req,res);
};

const user_create = async (req,res,next) => {
    const error = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("error while creating user. from authController.js", errors);
        res.send(errors.array());
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.Salasana, salt);

        const params = [
            req.body.Sahkoposti,
            hash
        ];
        if (await userModel.addUser(params)) {
            next();
        } else {
            res.status(400).json({error: 'Error while registering user in user_create - authController.js'});
        }
    }
};

const logout = (req,res) => {
    req.logout();
    res.json({message: "logout"});
};

module.exports = {
    login,
    user_create,
    logout
}