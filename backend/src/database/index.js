import mongoose from "mongoose"

const dbUser = 'admin';
const dbPass = 'admin';
const dbHost = 'localhost';
const dbPort = '27017';
const dbName = 'db-mongodb';

const uri = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

mongoose.connect(uri).then(() => {console.log("Conected")})