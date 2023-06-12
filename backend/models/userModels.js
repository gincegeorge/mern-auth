import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'

var userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String
    }
}, {
    timestamps: true
})


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    console.log(this.password);
})

userSchema.methods.matchPasswords = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}


const User = model("User", userSchema, 'users')



export default User