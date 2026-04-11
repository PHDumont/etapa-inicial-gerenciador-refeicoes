import mongoose from "mongoose";

const defaultUri =
  "mongodb://admin:admin@localhost:27017/db-mongodb?authSource=admin";

const uri = process.env.MONGODB_URI ?? defaultUri;

await mongoose.connect(uri);

if (process.env.NODE_ENV !== "test") {
  console.log("Conected");
}

export default mongoose;
