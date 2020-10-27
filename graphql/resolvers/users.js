const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config.js');
const User = require('../../models/User.js');
const { validateRegisterInput } = require('../../util/validators.js')

module.exports = {
    Mutation: {
        async register(
            _, 
            {
                registerInput: {username, email, password, confirmPassword}
            }
        ) {
            // TODO: Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid) {
                throw new UserInputError('Errors', { errors });
            }
            // TODO: Make sure user doesn't already exist
            const user = await User.findOne({ username });
            if(user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "This username is taken"
                    }
                });
            }
            // Hash password and create an authentication token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: '1h'});

            return {
                ...res._doc,
                id: res.id,
                token
            };
        }
    }
}