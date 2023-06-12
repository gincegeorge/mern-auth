import asyncHandler from "express-async-handler"
import User from "../models/userModels.js"
import generateToken from '../utils/generateToken.js'


/** 
 * @desc Register new user
 * route POST api/users/
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    console.log(name, email, password);

    console.log("userExists", userExists);

    if (userExists) {
        res.status(400)
        throw new Error("user already exist")
    } else {
        const user = await User({ name, email, password }).save()

        if (user) {
            res.status(201)
            let token = generateToken(user._id)

            res.status(201)
                .cookie('jwt-user', token, {
                    httpOnly: true,
                    // secure: process.env.ENVIRONMENT !== 'development',
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                })
                .json({
                    id: user._id,
                    name: user.name,
                    email: user.email
                })
        } else {
            res.status(400)
            throw new Error("Invalid input")
        }
    }
})

/** 
 * @desc Auth user/set token
 * route POST api/users/auth
 * @access Public
 */
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = User.findOne({ email })
    console.log(user);

    if (user && (await User.matchPassword(password))) {
        res.status(200).json({
            message: "logged in successfully"
        })
    } else {
        res.status(401).json({ message: "Invalid email or password" })
    }
})


/**
 * @desc Logout user
 * route POST api/users/logout
 * @access Public
 */
const logoutUser = asyncHandler((req, res) => {
    res.status(200).json({ message: "Logout user" })
})


/**
 * @desc Get user profile
 * route GET api/users/profile
 * @access Private
 */
const getUserProfile = asyncHandler((req, res) => {
    res.status(200).json({ message: "user profile" })
})

/** 
 * @desc update user profile
 * route PUT api/users/profile
 * @access Private
 */
const updateUserProfile = asyncHandler((req, res) => {
    res.status(200).json({ message: "Update user profile" })
})



export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile }