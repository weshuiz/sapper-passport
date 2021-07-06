import bcrypt from 'bcryptjs'
import express from 'express'// back-end server
import passport from 'passport'// used for auth
import { hasAdmin, validateSchema } from './util'
import userModel from '../models/user'
import {adminSchema, updateSchema } from '../schemas/userInput'
import { authorize } from '../middleware/security'
import { validateLogin, validateRegister } from '../middleware/validation'

const userRoutes = express.Router();

userRoutes.post('/login', 
validateLogin,
function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
	  if (err) { return next(err); }// unexpected error
	  if (!user) { return res.json({message: 'invalid email or password'}); }// 404 user not found
	  req.logIn(user, function(err) {// attempt login
		if (err) { return next(err); }//login failed
		return res.json({user: req.user, loggedIn: req.isAuthenticated()})// login successful
	  });
	})(req, res, next);
});

userRoutes.post('/register',
validateRegister,
	async function(req, res) {
		const {name, lastName, email, password} = req.body
		userModel.findOne({email: email})// find user in database
		.then(user => {
			if(user) {// email already exist
				res.json({message: "email already in use"})
			}else {
				const hashedPassword = bcrypt.hashSync(password, 10)// the plain password hashed
				const registerdUser = new userModel({// user to save
					name,
					lastName,
					email,
					password: hashedPassword,
					createdBy: name,
					createdAt: Date.now()
				})
				registerdUser.save()// save user in database
				res.status(204).json()// 204 no content
			}
		})
})

// https://example.com/auth/someUserId/delete
userRoutes.delete('/:id/delete', 
authorize,// verify if user is authorized to delete
function(req,res) {
	const userId = req.params['id']
	userModel.findByIdAndDelete(userId, (err,docs)=> {// delete user by id
		if(err) {
			res.status(500).json({error: err})// 500 unexpected error
		}else {
			res.status(204).json()// 204 no content
		}
	})
})

// https://example.com/auth/someUserId/update
userRoutes.patch('/:id/update', 
authorize,// verify if user is authorized to update
async function(req,res) {
	let schema
	const body = req.body
	const userId = req.params['id']
	const user = req.user
	
	if(hasAdmin(user)) {// verify if user has admin role
		schema = adminSchema
	}else {
		schema = updateSchema
	}

	const userInput = await validateSchema(schema,body)// admin has access to update roles
	
	const userData = {
		updatedAt: Date.now(),// set update date
		updatedBy: user.name,// set update name
		...userInput
	}
	
	userModel.findByIdAndUpdate(userId, userData, (err,doc)=> {
		if(err) {// unexpected error
			res.status(500).json({error: err})// 500 unexpected error
		}else {// update user
			res.status(204).json()// 204 no content
		}
	})
})

userRoutes.get('/logout', 
function(req, res) {
    req.logout();// unset user in passport
    res.status(204).json()// 204 no content
})

export { userRoutes }