import mongoose from "mongoose";

type ConnectionObect = {
  isConnected?: number;
};
const connection: ConnectionObect = {};
async function connect(): Promise<void> {
  if (connection.isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI!,{});
    const connection = mongoose.connection;
    connection.on("connected", () => {
    console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.log("something went wrong",error);
  }
}

export default connect;