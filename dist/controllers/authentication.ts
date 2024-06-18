import { createUser, getUserByEmail } from '../models/users.js';
import { authentication, random } from '../helpers/index.js';
export const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            res.status(400).send({ message: 'Missing required fields' });
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            res.status(400).send({ message: 'User already exists' });
        }
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                password: authentication(salt, password),
                salt
            }
        });
        res.status(201).send(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
