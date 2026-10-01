import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URI;

const connectDb = async () => {
  await mongoose.connect(MONGO_URL);
};

export default connectDb;
