import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // ignore if dns servers cannot be overridden
}

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
