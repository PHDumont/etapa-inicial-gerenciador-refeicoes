import dotenv from "dotenv";

dotenv.config();
const env={mongodbUri: process.env.MONGODB_URI || "mongodb://admin:admin@localhost:27017/db-mongodb?authSource=admin"}; 

export default env; 