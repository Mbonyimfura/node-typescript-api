import crypto from 'crypto';
const SECRETE_KEY = 'TRESOR-REST-API-KEY';
export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt, password) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRETE_KEY).digest('hex');
};
