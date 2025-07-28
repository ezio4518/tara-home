import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const connectDB = async () => {

    mongoose.connection.on('connected',() => {
        logger.info("DB Connected");
    })

    mongoose.connection.on('error', (err) => {
        logger.error("DB Connection Error:", { error: err });
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`)

}

export default connectDB;