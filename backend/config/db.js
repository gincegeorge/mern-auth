import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`error: ${error.message}`);
        process.exit(1)
    }
}

export default connectDb