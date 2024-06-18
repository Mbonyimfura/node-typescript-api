import express from 'express';
import { getUsers, deleteUserById, updateUser, getUserById,} from '../models/users.js';


export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Internal server error'})
    }
}
export const  deleteUser= async(req: express.Request, res:express.Response) => {
    try {
      const { id } = req.params;
    
      const user = await deleteUserById(id)
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
    
    }

  export const updateUsers = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const { username } = req.body;
  
      const user = await getUserById(id);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
     user.username = username;
     await user.save()
   res.status(200).json(user);
  
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }