import { register } from '../controllers/authentication.js';
export default (router) => {
    router.post('/auth/register', register);
};
