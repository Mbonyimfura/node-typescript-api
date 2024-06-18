import express from 'express';
import lodash from 'lodash';
import { getUserBySessionToken } from '../models/users.js'; // Adjust the import based on your actual file path

const { merge,get } = lodash;


export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
  const {id} = req.params
  const currentUserId = get(req,'identity._id') as  unknown as string;
  if(!currentUserId){
    return res.status(401).send({message:'Unauthorized'})
  }
  if (currentUserId.toString() !== id) {
    return res.status(403).send({ message: 'Forbidden' });
  }
  next(); 
 
} catch (error) {
  console.error(error);
  return res.status(500).send({ message: 'Internal server error' });
}
}


export const isAuthenticated = async (req:express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // Extract the session token from the cookie
    const sessionTokenCookie = req.cookies['tresor-auth'];
    if (!sessionTokenCookie) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    // If the cookie is a string, parse it. Otherwise, use it directly if it's already an object.
    let sessionTokenObj;
    if (typeof sessionTokenCookie === 'string') {
      try {
        sessionTokenObj = JSON.parse(sessionTokenCookie);
      } catch (error) {
        return res.status(400).send({ message: 'Invalid session token format' });
      }
    } else {
      sessionTokenObj = sessionTokenCookie;
    }

    // Extract the sessionToken from the parsed object
    const sessionToken = sessionTokenObj.sessionToken;
    if (!sessionToken) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};
