const { COOKIE_EXPIRE } = require("../config/config")
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/config');
const bcrypt = require('bcryptjs');

// JWT TOKEN
const getJWTToken = async function (user) {
    return await jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE
    })
}

const sendToken = async (user, statusCode, res) => {

    const token = await getJWTToken(user)
    
    // options for cookie
    const options = {
        expire: new Date(
            Date.now() + COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        data: user,
        token: token
    })
}


//Comepare Password

const comparePassword = async function (enteredpassword, user) {
    return await bcrypt.compare(enteredpassword, user.password)
}

module.exports = { sendToken, comparePassword }