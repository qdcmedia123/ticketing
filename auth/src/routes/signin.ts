import express, {Request, Response} from 'express';
import {body} from 'express-validator'
//import {validateRequest} from '../middlewares/validate-request';
import {validateRequest,BadRequestError} from '@wealthface/common';
import {User} from '../models/user';
//import {BadRequestError} from '../errors/bad-request-error';
import {Password} from '../services/password';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/api/users/signin', [
    body('email')
     .isEmail()
     .withMessage('Email must be valid'),
     body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
],validateRequest, async (req: Request, res:Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});
    if(!existingUser) {
        throw new BadRequestError('Invalid credentials email');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);

    if(!passwordsMatch) {
        throw new BadRequestError('Invalid Credentials Pass');
    }
 
    // 
    const userJWT = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!);
    
    // Set to the cookie session
    req.session = {
        jwt: userJWT
    };

    res.status(201).send(existingUser);
})

export {router as signinRouter};