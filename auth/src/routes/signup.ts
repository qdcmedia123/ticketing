import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {User} from '../models/user';
//import {BadRequestError} from '../errors/bad-request-error';
//import {validateRequest} from '../middlewares/validate-request';
import {BadRequestError} from '@wealthface/common';
import {validateRequest} from '@wealthface/common';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post('/api/users/signup', [
body('email')
  .isEmail()
  .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({min:4, max:20})
    .withMessage('Password mustbe between 2 to 20 chr')
],
validateRequest, 
async(req:Request, res:Response) => {
    const {email, password} = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser) {
        throw new BadRequestError('Email address already exists.')
    }

    const user = User.build({email, password});
    await user.save();

    // Generate JWT 
    const userJWT = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!);
    
    // Set to the cookie session
    req.session = {
        jwt: userJWT
    };

    res.status(201).send(user);
})

export {router as signupRouter};