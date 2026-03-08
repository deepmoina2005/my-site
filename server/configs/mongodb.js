import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Database already connected");
    return;
  }
  
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URL}/my-website`);
    isConnected = db.connections[0].readyState === 1;
    console.log("Database Connected");
  } catch (err) {
    console.error("Database Connection Failed", err);
  }
};

export default connectDB;