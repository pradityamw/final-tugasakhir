import mongoose from "mongoose";

const connect = async (req, res) => {
  try {
    const connection = await mongoose.connect(process.env.URL);

    console.log(`Connecting to ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error ${error.message}`);

    process.exit(1);
  }
};

export default connect;
