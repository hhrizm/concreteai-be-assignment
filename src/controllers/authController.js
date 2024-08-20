const prisma = require('../config/prisma');
const { body, validationResult } = require('express-validator');
const EmailPassword = require('supertokens-node/recipe/emailpassword');


// Register
exports.registerValidation = () => [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').notEmpty().withMessage('Password is required'),
];

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.message });
    }
    const { email, password, name } = req.body;
    try {
        await prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findUnique({
                where: { email: email },
            });

            if (existingUser) {
                throw new Error('Email is already in use');
            }

            const signUpResponse = await EmailPassword.signUp("public", email, password);
            if (signUpResponse.status !== 'OK') {
                throw new Error(signUpResponse.status);
            }

            const user = await tx.user.create({
                data: {
                    email: email,
                    name: name,
                    supertokensId: signUpResponse.user.id,
                },
            });

            res.status(201).json(user);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
exports.loginValidation = () => [
    body('email')
        .isEmail().withMessage('Invalid email format')
        .notEmpty().withMessage('Email is required'),
    body('password')
        .notEmpty().withMessage('Password is required'),
];
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.message });
    }
    
    const { email, password } = req.body;

    try {
        // Check if user exists in your database
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Attempt to sign in with Supertokens
        const signInResponse = await EmailPassword.signIn("public", email, password);

        if (signInResponse.status !== 'OK') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Send session info or other relevant data to the client
        res.status(200).json({
            message: 'Login successful',
            user,
            signIn: signInResponse,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Profile
exports.getProfile = async (req, res) => {
    try {
        const session = req.session;
        const userId = session.getUserId();

        // Fetch user details from your database
        const user = await prisma.user.findUnique({
            where: { supertokensId: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
