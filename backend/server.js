import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import morgan from 'morgan'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import { logger, morganStream } from './utils/logger.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import analyticsRouter from './routes/analyticsRoute.js'
import categoryRouter from './routes/categoryRoute.js'
import "./utils/orderEmailCron.js"; // Must be after DB connection setup


// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())
// Use morgan for HTTP request logging and pipe it to Winston
app.use(morgan('dev', { stream: morganStream }));


app.get('/health', (req, res) => {
  logger.info("Health check endpoint hit");
  res.status(200).json({
    status: 'healthy',
    message: 'Backend API is alive and well!'
  });
});

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/analytics',analyticsRouter)
app.use('/api/category',categoryRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> logger.info('Server started on PORT : '+ port))