import { connectDB } from "./src/db.config.js";
import dotenv from "dotenv";
import express from "express";
import authRouter from './src/routes/auth.js';
import categoryRouter from './src/routes/category.js';
import productRouter from "./src/routes/product.js";
import orderRouter from "./src/routes/order.js";



dotenv.config();

// initialize express server
const app = express()
app.use(express.json());

const port = process.env.PORT 
const dbUrl = process.env.MONGODB_URI
// console.log(port);
// console.log(dbUrl);

console.log("Server started");


// connect to MongoDB
connectDB(dbUrl);


app.use("/api/auth", authRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);



app.get('/', (req, res) =>{
    res.json({success: true, message: 'OK'});
})

app.listen(port, (req, res) => {
    console.log(`Fragrance Hub Server listening on port ${port}`);
})