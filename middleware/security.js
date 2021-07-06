
import csrf from 'csurf'
import { hasAdmin } from '../src/util'
const { PORT } = process.env
export const csrfProtection = csrf({ cookie: true })// enables csrf protection


// verify if user has loggedIn
export function authenticated(req,res,next) {
	if(req.isAuthenticated()) {// verify if user is authenticated
		next()// user was authenticated
	}
	res.status(401).json({message: "Unauthorized"})// user was not authenticated
}

// verify if user is authorized
export function authorize(req,res,next) {
	if(req.isAuthenticated()) {// verify if user is loggedIn
		const id = req.params['id']// get url paramater id
		if(id == req.user._id || hasAdmin(req.user)) {// verify if user is authorized
			next()// user is authorized
		}else {// user was not authorized
			res.status(401).json({message: "Unauthorized"})
		}
	}
}

// verify if user has admin role
export function isAdmin(req,res,next) {
	if(req.isAuthenticated()) {// verify if user is authorized
		const { user } = req.session// get user from session
		if( hasAdmin(user) ) next()// user is admin
		res.status(401).json({message: "Unauthorized"})// user was not authorized
	}
	res.status(401).json({message: "Unauthorized"})
}