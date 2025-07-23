import mongoose from "mongoose";

type ConnectionObect = {
  isConnected?: number;
};
const connection: ConnectionObect = {};
async function connect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected");
    return;
  }
  try {
    console.log("Connecting to MongoDB");
    
    const db = await mongoose.connect(process.env.MONGO_URI! || "",{});
    connection.isConnected = db.connections[0].readyState;
  } catch (error:any) {
    console.log("something went wrong",error.message);
    process.exit(1);
  }
}

export default connect;