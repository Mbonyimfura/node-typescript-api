import express from 'express';
import { createUser, getUserByEmail } from '../models/users.js';
import {random,authentication } from '../helpers/index.js';


export const login = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Missing required fields' });
  }

  const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

  if (!user) {
    return res.status(400).send({ message: 'User not found' });
  }

  const expectedHash = authentication(user.authentication?.salt!, password);

  if (expectedHash !== user.authentication?.password) {
    return res.status(403).send({ message: 'Invalid credentials' });
  }

  const salt = random();
  user.authentication.sessionToken = authentication(salt, user._id.toString());
 
  await user.save();
  res.cookie('tresor-auth', { sessionToken: user.authentication.sessionToken }, { domain: 'localhost', path: '/'})
  res.status(200).send({ message: 'Login successful', sessionToken: user.authentication.sessionToken });
};

export const register = async(req: express.Request, res:express.Response) => {
    try {
       const {email, password, username} = req.body;
       if (!email || !password || !username) {
        res.status(400).send({message: 'Missing required fields'}  )
       }
       const existingUser = await getUserByEmail(email);
       if (existingUser) {
        res.status(400).send({message: 'User already exists'})
       }
       const salt = random();
       const user =  await createUser({
              email,
              username,
              authentication: {
                password: authentication(salt, password),
                salt
              }
         });    
         res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Internal server error'})
    }
}

