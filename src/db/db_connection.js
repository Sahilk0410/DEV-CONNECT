import mongoose from "mongoose"


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
        console.log(`MONGODB CONNECTED !!! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection Error", error)
    }
}

export default connectDB