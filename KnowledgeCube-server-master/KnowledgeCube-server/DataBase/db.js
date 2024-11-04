import mongoose from "mongoose";

export const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.DB);
        console.log("DB Connected!")
    } catch (error) {
        console.log(error)
    }
}