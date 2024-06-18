import { isAuthenticated,isOwner } from './../middleware/index.js';
import express from 'express';

import { getAllUsers,deleteUser, updateUsers } from '../controllers/users.js';

export default (router:express.Router ) => {
    router.get('/users',isAuthenticated, getAllUsers);
    router.delete('/users/:id',isAuthenticated,isOwner, deleteUser);
    router.patch('/users/:id',isAuthenticated,isOwner, updateUsers);
}

