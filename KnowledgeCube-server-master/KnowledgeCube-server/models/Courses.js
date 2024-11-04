import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

export const Courses = mongoose.model("Courses", schema)