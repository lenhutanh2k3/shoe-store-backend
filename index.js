import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import router from "./routes/index.js";
import redisClient from "./config/redis.js";

dotenv.config();
const app = express();
connectDB();

app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
  console.log('👀 Morgan log is ENABLED (Development Mode)');
}
router(app);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));