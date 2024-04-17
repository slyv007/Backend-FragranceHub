import mongoose from 'mongoose';

export const connectDB = (url)=>{
    mongoose
    .connect(url)
    .then(()=>console.log("DB CONNECTED SUCCESSFULLY"))
    .catch((err)=>console.log("Error connecting to MongoDB", err.message));

};

