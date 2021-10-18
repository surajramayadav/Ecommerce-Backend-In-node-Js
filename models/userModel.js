const mongoose = require('mongoose')

const validator = require("validator");

const bcrypt = require('bcryptjs');


const userScehma = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxlength: [30, "Name cannot exceed 30 character"],
        minlength: [4, "Name should have more 4 character"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"],
        minlength: [8, "Password should be grater than 8 character"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//  Bcrypt Password

userScehma.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)

})



module.exports = mongoose.model("User", userScehma)