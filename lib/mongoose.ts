import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  // To prevent unknown field queries
   mongoose.set('strictQuery', true);

   if(!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");

   if(isConnected) return console.log("DB connection established already");

   try {
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true;

    console.log("DB connection established successfully");
   } catch (error) {
    console.log(error);
   }

}
