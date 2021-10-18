const crypto = require('crypto')

// Generating password reset token

exports.getResetPasswordToken = (user) => {

    // Genrating Token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hasing and adding resetPasswordToken to userSchema

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken

}