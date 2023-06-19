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

    if (userExists) {
        res.status(400)
        throw new Error("user already exist")
    } else {
        const user = await User({ name, email, password }).save()

        if (user) {
            res.status(201)
            let token = await generateToken(user._id)

            res.status(201)
                .cookie('jwtUser', token, {
                    httpOnly: true,
                    // secure: process.env.ENVIRONMENT !== 'development',
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                })
                .json({
                    user
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

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        let token = await generateToken(user._id)
        console.log(user);
        res.status(200)
            .cookie('jwtUser', token, {
                httpOnly: true,
                // secure: process.env.ENVIRONMENT !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            })
            .json({
                message: "logged in successfully",
                user
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
    res.status(200)
        .cookie('jwtUser', "", {
            httpOnly: true,
            maxAge: 0
        }).json({ message: "Logout user" })
})


/**
 * @desc Get user profile
 * route GET api/users/profile
 * @access Private
 */
const getUserProfile = asyncHandler((req, res) => {
    console.log(req.user);
    res.status(200).json(req.user)
})

/** 
 * @desc update user profile
 * route PUT api/users/profile
 * @access Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
    let user = await User.findById({ _id: req.user._id })
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()

        console.log(updatedUser);
        res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})



export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile }