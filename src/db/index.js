import mongoose from "mongoose";

const connectDB = async () => {
   
   try {
    await  mongoose.connect(process.env.MONGO_URL);
     console.log("mongoDB connected");
    
   } catch (error) {
    console.log("mongoDB connection error",error);
    process.exit(1);
   }


}

export default connectDB;