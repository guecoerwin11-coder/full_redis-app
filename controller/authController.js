const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/authentication')
const { welcome, forgotPass } = require('../services/service')

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const userExist = await User.findOne({ email })

        if (userExist) {
            return res.status(400).json({ message: 'User already exist' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        await welcome(email, username)

        res.status(201).json({ message: 'User created successfully', user: { username, email } });

    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    } 
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.status(200).json({ message: 'Login successful', token })
    } catch (error) {
        res.status(500).json({ message: 'Server login error', error: error.message })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' })
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`    
        await forgotPass(email, resetLink)

        res.status(200).json({ message: 'Password reset link sent to email' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = {
    register,
    login,
    forgotPassword
}