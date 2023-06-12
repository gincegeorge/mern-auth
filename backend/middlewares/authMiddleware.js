import jwt from 'jsonwebtoken'
import User from '../models/userModels.js'
import asyncHandler from 'express-async-handler'

const protect = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.jwtUser
    console.log(token);
    if (token) {
        try {
            let decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById({ _id: decoded.userId }).select('-password')
            next()
        } catch (error) {
            res.status(401)
            throw new Error("Not authorized, invalid token")
        }
    } else {
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})

export default protect