import mongoose from "mongoose";

await mongoose.connect(process.env.MONGODB_URI)

if (process.env.NODE_ENV !== "test") {
  console.log("Conected");
}

export default mongoose;
