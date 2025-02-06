import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("db successfully connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectdb;
