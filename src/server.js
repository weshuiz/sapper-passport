import sirv from 'sirv'
import dotenv from 'dotenv-safe'
import express from 'express'
import passport from 'passport'
import mongoose from 'mongoose'
import session from 'express-session'
import compression from 'compression'
import * as sapper from '@sapper/server'
import cookieParser from 'cookie-parser'// hmmm cookies
import { userRoutes } from './userRoutes.js'
import { csrfProtection } from '../middleware/security'
import { localStrategy } from '../stratigies/local'
import userModel from '../models/user'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'
const app = express()
dotenv.config()

// database
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
const db = mongoose.connection
db.on('error', (err) => console.error(err))
db.once('open', ()=> console.log('Connected to Database'))

// passport
passport.use(localStrategy)

passport.serializeUser(function(user, done) {
	done(null, user._id)
})
  
passport.deserializeUser(function(id, done) {
	userModel.findById(id, function(err, user) {
		done(err, user)
	})
})

app.use(
	( req, res, next )=> {// wrap sapper to access the req
		return sapper.middleware({
			// svelte (front-end) has its own storage called 'session'
			session: () => {// NOTE: this is not related to express-session
				const token = dev ? "test": req.csrfToken()// set csrf token to test while dev is enabled
				res.setHeader('cache-control', 'no-cache, no-store')// Note: disable caching to prevent data lost upon reload
				return {// svelte session is frond-end ONLY
					user: req.session.user,// used to display user info
					csrfToken: token,// forms use this to load the CSRF token
					loggedIn: req.session.loggedIn// whether user is logged in or not
				}
			}
		}) (req, res, next)// idk why but this is required
	}
)
if(!dev) {
	app.use(
		csrfProtection// protects routes with csrf token
	)
}

app.use('/auth',userRoutes)// must be called saperate to prevent svelte giving a 404
app.use(
	( req, res, next )=> {// wrap sapper to access the req
		return sapper.middleware({
			// svelte (front-end) has its own storage called 'session'
			session: () => {// NOTE: this is not related to express-session
				const token = dev ? "test": req.csrfToken()// set csrf token to null while dev is enabled
				res.setHeader('cache-control', 'no-cache, no-store')// Note: disable caching to prevent data lost upon reload
				return {// svelte session is frond-end ONLY
					user: req.session.user,// used to display user info
					csrfToken: token,// forms use this to load the CSRF token
					loggedIn: req.session.loggedIn// whether user is logged in or not
				}
			}
		}) (req, res, next)// idk why but this is required
	}
)

app.listen(PORT, err => {
	if (err) console.log('error', err)
})
