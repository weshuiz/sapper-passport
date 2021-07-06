import { hasAdmin, validateSchema } from '../src/util'
import { loginSchema, registerSchema } from '../schemas/userInput'

// verify if user login details are valid
export async function validateLogin(req,res,next) {
	try {// validate user input
		const userInput = validateSchema(loginSchema, req.body)
		next()// input is valid
	}
	catch (err) {// input was not valid
		const errorMessage = err.details[0].message
		res.json({message: errorMessage})
	}
}

// verify if user register details are valid
export async function validateRegister(req,res,next) {
	try {// verify user input
		const userInput = await registerSchema.validateAsync(req.body)
		next()// validation is valid
	}
	catch (err) {// validation is not valid
		const errorMessage = err.details[0].message
		res.json({message: errorMessage})
	}
}