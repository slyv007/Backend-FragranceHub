import mongoose from "mongoose";

// create user Schema
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 32
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
       
    },
})

export default mongoose.model('Category', categorySchema);