import { Strategy } from 'passport-local'
import userModel from '../models/user'
import bcrypt from 'bcryptjs'

export const localStrategy = new Strategy({
    usernameField: 'email'// use email instead of username
},function(email, password, done) {// authentication callback
    userModel.findOne({ email: email } ,function (err, user) {
        if (err) { return done(err); } // 500 server error
        if (!user) { return done(null, false); }// 404 user not found
        const hash = user.password// hashed user password from database
        const isValidPassw = bcrypt.compareSync(password, hash)// compare password with hashed password
        if (!isValidPassw) { return done(null, false); }// password was invalid
		delete user.password// delete password from the response body
        return done(null, user)// user data without password credentials
    }).lean()// is required for the 'delete' operator
})