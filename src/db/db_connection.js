import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_URI}/${process.env.DB_NAME}`);
        console.log(`MONGODB connected at ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`MONGODB connection failed !! ${error}`);
        process.exit(1);
    }
}

export { connectDB };