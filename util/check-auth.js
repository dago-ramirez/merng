const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config.js')

module.exports = (context) => {
    // context = { ...headers }
    const authHeader = context.req.headers.authorization;
    // console.log(authHeader)
    if(authHeader) {
        // Bearer ...
        const token = authHeader.split('Bearer ')[1];
        // Validate if the token still exist
        if(token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (error) {
                throw new AuthenticationError('Invalid/Expired token')
            }
        }
        throw new Error('authentication token must be \'Bearer [token]')
    }
    throw new Error('authorization header must be provided')
}